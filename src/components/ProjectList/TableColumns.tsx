import { ColumnsType } from 'antd/es/table';
import { Avatar, Badge, Button, Progress, Rate, Tag, Tooltip } from 'antd';
import { CalendarOutlined, InboxOutlined, SettingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useCallback } from 'react';
import { IProjectViewModel } from '@/types/project/projectViewModel.types';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { formatDate } from '@/utils/timeUtils';
import { fetchProjectCategories } from '@/features/projects/lookups/projectCategories/projectCategoriesSlice';
import { fetchProjectStatuses } from '@/features/projects/lookups/projectStatuses/projectStatusesSlice';
import { toggleFavoriteProject } from '@/features/projects/projectsSlice';
import './TableColumns.css';
import { ColumnFilterItem } from 'antd/es/table/interface';
import Avatars from '../avatars/Avatars';
import { InlineMember } from '@/types/teamMembers/inlineMember.types';
import { formatDateTime } from '@/utils/format-time-strings';
import { calculateTimeAgo } from '@/utils/calculateTimeAgo';

// Constants
const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

// Types
interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

// Utility functions
const formatDateRange = ({ startDate, endDate }: DateRange): string => {
  const formattedStart = startDate
    ? new Date(startDate).toLocaleDateString('en-US', DATE_FORMAT_OPTIONS)
    : 'N/A';
  const formattedEnd = endDate
    ? new Date(endDate).toLocaleDateString('en-US', DATE_FORMAT_OPTIONS)
    : 'N/A';
  
  return `Start date: ${formattedStart}\nEnd date: ${formattedEnd}`;
};

const getTaskProgressTitle = (data: IProjectViewModel): string => {
  if (!data.all_tasks_count) return 'No tasks available.';
  if (data.all_tasks_count === data.completed_tasks_count) return 'All tasks completed.';
  return `${data.completed_tasks_count || 0}/${data.all_tasks_count || 0} tasks completed.`;
};

// Component-specific hooks
const useProjectData = () => {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector(state => state.projectCategoriesReducer);
  const { statuses } = useAppSelector(state => state.projectStatusesReducer);

  useEffect(() => {
    const fetchData = async () => {
      if (!categories.length) await dispatch(fetchProjectCategories());
      if (!statuses.length) await dispatch(fetchProjectStatuses());
    };
    fetchData();
  }, [dispatch, categories.length, statuses.length]);

  return { categories, statuses };
};

// Reusable column components
const ProjectNameCell: React.FC<{ record: IProjectViewModel; navigate: NavigateFunction }> = ({ record, navigate }) => {
  const dispatch = useAppDispatch();

  const handleFavorite = useCallback(async () => {
    if (record.id) await dispatch(toggleFavoriteProject(record.id));
  }, [dispatch, record.id]);

  const selectProject = (record: IProjectViewModel) => {
    if (!record.id) return;
    
    let viewTab = 'tasks-list';
    switch (record.team_member_default_view) {
      case 'TASK_LIST':
        viewTab = 'tasks-list';
        break;
      case 'BOARD':
        viewTab = 'board';
        break;
      default:
        viewTab = 'tasks-list';
    }
  
    const searchParams = new URLSearchParams({
      tab: viewTab,
      pinned_tab: viewTab
    });
  
    navigate({
      pathname: `/worklenz/projects/${record.id}`,
      search: searchParams.toString()
    });
  };
  
  return (
    <div className="flex items-center">
      <Rate
        value={record.favorite ? 1 : 0}
        onChange={handleFavorite}
        count={1}
        className="mr-2"
        tooltips={['Add to favourites']}
      />
      <Badge color="geekblue" className="mr-2" />
      <span
        onClick={() => selectProject(record)}
        className="cursor-pointer"
      >
        {record.name}
        {(record.start_date || record.end_date) && (
          <Tooltip
            title={formatDateRange({
              startDate: record.start_date || null,
              endDate: record.end_date || null,
            })}
            overlayStyle={{ width: '200px' }}
          >
            <CalendarOutlined className="ml-2" />
          </Tooltip>
        )}
      </span>
    </div>
  );
};

const CategoryCell: React.FC<{ record: IProjectViewModel }> = ({ record }) => {
  if (!record.category_name) return '-';
  
  return (
    <Tooltip title={`Click to filter by "${record.category_name}"`}>
      <Tag color="#ff9c3c" className="rounded-full table-tag">
        {record.category_name}
      </Tag>
    </Tooltip>
  );
};

const ActionButtons: React.FC<{ t: (key: string) => string }> = ({ t }) => (
  <div>
    <Tooltip title={t('setting')}>
      <Button className="mr-2" size="small">
        <SettingOutlined />
      </Button>
    </Tooltip>
    <Tooltip title={t('archive')}>
      <Button size="small">
        <InboxOutlined />
      </Button>
    </Tooltip>
  </div>
);

const TableColumns = (navigate: NavigateFunction): ColumnsType<IProjectViewModel> => {
  const { t } = useTranslation('all-project-list');
  const { categories, statuses } = useProjectData();

  return useMemo(() => [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      onCell: (record) => {
        return {
          style: {
            cursor: 'pointer',
          },
        };
      },
      defaultSortOrder: 'ascend',
      showSorterTooltip: false,
      sorter: true,
      render: (_, record) => <ProjectNameCell record={record} navigate={navigate} />,
    },
    {
      title: t('client'),
      dataIndex: 'client_name',
      key: 'client_name',
      sorter: true,
      showSorterTooltip: false,
    },
    {
      title: t('category'),
      dataIndex: 'category',
      key: 'category_id',
      render: (_, record) => <CategoryCell record={record} />,
      sorter: true,
      showSorterTooltip: false,
      filters: categories.map(category => ({
        text: category.name,
        value: category.id,
      })) as ColumnFilterItem[],
      onFilter: (value, record) => record.category_name?.startsWith(value as string) || false,
    },
    {
      title: t('status'),
      key: 'status_id',
      dataIndex: 'status',
      sorter: true,
      showSorterTooltip: false,
      filters: statuses.map(status => ({
        text: status.name,
        value: status.id,
      })) as ColumnFilterItem[],
      onFilter: (value, record) => record.status?.startsWith(value as string) || false,
    },
    {
      title: t('tasksProgress'),
      key: 'tasksProgress',
      dataIndex: 'tasksProgress',
      render: (_, record) => (
        <Tooltip title={getTaskProgressTitle(record)}>
          <Progress percent={record.progress} className="project-progress" />
        </Tooltip>
      ),
    },
    {
      title: t('updated_at'),
      key: 'updated_at',
      dataIndex: 'updated_at',
      showSorterTooltip: false,
      sorter: true,
      render: (date: Date, record) => (
        <Tooltip title={record.updated_at ? formatDateTime(record.updated_at) : ''} placement="topLeft" mouseEnterDelay={0.5}>
          {record.updated_at ? calculateTimeAgo(record.updated_at) : ''}
        </Tooltip>
      ),
    },
    {
      title: t('members'),
      key: 'members',
      dataIndex: 'names',
      render: (members: InlineMember[]) => <Avatars members={members} />,
    },
    {
      title: '',
      key: 'button',
      dataIndex: '',
      render: () => <ActionButtons t={t} />,
    },
  ], [categories, statuses, t]);
};

export default TableColumns;