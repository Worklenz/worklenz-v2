import { ExpandAltOutlined, SyncOutlined } from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Flex,
  Segmented,
  Select,
  Skeleton,
  Table,
  TableProps,
  Tooltip,
  Typography,
} from 'antd';
import React, { useState } from 'react';
import ListView from './list-view';
import CalendarView from './calendar-view';
import { useAppSelector } from '@/hooks/useAppSelector';
import EmptyListPlaceholder from '@components/EmptyListPlaceholder';
import StatusDropdown from '@components/task-list-common/statusDropdown/StatusDropdown';
import { TaskType } from '@/types/task.types';
import { toggleUpdateTaskDrawer } from '@features/tasks/taskSlice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { colors } from '@/styles/colors';
import UpdateTaskDrawer from '@features/tasks/taskCreationAndUpdate/updateTaskDrawer/UpdateTaskDrawer';
import { t } from 'i18next';
import { IMyDashboardMyTask } from '@/types/home/tasks.types';
import { IHomeTasksConfig } from '@/types/home/home-page.types';
import { IProject } from '@/types/project/project.types';

const TasksList = () => {
  const [tasksList, setTasksList] = useState<IMyDashboardMyTask[]>([]);
  const [groups, setGroups] = useState<IMyDashboardMyTask[]>([]);

  const [viewOptions, setViewOptions] = useState<'List' | 'Calendar'>('List');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(state => state.themeReducer.mode);
  const myTasksActiveFilterKey = 'my-dashboard-active-filter';
  const { projects } = useAppSelector(state => state.homePageReducer);

  const taskModes = [
    {
      value: 0,
      label: t('home:tasks.assignedToMe'),
    },
    {
      value: 1,
      label: t('home:tasks.assignedByMe'),
    },
  ];

  const [config, setConfig] = useState<IHomeTasksConfig>({
    tasks_group_by: taskModes[0].value,
    current_view: 0,
    current_tab: 'my_tasks',
    selected_date: new Date(),
    is_calendar_view: false,
    time_zone: '',
  });


  const getActiveProjectsFilter = () => {
    return +(localStorage.getItem(myTasksActiveFilterKey) || 0);
  };

  const setActiveProjectsFilter = (value: number) => {
    localStorage.setItem(myTasksActiveFilterKey, value.toString());
  };

  // function for handle refresh
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  // function for handle segmaent change and render the calender
  const handleSegmentChange = (value: 'List' | 'Calendar') => {
    if (value === 'Calendar') {
      setViewOptions('Calendar');
      handleRefresh();
    } else {
      setViewOptions('List');
      handleRefresh();
    }
  };

  // table columns
  const columns: TableProps<TaskType>['columns'] = [
    {
      key: 'task',
      title: 'Task',
      width: '400px',
      render: (values) => (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Tooltip title={values.task}>
            <Typography.Text style={{ textTransform: 'capitalize' }}>{values.task}</Typography.Text>
          </Tooltip>
          <div className="row-button">
            <Tooltip title={'Click open task form'}>
              <Button
                type="text"
                icon={<ExpandAltOutlined />}
                onClick={() => {
                  dispatch(toggleUpdateTaskDrawer());
                }}
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
      title: 'Project',
      width: '180px',
      render: (values) => {
        const project = projects.find(project => project.name === values.project);
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
      title: 'Status',
      width: '180px',
      render: (values) => <StatusDropdown currentStatus={values.status} />,
    },
    {
      key: 'dueDate',
      title: 'Due Date',
      width: '180px',
      dataIndex: 'dueDate',
    },
  ];

  return (
    <Card
      title={
        <Flex gap={8} align="center">
          <Typography.Title level={5} style={{ margin: 0 }}>
            Tasks
          </Typography.Title>
          <Select
            defaultValue="0"
            options={taskModes}
            onChange={(value) => {
              setConfig({ ...config, tasks_group_by: +value });
            }}
            
          />
        </Flex>
      }
      extra={
        <Flex gap={8} align="center">
          <Tooltip title={'Refresh'} trigger={'hover'}>
            <Button
              shape="circle"
              icon={<SyncOutlined spin={isLoading} />}
              onClick={() => handleRefresh()}
            />
          </Tooltip>
          <Segmented<'List' | 'Calendar'>
            options={['List', 'Calendar']}
            defaultValue="List"
            onChange={(value: 'List' | 'Calendar') => handleSegmentChange(value)}
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
      ) : tasksList.length === 0 ? (
        <EmptyListPlaceholder
          imageSrc="https://app.worklenz.com/assets/images/empty-box.webp"
          text=" No tasks to show."
        />
      ) : (
        <Table
          className="custom-two-colors-row-table"
          dataSource={tasksList}
          rowKey={record => record.id}
          columns={columns}
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
