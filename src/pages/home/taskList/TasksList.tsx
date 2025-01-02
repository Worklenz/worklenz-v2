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
import ListView from './ListView';
import CalendarView from './CalendarView';
import { useAppSelector } from '../../../hooks/useAppSelector';
import EmptyListPlaceholder from '../../../components/EmptyListPlaceholder';
import StatusDropdown from '../../../components/taskListCommon/statusDropdown/StatusDropdown';
import { TaskType } from '../../../types/task.types';
import { toggleUpdateTaskDrawer } from '../../../features/tasks/taskSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { colors } from '../../../styles/colors';
import UpdateTaskDrawer from '../../../features/tasks/taskCreationAndUpdate/updateTaskDrawer/UpdateTaskDrawer';

const TasksList = () => {
  const tasksList = useAppSelector((state) => state.taskReducer.tasks);
  const projectList = useAppSelector(
    (state) => state.projectReducer.projectsList
  );
  const [listView, setListView] = useState<'List' | 'Calendar'>('List');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  // function for handle refresh
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  // function for handle segmaent change and render the calender
  const handleSegmentChange = (value: 'List' | 'Calendar') => {
    if (value === 'Calendar') {
      setListView('Calendar');
      handleRefresh();
    } else {
      setListView('List');
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
            <Typography.Text style={{ textTransform: 'capitalize' }}>
              {values.task}
            </Typography.Text>
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
        const project = projectList.find(
          (project) => project.projectName === values.project
        );
        return (
          project && (
            <Tooltip title={project.projectName}>
              <Typography.Paragraph style={{ margin: 0, paddingInlineEnd: 6 }}>
                <Badge
                  color={project.projectColor}
                  style={{ marginInlineEnd: 4 }}
                />
                {project.projectName}
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
            defaultValue="assigned to me"
            options={[
              {
                value: 'assigned to me',
                label: 'assigned to me',
              },
              {
                value: 'assigned by me',
                label: 'assigned by me',
              },
            ]}
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
            onChange={(value: 'List' | 'Calendar') =>
              handleSegmentChange(value)
            }
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
      {listView === 'List' ? <ListView /> : <CalendarView />}

      {/* task list table --> render with different filters and views  */}
      {isLoading ? (
        <Skeleton />
      ) : tasksList.length === 0 ? (
        <EmptyListPlaceholder text=" No tasks to show." />
      ) : (
        <Table
          className="custom-two-colors-row-table"
          dataSource={tasksList}
          rowKey={(record) => record.taskId}
          columns={columns}
          pagination={false}
          size="middle"
          rowClassName={() => 'custom-row-height'}
          onRow={(record) => {
            return {
              className: 'group',
              style: {
                height: 44,
              },
            };
          }}
        />
      )}
      <UpdateTaskDrawer taskId={'SP-1'} />
    </Card>
  );
};

export default TasksList;
