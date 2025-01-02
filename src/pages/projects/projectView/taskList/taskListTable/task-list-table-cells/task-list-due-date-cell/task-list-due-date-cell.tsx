import { DatePicker } from 'antd';
import React from 'react';
import { colors } from '../../../../../../../styles/colors';
import dayjs from 'dayjs';

const TaskListDueDateCell = ({ dueDate }: { dueDate: Date | null }) => {
  const dueDayjs = dueDate ? dayjs(dueDate) : null;
  return (
    <DatePicker
      placeholder="Set  Date"
      value={dueDayjs}
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

export default TaskListDueDateCell;
