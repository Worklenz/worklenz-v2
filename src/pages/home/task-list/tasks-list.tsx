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
import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import ListView from './list-view';
import CalendarView from './calendar-view';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import EmptyListPlaceholder from '@components/EmptyListPlaceholder';
import StatusDropdown from '@components/task-list-common/statusDropdown/StatusDropdown';
import { colors } from '@/styles/colors';
import { fetchHomeTasks, setHomeTasksConfig } from '@/features/home-page/home-page.slice';
import { IMyTask } from '@/types/home/my-tasks.types';
import { ITaskStatus } from '@/types/tasks/taskStatus.types';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { toggleTaskDrawer } from '@/features/tasks/tasks.slice';
import TaskDrawer from '@/components/task-drawer/task-drawer';
import { useGetMyTasksQuery } from '@/api/home-page/home-page.api.service';
import { IHomeTasksModel } from '@/types/home/home-page.types';
import type { Dayjs } from 'dayjs';
import { useSocket } from '@/socket/socketContext';
import { SocketEvents } from '@/shared/socket-events';
import './tasks-list.css';

const TasksList: React.FC = React.memo(() => {
  const dispatch = useAppDispatch();
  const { socket, connected } = useSocket();

  const [viewOptions, setViewOptions] = useState<'List' | 'Calendar'>('List');
  const themeMode = useAppSelector(state => state.themeReducer.mode);

  const { homeTasksConfig } = useAppSelector(state => state.homePageReducer);
  const { data, isFetching: homeTasksFetching, refetch, isLoading } = useGetMyTasksQuery(homeTasksConfig);

  const { t } = useTranslation('home');
  const { model } = useAppSelector(state => state.homePageReducer);

  const taskModes = useMemo(
    () => [
      {
        value: 0,
        label: t('home:tasks.assignedToMe'),
      },
      {
        value: 1,
        label: t('home:tasks.assignedByMe'),
      },
    ],
    [t]
  );

  const handleSegmentChange = (value: 'List' | 'Calendar') => {
    setViewOptions(value);
    dispatch(setHomeTasksConfig({ ...homeTasksConfig, is_calendar_view: value === 'Calendar' }));
    refetch();
  };

  const handleEndDateChanged = (value: Dayjs | null, taskId: string) => {
    if (!value || !taskId) return;

    const body = {
      task_id: taskId,
      end_date: value.format('YYYY-MM-DD'),
    };
    socket?.emit(SocketEvents.TASK_END_DATE_CHANGE.toString(), JSON.stringify(body));
  };

  const handleStatusChange = (value: string, taskId: string) => {
    if (!value || !taskId) return;
    const body = {
      task_id: taskId,
      status: value,
    };
    socket?.emit(SocketEvents.TASK_STATUS_CHANGE.toString(), JSON.stringify(body));
  };

  const handleChangeReceived = (value: any) => {
    refetch();
  };

  useEffect(() => {
    refetch();
  }, [homeTasksConfig]);

  useEffect(() => {
    socket?.on(SocketEvents.TASK_END_DATE_CHANGE.toString(), handleChangeReceived);
    socket?.on(SocketEvents.TASK_STATUS_CHANGE.toString(), handleChangeReceived);
    return () => {
      socket?.removeListener(SocketEvents.TASK_END_DATE_CHANGE.toString(), handleChangeReceived);
      socket?.removeListener(SocketEvents.TASK_STATUS_CHANGE.toString(), handleChangeReceived);
    };
  }, [connected]);

  const columns: TableProps<IMyTask>['columns'] = useMemo(
    () => [
      {
        key: 'name',
        title: t('tasks.name'),
        width: '400px',
        render: (_, record) => (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Tooltip title={record.name}>
              <Typography.Text>
                {record.name}
              </Typography.Text>
            </Tooltip>
            <div className="row-action-button">
              <Tooltip title={'Click open task form'}>
                <Button
                  type="text"
                  icon={<ExpandAltOutlined />}
                  onClick={() => dispatch(toggleTaskDrawer())}
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
          return (
            <Tooltip title={record.project_name}>
              <Typography.Paragraph style={{ margin: 0, paddingInlineEnd: 6 }}>
                <Badge color={record.phase_color} style={{ marginInlineEnd: 4 }} />
                {record.project_name}
              </Typography.Paragraph>
            </Tooltip>
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
            onChange={value => handleStatusChange(value || '', record.id || '')}
          />
        ),
      },
      {
        key: 'dueDate',
        title: t('tasks.dueDate'),
        width: '180px',
        dataIndex: 'end_date',
        render: (_, record) => (
          <DatePicker
            allowClear
            disabledDate={record.start_date ? (current => current.isBefore(dayjs(record.start_date))) : undefined}
            format={'MMM DD, YYYY'}
            placeholder={t('tasks.dueDatePlaceholder')}
            defaultValue={record.end_date ? dayjs(record.end_date) : null}
            onChange={value => handleEndDateChanged(value || null, record.id || '')}
          />
        ),
      },
    ],
    [t]
  );

  const handleTaskModeChange = (value: number) => {
    dispatch(setHomeTasksConfig({ ...homeTasksConfig, tasks_group_by: +value }));
    refetch();
  };

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
              icon={<SyncOutlined spin={homeTasksFetching} />}
              onClick={refetch}
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
      {viewOptions === 'List' ? (
        <ListView refetch={refetch} model={data?.body || (model as IHomeTasksModel)} />
      ) : (
        <CalendarView />
      )}

      {/* task list table --> render with different filters and views  */}
      {homeTasksFetching && !isLoading ? (
        <Skeleton active/>
      ) : data?.body.total === 0 ? (
        <EmptyListPlaceholder
          imageSrc="https://app.worklenz.com/assets/images/empty-box.webp"
          text=" No tasks to show."
        />
      ) : (
        <Table
          className="custom-two-colors-row-table"
          dataSource={data?.body.tasks}
          rowKey={record => record.id || ''}
          columns={columns as TableProps<IMyTask>['columns']}
          pagination={false}
          size="middle"
          rowClassName={() => 'custom-row-height'}
          loading={homeTasksFetching}
        />
      )}
      <TaskDrawer />
    </Card>
  );
});

export default TasksList;
