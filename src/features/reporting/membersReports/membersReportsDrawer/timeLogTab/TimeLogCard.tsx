import { Card, ConfigProvider, Tag, Timeline, Typography } from 'antd';
import React from 'react';
import { simpleDateFormat } from '@/utils/simpleDateFormat';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { toggleTaskDrawer } from '@/features/tasks/tasks.slice';
import { useTranslation } from 'react-i18next';

type LogEntry = {
  time_spent: number;
  created_at: string;
  task_id: string;
  project_id: string;
  project_name: string;
  task_name: string;
  task_key: string;
  time_spent_string: string;
};

type Log = {
  log_day: string;
  logs: LogEntry[];
};

type TimeLogCardProps = {
  data: Log;
  setSelectedTaskId: (id: string) => void;
};

const TimeLogCard = ({ data, setSelectedTaskId }: TimeLogCardProps) => {
  // localization
  const { t } = useTranslation('reporting-members-drawer');

  const dispatch = useAppDispatch();

  // function to handle task drawer open
  const handleUpdateTaskDrawer = (id: string) => {
    setSelectedTaskId(id);
    dispatch(toggleTaskDrawer());
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Timeline: { itemPaddingBottom: 24, dotBorderWidth: '2px' },
        },
      }}
    >
      <Card
        title={
          <Typography.Text style={{ fontSize: 16, fontWeight: 500 }}>
            {simpleDateFormat(data.log_day)}
          </Typography.Text>
        }
      >
        <Timeline>
          {data.logs.map(log => (
            <Timeline.Item key={log.created_at}>
              <Typography.Text
                className="cursor-pointer hover:text-[#1899ff]"
                onClick={() => handleUpdateTaskDrawer(log.task_id)}
              >
                {t('loggedText')} <strong>{log.time_spent_string}</strong> {t('forText')}{' '}
                <strong>{log.task_name}</strong> {t('inText')} <strong>{log.project_name}</strong>{' '}
                <Tag>{log.task_key}</Tag>
              </Typography.Text>
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>
    </ConfigProvider>
  );
};

export default TimeLogCard;
