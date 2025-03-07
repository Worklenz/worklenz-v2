import { CaretDownFilled } from '@ant-design/icons';
import { Button, Card, DatePicker, Divider, Dropdown, Flex, List, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { colors } from '@/styles/colors';
import { useAppSelector } from '@/hooks/useAppSelector';
import { durations } from '@/shared/constants';

interface ITimeWiseFilterProps {
  duration: string;
  dateRange: string;
  setDuration: (duration: string) => void;
  setDateRange: (dateRange: string) => void;
}

const TimeWiseFilter = ({ duration, dateRange, setDuration, setDateRange }: ITimeWiseFilterProps) => {
  const { t } = useTranslation('reporting-members');

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<string>(
    durations.find(item => item.key === duration)?.label || 'lastSevenDaysText',
  );
  const [customRange, setCustomRange] = useState<[string, string] | null>(
    dateRange ? [dateRange.split('-')[0], dateRange.split('-')[1]] : null,
  );
  const { mode: themeMode } = useAppSelector(state => state.themeReducer);

  // custom dropdown content
  const timeWiseDropdownContent = (
    <Card
      className="custom-card"
      styles={{
        body: {
          padding: 0,
          minWidth: 320,
        },
      }}
    >
      <List style={{ padding: 0 }}>
        {durations.map(item => (
          <List.Item
            className={`custom-list-item ${themeMode === 'dark' ? 'dark' : ''}`}
            key={item.key}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 24,
              padding: '4px 8px',
              backgroundColor:
                selectedTimeFrame === item.label && themeMode === 'dark'
                  ? '#424242'
                  : selectedTimeFrame === item.label && themeMode === 'light'
                    ? colors.paleBlue
                    : colors.transparent,
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={() => {
              setSelectedTimeFrame(item.label);
              setCustomRange(null);
              setDuration(item.key);
              setDateRange(item.dates || '');
            }}
          >
            <Typography.Text
              style={{
                color: selectedTimeFrame === item.label ? colors.skyBlue : 'inherit',
              }}
            >
              {t(item.label)}
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {item.dates}
            </Typography.Text>
          </List.Item>
        ))}
      </List>

      <Divider style={{ marginBlock: 12 }} />

      <Flex vertical gap={8} style={{ padding: 8 }}>
        <Typography.Text>{t('customRangeText')}</Typography.Text>

        <DatePicker.RangePicker
          format={'MMM DD, YYYY'}
          onChange={(dates, dateStrings) => {
            if (dates) {
              setSelectedTimeFrame('');
              setCustomRange([dateStrings[0], dateStrings[1]]);
            }
          }}
        />

        <Button
          type="primary"
          size="small"
          style={{ width: 'fit-content', alignSelf: 'flex-end' }}
          onClick={() => {
            if (customRange) {
              setSelectedTimeFrame('customRange');
              setIsDropdownOpen(false);
            }
          }}
        >
          {t('filterButton')}
        </Button>
      </Flex>
    </Card>
  );

  return (
    <Dropdown
      overlayClassName="custom-dropdown"
      trigger={['click']}
      dropdownRender={() => timeWiseDropdownContent}
      onOpenChange={open => setIsDropdownOpen(open)}
    >
      <Button
        icon={<CaretDownFilled />}
        iconPosition="end"
        className={`transition-colors duration-300 ${
          isDropdownOpen
            ? 'border-[#1890ff] text-[#1890ff]'
            : 'hover:text-[#1890ff hover:border-[#1890ff]'
        }`}
      >
        {customRange ? `${customRange[0]} - ${customRange[1]}` : t(selectedTimeFrame)}
      </Button>
    </Dropdown>
  );
};

export default TimeWiseFilter;
