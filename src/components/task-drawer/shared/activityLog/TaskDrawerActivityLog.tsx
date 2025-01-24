import {
  Timeline,
  Typography,
  Tag,
  Avatar,
  Button,
  Flex,
  ConfigProvider,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import React from 'react';
import CustomAvatar from '@/components/CustomAvatar';

type ActivityType = {
  activityId: string;
  activity: string;
  activiyDoneBy: string;
  activityDoneTime: string;
};

const mockActivityList: ActivityType[] = [
  {
    activityId: '1',
    activity: 'created the task.',
    activiyDoneBy: 'Sachintha Prasad',
    activityDoneTime: '2 hours ago',
  },
  {
    activityId: '2',
    activity: 'updated the status.',
    activiyDoneBy: 'Sachintha Prasad',
    activityDoneTime: '2 hours ago',
  },
  {
    activityId: '3',
    activity: 'added an assignee.',
    activiyDoneBy: 'Sachintha Prasad',
    activityDoneTime: '2 hours ago',
  },
];

const TaskDrawerActivityLog = () => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Timeline: { itemPaddingBottom: 32, dotBorderWidth: '1.5px' },
        },
      }}
    >
      <Timeline style={{ marginBlockStart: 24 }}>
        {mockActivityList.map((activity) => (
          <Timeline.Item key={activity.activityId}>
            <Flex gap={8} align="center">
              <CustomAvatar avatarName={activity.activiyDoneBy} />
              <Flex gap={4} align="center">
                <Typography.Text strong>
                  {activity.activiyDoneBy}
                </Typography.Text>
                <Typography.Text>{activity.activity}</Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {activity.activityDoneTime}
                </Typography.Text>
              </Flex>
            </Flex>
          </Timeline.Item>
        ))}
      </Timeline>
    </ConfigProvider>
  );
};

export default TaskDrawerActivityLog;
