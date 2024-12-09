import { Typography } from 'antd';
import React from 'react';
import { durationDateFormat } from '../../../../../../../utils/durationDateFormat';

const TaskListLastUpdatedCell = ({
  lastUpdated,
}: {
  lastUpdated: Date | null;
}) => {
  return (
    <Typography.Text>{durationDateFormat(lastUpdated || null)}</Typography.Text>
  );
};

export default TaskListLastUpdatedCell;
