import { colors } from "@/styles/colors";
import { PlayCircleFilled } from "@ant-design/icons";
import { Flex, Button, Popover, Typography, Divider } from "antd/es";

interface TaskTimerProps {
  started: boolean;
  handleStartTimer: () => void;
  handleStopTimer: () => void;
  timeString: string;
  timeTrackingLogCard: React.ReactNode;
}

const TaskTimer = ({ started, handleStartTimer, handleStopTimer, timeString, timeTrackingLogCard }: TaskTimerProps) => {
  const renderStopIcon = () => {
    return (
      <span
        className="nz-icon"
        style={{ fontSize: 8, position: 'relative', top: -1, left: 0, right: 0, bottom: 0 }}
      >
        <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
          <path d="M864 64H160C107 64 64 107 64 160v704c0 53 43 96 96 96h704c53 0 96-43 96-96V160c0-53-43-96-96-96z"></path>
        </svg>
      </span>
    );
  };

  return (
    <Flex gap={4} align="center">
      {started ? (
        <Button type="text" icon={renderStopIcon()} onClick={handleStopTimer} />
      ) : (
        <Button
          type="text"
          icon={<PlayCircleFilled style={{ color: colors.skyBlue, fontSize: 16 }} />}
          onClick={handleStartTimer}
        />
      )}
      <Popover
        title={
          <Typography.Text style={{ fontWeight: 500 }}>
            Time Tracking Log
            <Divider style={{ marginBlockStart: 8, marginBlockEnd: 12 }} />
          </Typography.Text>
        }
        content={timeTrackingLogCard}
        trigger="click"
        placement="bottomRight"
      >
        <Typography.Text style={{ cursor: 'pointer' }}>{timeString}</Typography.Text>
      </Popover>
    </Flex>
  );
};

export default TaskTimer;

