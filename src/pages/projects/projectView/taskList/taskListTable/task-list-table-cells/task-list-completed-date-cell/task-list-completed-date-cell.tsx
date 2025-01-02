import { Typography } from 'antd';
import React from 'react';
import { durationDateFormat } from '../../../../../../../utils/durationDateFormat';

const TaskListCompletedDateCell = ({
  completedDate,
}: {
  completedDate: Date | null;
}) => {
  return (
    <Typography.Text>
      {durationDateFormat(completedDate || null)}
    </Typography.Text>
  );
};

export default TaskListCompletedDateCell;
