import React, { useState } from 'react';
import { Divider, Flex, Typography } from 'antd';
import { IProjectTask } from '@/types/project/projectTasksViewModel.types';
import { ITaskLogViewModel } from '@/types/tasks/task-log-view.types';
import { formatDate } from '@/utils/timeUtils';
import SingleAvatar from '@/components/common/single-avatar/single-avatar';
import TaskTimer from '@/components/taskListCommon/task-timer/task-timer';
import { useTaskTimer } from '@/hooks/useTaskTimer';

type TaskListTimeTrackerCellProps = {
  task: IProjectTask;
};

const TaskListTimeTrackerCell = ({ task }: TaskListTimeTrackerCellProps) => {
  const [timeLogs, setTimeLogs] = useState<ITaskLogViewModel[]>([]);
  
  const { started, timeString, handleStartTimer, handleStopTimer } = useTaskTimer(
    task.id || '',
    task.timer_start_time || null
  );

  const timeTrackingLogCard = (
    <Flex vertical style={{ width: 400, height: 300, overflowY: 'scroll' }}>
      {timeLogs.map(log => (
        <React.Fragment key={log.id}>
          <Flex gap={8} align="center">
            <SingleAvatar avatarUrl={log.avatar_url} name={log.user_name} />
            <Flex vertical>
              <Typography>
                <Typography.Text strong>{log.user_name}</Typography.Text>
                <Typography.Text>{` logged ${log.time_spent_text} ${
                  log.logged_by_timer ? `via ${log.logged_by_timer}` : ''
                }`}</Typography.Text>
              </Typography>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {formatDate(new Date(log.created_at || ''))}
              </Typography.Text>
            </Flex>
          </Flex>
          <Divider style={{ marginBlock: 12 }} />
        </React.Fragment>
      ))}
    </Flex>
  );

  return (
    <TaskTimer
      started={started}
      handleStartTimer={handleStartTimer}
      handleStopTimer={handleStopTimer}
      timeString={timeString}
      timeTrackingLogCard={timeTrackingLogCard}
    />
  );
};

export default TaskListTimeTrackerCell;
