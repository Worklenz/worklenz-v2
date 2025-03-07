import { Button, Flex, Popconfirm, Typography } from 'antd';
import { colors } from '@/styles/colors';
import { ITaskLogViewModel } from '@/types/tasks/task-log-view.types';
import SingleAvatar from '@/components/common/single-avatar/single-avatar';
import { formatDateTimeWithLocale } from '@/utils/format-date-time-with-locale';
import { calculateTimeGap } from '@/utils/calculate-time-gap';
import './time-log-item.css';
import { taskTimeLogsApiService } from '@/api/tasks/task-time-logs.api.service';
import { useAppSelector } from '@/hooks/useAppSelector';

type TimeLogItemProps = {
  log: ITaskLogViewModel;
};

const TimeLogItem = ({ log }: TimeLogItemProps) => {
  const { user_name, avatar_url, time_spent_text, logged_by_timer, created_at } = log;
  const { selectedTaskId } = useAppSelector(state => state.taskDrawerReducer);

  const renderLoggedByTimer = () => {
    if (!logged_by_timer) return null;
    return (
      <>
        via Timer about{' '}
        <Typography.Text strong style={{ fontSize: 15 }}>
          {logged_by_timer}
        </Typography.Text>
      </>
    );
  };

  const handleDeleteTimeLog = async (logId: string | undefined) => {
    if (!logId || !selectedTaskId) return;
    const res = await taskTimeLogsApiService.delete(logId, selectedTaskId);
    if (res.done) {

    }
  };

  const renderActionButtons = () => {
    const buttonStyle = {
      backgroundColor: colors.transparent,
      color: colors.skyBlue,
      padding: 0,
    };

    return (
      <Flex gap={12} style={{ alignSelf: 'flex-end' }}>
        <Button type="text" style={buttonStyle}>
          Edit
        </Button>
        <Popconfirm
          title="Are you sure you want to delete this time log?"
          onConfirm={() => handleDeleteTimeLog(log.id)}
        >
          <Button type="text" style={buttonStyle}>
            Delete
          </Button>
        </Popconfirm>
      </Flex>
    );
  };

  return (
    <Flex vertical key={log.id}>
      <Flex gap={12} align="center">
        <SingleAvatar avatarUrl={avatar_url} name={user_name} />
        <Flex vertical>
          <Typography style={{ fontSize: 15 }}>
            <Typography.Text strong style={{ fontSize: 15 }}>
              {user_name}&nbsp;
            </Typography.Text>
            logged&nbsp;
            <Typography.Text strong style={{ fontSize: 15 }}>
              {time_spent_text}
            </Typography.Text>{' '}
            {renderLoggedByTimer()}
            {calculateTimeGap(created_at || '')}
          </Typography>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {formatDateTimeWithLocale(created_at || '')}
          </Typography.Text>
        </Flex>
      </Flex>

      {renderActionButtons()}
    </Flex>
  );
};

export default TimeLogItem;
