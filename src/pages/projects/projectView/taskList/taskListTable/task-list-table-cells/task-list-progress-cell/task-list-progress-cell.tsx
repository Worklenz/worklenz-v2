import { Progress, Tooltip } from 'antd';
import React from 'react';
import './task-progress-cell.css';

type TaskListProgressCellProps = {
  progress: number;
  numberOfSubTasks: number;
};

const TaskListProgressCell = ({
  progress = 0,
  numberOfSubTasks = 0,
}: TaskListProgressCellProps) => {
  const totalTasks = numberOfSubTasks + 1;
  const completedTasks = 0;

  const size = progress === 100 ? 21 : 26;

  return (
    <Tooltip title={`${completedTasks} / ${totalTasks}`}>
      <Progress
        percent={progress}
        type="circle"
        size={size}
        style={{ cursor: 'default' }}
        className="task-progress"
      />
    </Tooltip>
  );
};

export default TaskListProgressCell;
