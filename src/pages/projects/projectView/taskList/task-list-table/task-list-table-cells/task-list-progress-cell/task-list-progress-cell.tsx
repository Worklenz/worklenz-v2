import { Progress, Tooltip } from 'antd';
import './task-progress-cell.css';
import { IProjectTask } from '@/types/project/projectTasksViewModel.types';
import { useSocket } from '@/socket/socketContext';
import { useEffect } from 'react';
import { SocketEvents } from '@/shared/socket-events';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateTaskProgress } from '@/features/tasks/tasks.slice';

type TaskListProgressCellProps = {
  task: IProjectTask;
};

const TaskListProgressCell = ({ task }: TaskListProgressCellProps) => {
  const { socket } = useSocket();
  const dispatch = useAppDispatch();

  const handleTaskProgressUpdate = (response: {
    id: string;
    parent_task: string;
    complete_ratio: number;
    completed_count: number;
    total_tasks_count: number;
  }) => {
    if (response && (response.parent_task === task.id || response.id === task.id)) {
      dispatch(updateTaskProgress({
        taskId: task.id,
        progress: response.complete_ratio,
        totalTasksCount: response.total_tasks_count,
        completedCount: response.completed_count,
      }));
    }
  };

  useEffect(() => {
    socket?.on(SocketEvents.GET_TASK_PROGRESS.toString(), handleTaskProgressUpdate);

    return () => {
      socket?.removeListener(SocketEvents.GET_TASK_PROGRESS.toString(), handleTaskProgressUpdate);
    };
  }, [socket]);

  return (
    <Tooltip title={`${task.completed_count} / ${task.total_tasks_count}`}>
      <Progress
        percent={task.complete_ratio || 0}
        type="circle"
        size={24}
        style={{ cursor: 'default' }}
        strokeWidth={(task.complete_ratio || 0) >= 100 ? 9 : 7}
      />
    </Tooltip>
  );
};

export default TaskListProgressCell;
