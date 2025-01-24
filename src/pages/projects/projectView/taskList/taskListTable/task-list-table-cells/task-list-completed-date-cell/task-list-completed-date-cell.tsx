import { Typography } from 'antd';
import React from 'react';
import { durationDateFormat } from '@/utils/durationDateFormat';

const TaskListCompletedDateCell = ({
  completedDate,
}: {
  completedDate: string | null;
}) => {
  return (
    <Typography.Text>
      {durationDateFormat(completedDate || null)}
    </Typography.Text>
  );
};

export default TaskListCompletedDateCell;
