import { CaretDownFilled } from '@ant-design/icons';
import { Flex, Select } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

type GroupType = 'status' | 'priority' | 'phase';

type GroupByFilterProps = {
  setActiveGroup: (group: GroupType) => void;
};

const GroupByFilter = ({ setActiveGroup }: GroupByFilterProps) => {
  // localization
  const { t } = useTranslation('reporting-projects-drawer');

  const handleChange = (value: string) => {
    setActiveGroup(value as GroupType);
  };

  const groupDropdownMenuItems = [
    { key: 'status', value: 'status', label: t('statusText') },
    { key: 'priority', value: 'priority', label: t('priorityText') },
    {
      key: 'phase',
      value: 'phase',
      label: t('phaseText'),
    },
  ];

  return (
    <Flex align="center" gap={4} style={{ marginInlineStart: 12 }}>
      {t('groupByText')}
      <Select
        defaultValue={'status'}
        options={groupDropdownMenuItems}
        onChange={handleChange}
        suffixIcon={<CaretDownFilled />}
      />
    </Flex>
  );
};

export default GroupByFilter;
