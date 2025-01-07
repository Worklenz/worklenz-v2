import { ColumnsType } from 'antd/es/table';
import { ColumnFilterItem } from 'antd/es/table/interface';
import { useTranslation } from 'react-i18next';
import { NavigateFunction } from 'react-router-dom';
import { useMemo } from 'react';
import { IProjectViewModel } from '@/types/project/projectViewModel.types';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAuthService } from '@/hooks/useAuth';
import { InlineMember } from '@/types/teamMembers/inlineMember.types';
import { IProjectStatus } from '@/types/project/projectStatus.types';
import { IProjectCategory } from '@/types/project/projectCategory.types';
import { ProjectNameCell } from './project-list-table/project-name/project-name-cell';
import { ProgressListProgress } from './project-list-table/project-list-progress/progress-list-progress';
import { ProjectListUpdatedAt } from './project-list-table/project-list-updated-at/project-list-updated';
import { ActionButtons } from './project-list-table/project-list-actions/project-list-actions';
import Avatars from '../avatars/avatars';
import './TableColumns.css';
import { CategoryCell } from './project-list-table/project-list-category/project-list-category';
import { setFilteredCategories } from '@/features/projects/projectsSlice';

const TableColumns = (
  navigate: NavigateFunction,
  statuses: IProjectStatus[],
  categories: IProjectCategory[],
  setProjectId: (id: string) => void,
  filteredCategories: string[]
): ColumnsType<IProjectViewModel> => {
  const { t } = useTranslation('all-project-list');
  const dispatch = useAppDispatch();
  const isOwnerOrAdmin = useAuthService().isOwnerOrAdmin();

  return useMemo(
    () => [
      {
        title: t('name'),
        dataIndex: 'name',
        key: 'name',
        onCell: record => {
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
        render: (_, record) => <CategoryCell key={record.id} t={t} record={record} />,
        sorter: true,
        showSorterTooltip: false,
        filters: categories.map(category => ({
          text: category.name,
          value: category.id,
        })) as ColumnFilterItem[],
        filteredValue: filteredCategories,
        onReset: () => dispatch(setFilteredCategories([])),
        onFilter: (value, record) => record.category_id?.startsWith(value as string) || false,
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
        render: (_, record) => <ProgressListProgress record={record} />,
      },
      {
        title: t('updated_at'),
        key: 'updated_at',
        dataIndex: 'updated_at',
        showSorterTooltip: false,
        sorter: true,
        render: (_, record) => <ProjectListUpdatedAt record={record} />,
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
        render: (record: IProjectViewModel) => (
          <ActionButtons
            t={t}
            record={record}
            setProjectId={setProjectId}
            dispatch={dispatch}
            isOwnerOrAdmin={isOwnerOrAdmin}
          />
        ),
      },
    ],
    [categories, statuses, t]
  );
};

export default TableColumns;
