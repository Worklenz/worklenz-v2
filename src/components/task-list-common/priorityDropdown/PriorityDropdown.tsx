import { Badge, Flex, Select, Typography } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { getPriorityColor } from '../../../utils/getPriorityColors';
import './priorityDropdown.css';

const PriorityDropdown = ({ currentPriority: selectedPriority }: { currentPriority: string }) => {
  const [priority, setPriority] = useState<string>(selectedPriority);
  const priorityList = useAppSelector((state) => state.priorityReducer.priorities);

  // localization
  const { t } = useTranslation('task-list-table');

  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  const handlePriorityChange = (value: string) => {
    const selectedOption = priorityList.find((el) => el.value === value);
    if (selectedOption) {
      setPriority(selectedOption.value);
    }
  };

  return (
    <Select
      value={priority}
      onChange={handlePriorityChange}
      style={{ width: 120 }}
      dropdownStyle={{ borderRadius: 8 }}
      options={priorityList.map((priority) => ({
        value: priority.value,
        label: (
          <Flex gap={8} align="center">
            <Badge color={getPriorityColor(priority.value, themeMode)} />
            <Typography.Text>
              {t(priority.name + 'SelectorText')}
            </Typography.Text>
          </Flex>
        ),
      }))}
    />
  );
};

export default PriorityDropdown;
