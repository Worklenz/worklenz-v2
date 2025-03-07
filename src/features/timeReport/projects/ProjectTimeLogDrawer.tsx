import { Avatar, Button, Card, Divider, Drawer, Tag, Timeline, Typography } from 'antd';
import React from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { toggleTimeLogDrawer } from './timeLogSlice';
import { DownloadOutlined } from '@ant-design/icons';
import jsonData from './ProjectTimeLog.json';
import { AvatarNamesMap } from '../../../shared/constants';
import './ProjectTimeLogDrawer.css';
import { useTranslation } from 'react-i18next';

const ProjectTimeLogDrawer: React.FC = () => {
  const isTimeLogDrawerOpen = useAppSelector(state => state.timeLogReducer.isTimeLogDrawerOpen);
  const selectedLabel = useAppSelector(state => state.timeLogReducer.selectedLabel);
  const dispatch = useAppDispatch();
  const { t } = useTranslation('time-report');

  // Filter the data based on selectedLabel
  const filteredData = jsonData.log_data.filter(logItem =>
    logItem.logs.some(log => log.project_name === selectedLabel)
  );

  // Sort the filtered data by log_day in descending order (latest date first)
  filteredData.sort((a, b) => new Date(b.log_day).getTime() - new Date(a.log_day).getTime());

  // Format date to desired format
  const formatDate = (date: string) => {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    return formattedDate;
  };

  return (
    <Drawer
      width={736}
      open={isTimeLogDrawerOpen}
      onClose={() => dispatch(toggleTimeLogDrawer())}
      title={<Typography.Title level={5}>{selectedLabel}</Typography.Title>}
    >
      <div style={{ textAlign: 'right', width: '100%', height: '40px' }}>
        <Button size="small" icon={<DownloadOutlined />}>
          {t('exportToExcel')}
        </Button>
      </div>
      {filteredData.map(logItem => (
        <div>
          <Card
            className="time-log-card"
            title={
              <Typography.Text
                style={{ fontWeight: 500, fontSize: '16px', overflowWrap: 'break-word' }}
              >
                {formatDate(logItem.log_day)}
              </Typography.Text>
            }
            key={logItem.log_day}
          >
            <Timeline>
              {logItem.logs.map((log, index) => (
                <Timeline.Item key={index}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Avatar
                      style={{
                        backgroundColor: AvatarNamesMap[log.user_name.charAt(0)],
                        width: '26px',
                        height: '26px',
                      }}
                    >
                      {log.user_name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography.Text>
                      <b>{log.user_name}</b> {t('logged')} <b>{log.time_spent_string}</b> {t('for')}{' '}
                      <b>{log.task_name}</b> <Tag>{log.task_key}</Tag>
                    </Typography.Text>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
          <Divider />
        </div>
      ))}
    </Drawer>
  );
};

export default ProjectTimeLogDrawer;
