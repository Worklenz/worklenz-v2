import {
  Button,
  DatePicker,
  DatePickerProps,
  Flex,
  Select,
  Space,
  Spin,
  Alert,
  Skeleton,
} from 'antd';
import React, { useEffect, useRef } from 'react';
import { SettingOutlined, ReloadOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import {
  fetchDateList,
  fetchTeamData,
  setDate,
  setType,
  toggleSettingsDrawer,
} from '@/features/schedule/scheduleSlice';
import ScheduleSettingsDrawer from '@/features/schedule/ScheduleSettingsDrawer';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '@/hooks/useDoumentTItle';
import ScheduleDrawer from '@/features/schedule/ScheduleDrawer';
import GranttChart from '@/components/schedule/grant-chart/grantt-chart';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { PickerType } from '@/types/schedule/schedule-v2.types';

const { Option } = Select;

const PickerWithType = ({
  type,
  onChange,
  date,
  disabled = false,
}: {
  type: PickerType;
  onChange: DatePickerProps['onChange'];
  date?: Date;
  disabled?: boolean;
}) => {
  return (
    <DatePicker
      value={dayjs(date)}
      picker={type}
      onChange={onChange}
      disabled={disabled}
      aria-label={`Select ${type}`}
    />
  );
};

const Schedule: React.FC = () => {
  const { t } = useTranslation('schedule');
  const dispatch = useAppDispatch();
  const granttChartRef = useRef<any>(null);
  const { date, type, loading, error, dateList, teamData } = useAppSelector(
    state => state.scheduleReducer
  );

  // Define more granular loading states
  const isTeamDataLoading = loading && (!teamData || teamData.length === 0);
  const isDateDataLoading = loading && (!dateList || !dateList.date_data);
  const isControlsDisabled = loading;

  useDocumentTitle(t('schedule'));

  // Initial data fetch only on component mount
  useEffect(() => {
    // We only want to fetch team data once when the component mounts
    // The GranttChart component will handle fetching data when date/type changes
    const initialFetch = async () => {
      await dispatch(fetchTeamData());
      await dispatch(fetchDateList({ date, type }));
    };

    initialFetch();
    // Don't include date or type in dependencies to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleDateChange = (value: dayjs.Dayjs | null) => {
    if (!value) return;
    let selectedDate = value.toDate();

    // If 'Month' is selected, default to the first day of the selected month
    if (type === 'month') {
      selectedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    }

    dispatch(setDate(selectedDate));
  };

  const handleToday = () => {
    const today = new Date();
    dispatch(setDate(today));
    granttChartRef.current?.scrollToToday();
  };

  const handleRefresh = () => {
    dispatch(fetchDateList({ date, type }));
    dispatch(fetchTeamData());
  };

  return (
    <div style={{ marginBlockStart: 65, minHeight: '90vh' }}>
      <Flex align="center" justify="space-between">
        <Flex
          gap={16}
          align="center"
          style={{
            paddingTop: '25px',
            paddingBottom: '20px',
          }}
        >
          <Button onClick={handleToday} aria-label={t('goToToday')}>
            {t('today')}
          </Button>
          <Space>
            <Select
              value={type}
              onChange={value => dispatch(setType(value))}
              aria-label={t('selectViewType')}
            >
              <Option value="week">{t('week')}</Option>
              <Option value="month">{t('month')}</Option>
            </Select>
            <PickerWithType date={date as Date} type={type} onChange={handleDateChange} />
          </Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            size="small"
            aria-label={t('refresh')}
          />
        </Flex>

        <Button
          size="small"
          shape="circle"
          onClick={() => dispatch(toggleSettingsDrawer())}
          aria-label={t('openSettings')}
          disabled={isControlsDisabled}
        >
          <SettingOutlined />
        </Button>
      </Flex>

      {error && (
        <Alert
          message={t('error')}
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Flex vertical gap={24}>
        {isTeamDataLoading ? (
          <Flex vertical gap={12} style={{ height: 300 }}>
            <Skeleton.Button active block style={{ height: 60 }} />
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                active
                avatar
                paragraph={{ rows: 0 }}
                style={{ marginBottom: 10 }}
              />
            ))}
          </Flex>
        ) : isDateDataLoading ? (
          <Flex justify="space-between" align="start" style={{ height: 300 }}>
            <Flex vertical style={{ width: 375 }}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  key={index}
                  active
                  avatar
                  paragraph={{ rows: 0 }}
                  style={{ marginBottom: 10, paddingInline: 12 }}
                />
              ))}
            </Flex>
            <Flex vertical style={{ flex: 1 }}>
              <Skeleton.Button active block style={{ height: 60, marginBottom: 10 }} />
              <Skeleton active paragraph={{ rows: 4 }} style={{ marginBottom: 10 }} />
            </Flex>
          </Flex>
        ) : (
          <GranttChart type={type} date={date} ref={granttChartRef} />
        )}
      </Flex>

      <ScheduleSettingsDrawer />
      <ScheduleDrawer />
    </div>
  );
};

export default Schedule;
