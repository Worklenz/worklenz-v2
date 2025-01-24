import { Typography } from 'antd';
import { durationDateFormat } from '@/utils/durationDateFormat';

const TaskListCreatedDateCell = ({
  createdDate,
}: {
  createdDate: string | null;
}) => {
  return (
    <Typography.Text>{durationDateFormat(createdDate || null)}</Typography.Text>
  );
};

export default TaskListCreatedDateCell;
