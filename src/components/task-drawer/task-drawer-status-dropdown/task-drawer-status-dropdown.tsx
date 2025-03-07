import { updateTaskStatus } from '@/features/tasks/tasks.slice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { SocketEvents } from '@/shared/socket-events';
import { useSocket } from '@/socket/socketContext';
import { ITaskListStatusChangeResponse } from '@/types/tasks/task-list-status.types';
import { ITaskViewModel } from '@/types/tasks/task.types';
import { ITaskStatus } from '@/types/tasks/taskStatus.types';
import { Select } from 'antd';
import { useEffect, useMemo } from 'react';

interface TaskDrawerStatusDropdownProps {
  statuses: ITaskStatus[];
  task: ITaskViewModel;
  teamId: string;
}

const TaskDrawerStatusDropdown = ({ statuses, task, teamId }: TaskDrawerStatusDropdownProps) => {
  const { socket, connected } = useSocket();
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(state => state.themeReducer.mode);

  const getTaskProgress = (taskId: string) => {
    socket?.emit(SocketEvents.GET_TASK_PROGRESS.toString(), taskId);
  };

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

  const options = useMemo(
    () =>
      statuses.map(status => ({
        value: status.id,
        label: status.name,
      })),
    [statuses]
  );

  return (
    <>
      {task.status_id && (
        <Select
          variant="borderless"
          value={task.status_id}
          onChange={handleStatusChange}
          dropdownStyle={{ borderRadius: 8, minWidth: 150, maxWidth: 200 }}
          style={{
            backgroundColor: themeMode === 'dark' ? task.status_color_dark : task.status_color,
            borderRadius: 16,
          }}
          labelRender={status => {
            return <span style={{ fontSize: 13 }}>{status.label}</span>;
          }}
          options={options}
        />
      )}
    </>
  );
};

export default TaskDrawerStatusDropdown;
