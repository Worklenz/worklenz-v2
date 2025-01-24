import {
  DownloadOutlined,
  PlayCircleFilled,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Divider, Flex, Typography } from 'antd';
import React, { useState } from 'react';
import { colors } from '@/styles/colors';
import EmptyListPlaceholder from '@/components/EmptyListPlaceholder';
import { themeWiseColor } from '@/utils/themeWiseColor';
import { useAppSelector } from '@/hooks/useAppSelector';
import TimeLogForm from './TimeLogForm';
import TimeLogList from './TimeLogList';

type TimeLog = {
  logId: string;
  username: string;
  duration: string;
  date: string;
  via?: string;
};

const TaskDrawerTimeLog = () => {
  const [timeLoggedList, setTimeLoggedList] = useState<TimeLog[]>([
    {
      logId: '1',
      username: 'Sachintha Prasad',
      duration: '1h 0m',
      date: 'Sep 22, 2023, 10:47:02 AM',
    },
    {
      logId: ' 4',
      username: 'Raveesha Dilanka',
      duration: '1m 4s',
      date: 'Sep 12, 2023, 8:32:49 AM - Sep 12, 2023, 8:33:53 AM',
      via: 'Timer',
    },
  ]);
  const [isAddTimelogFormShow, setIsTimeLogFormShow] = useState<boolean>(false);
  const [hoverRow, setHoverRow] = useState<string | null>(null);

  // get theme details from theme slice
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  return (
    <Flex
      vertical
      justify="space-between"
      style={{ width: '100%', height: '78vh' }}
    >
      <Flex vertical>
        <Flex align="center" justify="space-between" style={{ width: '100%' }}>
          <Typography.Text type="secondary">
            Total Logged: 0m 0s
          </Typography.Text>
          <Flex gap={8} align="center">
            <Flex gap={4} align="center">
              <PlayCircleFilled
                style={{ color: colors.skyBlue, fontSize: 22 }}
              />
              <Typography.Text style={{ fontSize: 12 }}>0m 0s</Typography.Text>
            </Flex>
            <Button size="small" icon={<DownloadOutlined />}>
              Export to Excel
            </Button>
          </Flex>
        </Flex>
        <Divider style={{ marginBlock: 8 }} />
        {timeLoggedList.length > 0 ? (
          <TimeLogList timeLoggedList={timeLoggedList} />
        ) : (
          <Flex vertical gap={8} align="center">
            <EmptyListPlaceholder
              text="No time logs found in the task."
              imageHeight={120}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ width: 'fit-content' }}
              onClick={() => setIsTimeLogFormShow(true)}
            >
              Add Timelog
            </Button>
          </Flex>
        )}
      </Flex>

      {!isAddTimelogFormShow && timeLoggedList.length > 0 && (
        <Flex
          gap={8}
          vertical
          align="center"
          justify="center"
          style={{
            width: '100%',
            position: 'relative',
            height: 'fit-content',
            justifySelf: 'flex-end',
            paddingBlockStart: 24,
          }}
        >
          <div
            style={{
              marginBlockEnd: 0,
              height: 1,
              position: 'absolute',
              top: 0,
              width: '120%',
              backgroundColor: themeWiseColor('#ebebeb', '#3a3a3a', themeMode),
            }}
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ width: '100%' }}
            onClick={() => setIsTimeLogFormShow(true)}
          >
            Add Timelog
          </Button>
        </Flex>
      )}

      {isAddTimelogFormShow && (
        <TimeLogForm onCancel={() => setIsTimeLogFormShow(false)} />
      )}
    </Flex>
  );
};

export default TaskDrawerTimeLog;
