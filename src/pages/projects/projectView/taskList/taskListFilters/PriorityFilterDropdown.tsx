import { CaretDownFilled } from '@ant-design/icons';
import { Badge, Button, Card, Checkbox, Dropdown, List, Space } from 'antd';
import React, { useState } from 'react';
import {
  TASK_PRIORITY_HIGH_COLOR,
  TASK_PRIORITY_LOW_COLOR,
  TASK_PRIORITY_MEDIUM_COLOR,
} from '../../../../../shared/constants';
import { colors } from '../../../../../styles/colors';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../../../hooks/useAppSelector';

const PriorityFilterDropdown = () => {
  const [selectedCount, setSelectedCount] = useState<number>(0);

  // localization
  const { t } = useTranslation('taskListFilters');

  // handle selected filters count
  const handleSelectedFiltersCount = (checked: boolean) => {
    setSelectedCount((prev) => (checked ? prev + 1 : prev - 1));
  };

  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  // priority dropdown items
  type PriorityFieldsType = {
    key: string;
    label: string;
    color: string;
  };

  const priorityFieldsList: PriorityFieldsType[] = [
    { key: 'low', label: t('lowText'), color: TASK_PRIORITY_LOW_COLOR },
    {
      key: 'medium',
      label: t('mediumText'),
      color: TASK_PRIORITY_MEDIUM_COLOR,
    },
    { key: 'high', label: t('highText'), color: TASK_PRIORITY_HIGH_COLOR },
  ];

  // custom dropdown content
  const priorityDropdownContent = (
    <Card
      className="custom-card"
      style={{ width: 120 }}
      styles={{ body: { padding: 0 } }}
    >
      <List style={{ padding: 0 }}>
        {priorityFieldsList.map((item) => (
          <List.Item
            className={`custom-list-item ${themeMode === 'dark' ? 'dark' : ''}`}
            key={item.key}
            style={{
              display: 'flex',
              gap: 8,
              padding: '4px 8px',
              border: 'none',
            }}
          >
            <Space>
              <Checkbox
                id={item.key}
                onChange={(e) => handleSelectedFiltersCount(e.target.checked)}
              />
              <Badge color={item.color} />
              {item.label}
            </Space>
          </List.Item>
        ))}
      </List>
    </Card>
  );

  return (
    <Dropdown
      overlayClassName="custom-dropdown"
      trigger={['click']}
      dropdownRender={() => priorityDropdownContent}
    >
      <Button
        icon={<CaretDownFilled />}
        iconPosition="end"
        style={{
          backgroundColor:
            selectedCount > 0 ? colors.paleBlue : colors.transparent,

          color: selectedCount > 0 ? colors.darkGray : 'inherit',
        }}
      >
        <Space>
          {t('priorityText')}
          {selectedCount > 0 && (
            <Badge size="small" count={selectedCount} color={colors.skyBlue} />
          )}
        </Space>
      </Button>
    </Dropdown>
  );
};

export default PriorityFilterDropdown;
