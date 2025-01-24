import { DatePicker } from 'antd';
import { colors } from '@/styles/colors';
import dayjs from 'dayjs';

const TaskListStartDateCell = ({ startDate }: { startDate: string | null }) => {
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
