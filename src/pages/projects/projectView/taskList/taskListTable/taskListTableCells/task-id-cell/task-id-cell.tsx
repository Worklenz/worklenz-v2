import { Tag, Tooltip } from 'antd';
import React from 'react';

const TaskIdCell = ({ taskId }: { taskId: string | null }) => {
  return (
    <Tooltip title={taskId} className="flex justify-center">
      <Tag>{taskId}</Tag>
    </Tooltip>
  );
};

export default TaskIdCell;
