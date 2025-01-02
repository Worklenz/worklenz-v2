import { Typography } from 'antd';
import React from 'react';
import { durationDateFormat } from '../../../../../../../utils/durationDateFormat';

const TaskListCreatedDateCell = ({
  createdDate,
}: {
  createdDate: Date | null;
}) => {
  return (
    <Typography.Text>{durationDateFormat(createdDate || null)}</Typography.Text>
  );
};

export default TaskListCreatedDateCell;
