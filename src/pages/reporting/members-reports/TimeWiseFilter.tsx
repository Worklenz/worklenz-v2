import { CaretDownFilled } from '@ant-design/icons';
import {
  Button,
  Card,
  DatePicker,
  Divider,
  Dropdown,
  Flex,
  List,
  Typography,
} from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../styles/colors';

const TimeWiseFilter = () => {
  // localization
  const { t } = useTranslation('reporting-members');

  // state to track dropdown open status
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // state to track selected time frame
  const [selectedTimeFrame, setSelectedTimeFrame] =
    useState<string>('lastSevenDaysText');
  // state to track custom range
  const [customRange, setCustomRange] = useState<[string, string] | null>(null);

  // timeWise dropdown items
  type TimeFramesType = {
    key: string;
    label: string;
    duration: string | null;
  };

  const timeFramesList: TimeFramesType[] = [
    { key: 'yesterday', label: 'yesterdayText', duration: 'Nov,18 2024' },
    {
      key: 'lastSevenDays',
      label: 'lastSevenDaysText',
      duration: 'Nov,12 2024 - Nov,19 2024',
    },
    {
      key: 'lastWeek',
      label: 'lastWeekText',
      duration: 'Nov,12 2024 - Nov,19 2024',
    },
    {
      key: 'lastThirtyDays',
      label: 'lastThirtyDaysText',
      duration: 'Nov,12 2024 - Nov,19 2024',
    },
    {
      key: 'lastMonth',
      label: 'lastMonthText',
      duration: 'Nov,12 2024 - Nov,19 2024',
    },
    {
      key: 'lastThreeMonths',
      label: 'lastThreeMonthsText',
      duration: 'Nov,12 2024 - Nov,19 2024',
    },
    {
      key: 'allTime',
      label: 'allTimeText',
      duration: null,
    },
  ];

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
        {timeFramesList.map((item) => (
          <List.Item
            className="custom-list-item"
            key={item.key}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 24,
              padding: '4px 8px',
              backgroundColor:
                selectedTimeFrame === item.label
                  ? colors.paleBlue
                  : colors.transparent,
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={() => {
              setSelectedTimeFrame(item.label);
              setCustomRange(null);
              setIsDropdownOpen(false);
            }}
          >
            <Typography.Text
              style={{
                color:
                  selectedTimeFrame === item.label ? colors.skyBlue : 'inherit',
              }}
            >
              {t(item.label)}
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {item.duration}
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
      onOpenChange={(open) => setIsDropdownOpen(open)}
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
        {customRange
          ? `${customRange[0]} - ${customRange[1]}`
          : t(selectedTimeFrame)}
      </Button>
    </Dropdown>
  );
};

export default TimeWiseFilter;
