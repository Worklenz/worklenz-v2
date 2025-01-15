import { ExpandAltOutlined, SyncOutlined } from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  DatePicker,
  Flex,
  Segmented,
  Select,
  Skeleton,
  Table,
  TableProps,
  Tooltip,
  Typography,
} from 'antd';
import { useState, useEffect, useRef, useMemo } from 'react';
import ListView from './list-view';
import CalendarView from './calendar-view';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import EmptyListPlaceholder from '@components/EmptyListPlaceholder';
import StatusDropdown from '@components/task-list-common/statusDropdown/StatusDropdown';
import { toggleUpdateTaskDrawer } from '@features/tasks/taskSlice';
import { colors } from '@/styles/colors';
import UpdateTaskDrawer from '@features/tasks/taskCreationAndUpdate/updateTaskDrawer/UpdateTaskDrawer';
import { fetchHomeTasks, setHomeTasksConfig } from '@/features/home-page/home-page.slice';
import { IMyTask } from '@/types/home/my-tasks.types';
import { ITaskStatus } from '@/types/tasks/taskStatus.types';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const TasksList: React.FC = () => {
  const [viewOptions, setViewOptions] = useState<'List' | 'Calendar'>('List');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(state => state.themeReducer.mode);
  const { projects, homeTasksConfig, model, homeTasksLoading } = useAppSelector(
    state => state.homePageReducer
  );
  const { t } = useTranslation();

  const taskModes = useMemo(() => [
    {
      value: 0,
      label: t('home:tasks.assignedToMe'),
    },
    {
      value: 1,
      label: t('home:tasks.assignedByMe'),
    },
  ], [t]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleSegmentChange = (value: 'List' | 'Calendar') => {
    setViewOptions(value);
    handleRefresh();
  };

  const columns: TableProps<IMyTask>['columns'] = useMemo(() => [
    {
      key: 'name',
      title: t('tasks.name'),
      width: '400px',
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Tooltip title={record.name}>
            <Typography.Text style={{ textTransform: 'capitalize' }}>{record.name}</Typography.Text>
          </Tooltip>
          <div className="row-button">
            <Tooltip title={'Click open task form'}>
              <Button
                type="text"
                icon={<ExpandAltOutlined />}
                onClick={() => dispatch(toggleUpdateTaskDrawer())}
                style={{
                  backgroundColor: colors.transparent,
                  padding: 0,
                  height: 'fit-content',
                }}
              >
                Open
              </Button>
            </Tooltip>
          </div>
        </div>
      ),
    },
    {
      key: 'project',
      title: t('tasks.project'),
      width: '180px',
      render: (_, record) => {
        const project = projects.find(project => project.name === record.project_name);
        return (
          project && (
            <Tooltip title={project.name}>
              <Typography.Paragraph style={{ margin: 0, paddingInlineEnd: 6 }}>
                <Badge color={project.color_code} style={{ marginInlineEnd: 4 }} />
                {project.name}
              </Typography.Paragraph>
            </Tooltip>
          )
        );
      },
    },
    {
      key: 'status',
      title: t('tasks.status'),
      width: '180px',
      render: (_, record) => (
        <StatusDropdown
          statusList={record.project_statuses as ITaskStatus[]}
          task={record}
          teamId={record.team_id || ''}
          onChange={() => {}}
        />
      ),
    },
    {
      key: 'dueDate',
      title: t('tasks.dueDate'),
      width: '180px',
      dataIndex: 'end_date',
      render: (_, record) => <DatePicker defaultValue={dayjs(record.end_date || '')} format={'MMM DD, YYYY'} placeholder={t('tasks.dueDatePlaceholder')} />,
    },
  ], [projects, t]);

  const handleTaskModeChange = (value: number) => {
    dispatch(setHomeTasksConfig({ ...homeTasksConfig, tasks_group_by: +value }));
  };

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (homeTasksLoading) return;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      dispatch(fetchHomeTasks(homeTasksConfig));
      return;
    }

    const debounceTimer = setTimeout(() => {
      dispatch(fetchHomeTasks(homeTasksConfig));
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [homeTasksConfig, dispatch]);

  return (
    <Card
      title={
        <Flex gap={8} align="center">
          <Typography.Title level={5} style={{ margin: 0 }}>
            Tasks
          </Typography.Title>
          <Select
            defaultValue={taskModes[0].label}
            options={taskModes}
            onChange={value => handleTaskModeChange(+value)}
            fieldNames={{ label: 'label', value: 'value' }}
          />
        </Flex>
      }
      extra={
        <Flex gap={8} align="center">
          <Tooltip title={'Refresh'} trigger={'hover'}>
            <Button
              shape="circle"
              icon={<SyncOutlined spin={isLoading} />}
              onClick={handleRefresh}
            />
          </Tooltip>
          <Segmented<'List' | 'Calendar'>
            options={['List', 'Calendar']}
            defaultValue="List"
            onChange={handleSegmentChange}
          />
        </Flex>
      }
      style={{
        width: '100%',
        border: '1px solid transparent',
        boxShadow:
          themeMode === 'dark'
            ? 'rgba(0, 0, 0, 0.4) 0px 4px 12px, rgba(255, 255, 255, 0.06) 0px 2px 4px'
            : '#7a7a7a26 0 5px 16px',
      }}
    >
      {/* toggle task view list / calendar */}
      {viewOptions === 'List' ? <ListView /> : <CalendarView />}

      {/* task list table --> render with different filters and views  */}
      {isLoading ? (
        <Skeleton />
      ) : model.total === 0 ? (
        <EmptyListPlaceholder
          imageSrc="https://app.worklenz.com/assets/images/empty-box.webp"
          text=" No tasks to show."
        />
      ) : (
        <Table
          className="custom-two-colors-row-table"
          dataSource={model.tasks}
          rowKey={record => record.id}
          columns={columns as TableProps<IMyTask>['columns']}
          pagination={false}
          size="middle"
          rowClassName={() => 'custom-row-height'}
        />
      )}
      <UpdateTaskDrawer taskId={'SP-1'} />
    </Card>
  );
};

export default TasksList;
