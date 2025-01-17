import React from 'react';
import HomeCalendar from '../../../components/calendars/homeCalendar/HomeCalendar';
import { Tag, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { useAppSelector } from '@/hooks/useAppSelector';
import AddTaskInlineForm from './add-task-inline-form';
import { useTranslation } from 'react-i18next';

const CalendarView = () => {
  const {homeTasksConfig} = useAppSelector((state) => state.homePageReducer);
  const {t} = useTranslation('home');

  return (
    <div>
      <HomeCalendar />

      <Tag
        icon={<ClockCircleOutlined style={{ fontSize: 16 }} />}
        color="success"
        style={{
          display: 'flex',
          width: '100%',
          padding: '8px 12px',
          marginBlock: 12,
        }}
      >
        <Typography.Text>
          {t('home:tasks.dueOn')} {homeTasksConfig.selected_date?.format('MMM DD, YYYY')}
        </Typography.Text>
      </Tag>

      <AddTaskInlineForm t={t} />
    </div>
  );
};

export default CalendarView;
