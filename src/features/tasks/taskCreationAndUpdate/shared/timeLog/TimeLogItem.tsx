import { Button, Flex, Typography } from 'antd';
import CustomAvatar from '../../../../../components/CustomAvatar';
import { colors } from '../../../../../styles/colors';

type TimeLogItemProps = {
  log: {
    logId: string;
    username: string;
    duration: string;
    date: string;
    via?: string;
  };
  onHover: (logId: string | null) => void;
  isHovered: boolean;
};

const TimeLogItem = ({ log, onHover, isHovered }: TimeLogItemProps) => {
  return (
    <Flex
      vertical
      key={log.logId}
      onMouseEnter={() => onHover(log.logId)}
      onMouseLeave={() => onHover(null)}
    >
      <Flex gap={12} align="center">
        <CustomAvatar avatarName={log.username} size={22} />
        <Flex vertical>
          <Typography style={{ fontSize: 15 }}>
            <Typography.Text strong style={{ fontSize: 15 }}>
              {log.username}
            </Typography.Text>{' '}
            logged{' '}
            <Typography.Text strong style={{ fontSize: 15 }}>
              {log.duration}
            </Typography.Text>{' '}
            {log?.via && `via `}
            {log?.via && (
              <Typography.Text strong style={{ fontSize: 15 }}>
                {log.via}
              </Typography.Text>
            )}
            {' '} 5 hours ago
          </Typography>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {log.date}
          </Typography.Text>
        </Flex>
      </Flex>

      {isHovered ? (
        <Flex gap={12} style={{ alignSelf: 'flex-end' }}>
          <Button
            type="text"
            style={{
              backgroundColor: colors.transparent,
              color: colors.skyBlue,
              padding: 0,
            }}
          >
            Edit
          </Button>
          <Button
            type="text"
            style={{
              backgroundColor: colors.transparent,
              color: colors.skyBlue,
              padding: 0,
            }}
          >
            Delete
          </Button>
        </Flex>
      ) : (
        <div style={{ width: '100%', height: 32 }} />
      )}
    </Flex>
  );
};

export default TimeLogItem;
