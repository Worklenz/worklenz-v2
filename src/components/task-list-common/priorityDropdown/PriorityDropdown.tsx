import { Flex, Select, Typography } from 'antd';
import './priorityDropdown.css';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useMemo } from 'react';
import { ALPHA_CHANNEL } from '@/shared/constants';
import { useSocket } from '@/socket/socketContext';
import { SocketEvents } from '@/shared/socket-events';
import { ITaskListStatusChangeResponse } from '@/types/tasks/task-list-status.component';
import { IProjectTask } from '@/types/project/projectTasksViewModel.types';
import { getCurrentGroup, GROUP_BY_STATUS_VALUE } from '@/features/tasks/tasks.slice';
import { ITaskPriority } from '@/types/tasks/taskPriority.types';
import { DoubleLeftOutlined, MinusOutlined, PauseOutlined } from '@ant-design/icons';

type PriorityDropdownProps = {
  task: IProjectTask;
  teamId: string;
};

const PriorityDropdown = ({ task, teamId }: PriorityDropdownProps) => {
  const { t } = useTranslation('task-list-table');
  const { socket, connected } = useSocket();

  const [selectedPriority, setSelectedPriority] = useState<ITaskPriority | undefined>(undefined);
  const priorityList = useAppSelector(state => state.priorityReducer.priorities);

  const themeMode = useAppSelector(state => state.themeReducer.mode);

  const handleStatusChange = (statusId: string) => {
    if (!task.id || !statusId) return;

    socket?.emit(
      SocketEvents.TASK_STATUS_CHANGE.toString(),
      JSON.stringify({
        task_id: task.id,
        status_id: statusId,
        parent_task: task.parent_task_id || null,
        team_id: teamId,
      })
    );

    getTaskProgress(task.id);
  };

  const handleTaskStatusChange = (response: ITaskListStatusChangeResponse) => {
    if (response && response.id === task.id) {
      task.status_color = response.color_code;
      task.complete_ratio = +response.complete_ratio || 0;
      task.status = response.status_id;
      task.status_category = response.statusCategory;
    }
  };

  const handlePriorityChange = (priorityId: string) => {
    if (!task.id || !priorityId) return;

    socket?.emit(SocketEvents.TASK_PRIORITY_CHANGE.toString(), JSON.stringify({
      task_id: task.id,
      priority_id: priorityId,
      team_id: teamId,
    }));
  };

  const getTaskProgress = (taskId: string) => {
    socket?.emit(SocketEvents.GET_TASK_PROGRESS.toString(), taskId);
  };

  useEffect(() => {
    const foundPriority = priorityList.find(priority => priority.id === task.priority);
    setSelectedPriority(foundPriority);
  }, [task.priority, priorityList]);

  useEffect(() => {
    socket?.on(SocketEvents.TASK_STATUS_CHANGE.toString(), handleTaskStatusChange);

    return () => {
      socket?.removeListener(SocketEvents.TASK_STATUS_CHANGE.toString(), handleTaskStatusChange);
    };
  }, [task.status, connected]);

  const options = useMemo(
    () =>
      priorityList.map(priority => ({
        value: priority.id,
        label: (
          <Flex gap={8} align="center" justify="space-between">
            {priority.name}
            {priority.name === 'Low' && <MinusOutlined style={{ color: priority.color_code }} />}
            {priority.name === 'Medium' && (
              <PauseOutlined
                style={{ color: priority.color_code, transform: 'rotate(90deg)' }}
              />
            )}
            {priority.name === 'High' && (
              <DoubleLeftOutlined style={{ color: priority.color_code, transform: 'rotate(90deg)' }} />
            )}
          </Flex>
        ),
      })),
    [priorityList]
  );

  return (
    <>
      {task.priority && (
        <Select
          variant="borderless"
          value={task.priority}
          onChange={handlePriorityChange}
          dropdownStyle={{ borderRadius: 8, minWidth: 150, maxWidth: 200 }}
          style={{
            backgroundColor: selectedPriority?.color_code + ALPHA_CHANNEL,
            borderRadius: 16,
            height: 22,
          }}
          labelRender={value => {
            const priority = priorityList.find(priority => priority.id === value.value);
            return priority ? <Typography.Text style={{ fontSize: 13 }}>{priority.name}</Typography.Text> : '';
          }}
          options={options}
        />
      )}
    </>
  );
};

export default PriorityDropdown;
