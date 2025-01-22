import { Button, DatePicker, DatePickerProps, Flex, Select, Space } from 'antd';
import React, { useRef, useState } from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { toggleSettingsDrawer } from '../../features/schedule/scheduleSlice';
import ScheduleSettingsDrawer from '../../features/schedule/ScheduleSettingsDrawer';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '../../hooks/useDoumentTItle';
import ScheduleDrawer from '../../features/schedule/ScheduleDrawer';
import GranttChart from '../../components/schedule/grant-chart/grantt-chart';

const { Option } = Select;

type PickerType = 'week' | 'month';

const PickerWithType = ({
  type,
  onChange,
}: {
  type: PickerType;
  onChange: DatePickerProps['onChange'];
}) => {
  return <DatePicker picker={type} onChange={onChange} />;
};

const Schedule: React.FC = () => {
  const [type, setType] = useState<PickerType>('week');
  const [date, setDate] = useState<Date | null>(null);
  const { t } = useTranslation('schedule');

  const dispatch = useDispatch();

  const granttChartRef = useRef<any>(null);

  useDocumentTitle('Schedule');

  const handleDateChange = (value: dayjs.Dayjs | null) => {
    if (!value) return;
    let selectedDate = value.toDate();

    // If 'Month' is selected, default to the first day of the selected month
    if (type === 'month') {
      selectedDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1
      );
    }

    setDate(selectedDate);
  };

  const handleToday = () => {
    const today = new Date();
    setDate(today);
    granttChartRef.current?.scrollToToday();
    console.log('Today:', today);
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
          <Button onClick={handleToday}>{t('today')}</Button>
          <Space>
            <Select
              value={type}
              onChange={(value) => setType(value as PickerType)}
            >
              <Option value="week">{t('week')}</Option>
              <Option value="month">{t('month')}</Option>
            </Select>
            <PickerWithType type={type} onChange={handleDateChange} />
          </Space>
        </Flex>
        <Button
          size="small"
          shape="circle"
          onClick={() => dispatch(toggleSettingsDrawer())}
        >
          <SettingOutlined />
        </Button>
      </Flex>

      <Flex vertical gap={24}>
        <GranttChart ref={granttChartRef} />
      </Flex>

      <ScheduleSettingsDrawer />
      <ScheduleDrawer />
    </div>
  );
};

export default Schedule;
