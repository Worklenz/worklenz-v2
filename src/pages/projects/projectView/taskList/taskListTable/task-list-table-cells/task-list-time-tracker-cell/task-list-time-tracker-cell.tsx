import React from 'react';
import { Divider, Empty, Flex, Popover, Typography } from 'antd';
import { PlayCircleFilled } from '@ant-design/icons';
import { colors } from '../../../../../../../styles/colors';
import CustomAvatar from '../../../../../../../components/CustomAvatar';
import { mockTimeLogs } from './mockTimeLogs';

<<<<<<<< HEAD:src/pages/projects/project-view/taskList/taskListTable/taskListTableCells/TimeTracker.tsx
type TimeTrackerProps = {
  taskId: string | null | undefined;
========
type TaskListTimeTrackerCellProps = {
  taskId: string | null;
>>>>>>>> fe2cb7ec9eb6d7b65feb978cc74206ea4146b1f7:src/pages/projects/projectView/taskList/taskListTable/task-list-table-cells/task-list-time-tracker-cell/task-list-time-tracker-cell.tsx
  initialTime?: number;
};

const TaskListTimeTrackerCell = ({
  taskId,
  initialTime = 0,
}: TaskListTimeTrackerCellProps) => {
  const minutes = Math.floor(initialTime / 60);
  const seconds = initialTime % 60;
  const formattedTime = `${minutes}m ${seconds}s`;

  const timeTrackingLogCard =
    initialTime > 0 ? (
      <Flex vertical style={{ width: 400, height: 300, overflowY: 'scroll' }}>
        {mockTimeLogs.map((log) => (
          <React.Fragment key={log.logId}>
            <Flex gap={8} align="center">
              <CustomAvatar avatarName={log.username} />

              <Flex vertical>
                <Typography>
                  <Typography.Text strong>{log.username}</Typography.Text>
                  <Typography.Text>{` logged ${log.duration} ${
                    log.via ? `via ${log.via}` : ''
                  }`}</Typography.Text>
                </Typography>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {log.date}
                </Typography.Text>
              </Flex>
            </Flex>
            <Divider style={{ marginBlock: 12 }} />
          </React.Fragment>
        ))}
      </Flex>
    ) : (
      <Empty style={{ width: 400 }} />
    );

  return (
    <Flex gap={4} align="center">
      <PlayCircleFilled style={{ color: colors.skyBlue, fontSize: 16 }} />
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
        <Typography.Text style={{ cursor: 'pointer' }}>
          {formattedTime}
        </Typography.Text>
      </Popover>
    </Flex>
  );
};

export default TaskListTimeTrackerCell;
