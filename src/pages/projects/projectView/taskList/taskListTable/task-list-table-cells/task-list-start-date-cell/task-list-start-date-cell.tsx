import { DatePicker } from 'antd';
import React from 'react';
import { colors } from '../../../../../../../styles/colors';
import dayjs from 'dayjs';

const TaskListStartDateCell = ({ startDate }: { startDate: Date | null }) => {
  const startDayjs = startDate ? dayjs(startDate) : null;
  return (
    <DatePicker
      placeholder="Set  Date"
      value={startDayjs}
      format={'MMM DD, YYYY'}
      suffixIcon={null}
      style={{
        backgroundColor: colors.transparent,
        border: 'none',
        boxShadow: 'none',
      }}
    />
  );
};

export default TaskListStartDateCell;
