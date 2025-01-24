import { Typography } from 'antd';
import { durationDateFormat } from '@/utils/durationDateFormat';

const TaskListLastUpdatedCell = ({
  lastUpdated,
}: {
  lastUpdated: string | null;
}) => {
  return (
    <Typography.Text>{durationDateFormat(lastUpdated || null)}</Typography.Text>
  );
};

export default TaskListLastUpdatedCell;
