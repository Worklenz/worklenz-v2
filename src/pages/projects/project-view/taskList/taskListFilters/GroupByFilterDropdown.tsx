import { CaretDownFilled } from '@ant-design/icons';
import { ConfigProvider, Flex, Select } from 'antd';
import React, { useState } from 'react';
import { colors } from '../../../../../styles/colors';
import ConfigPhaseButton from '../../../../../features/projects/singleProject/phase/ConfigPhaseButton';
import { useSelectedProject } from '../../../../../hooks/useSelectedProject';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import CreateStatusButton from '../../../../../features/projects/status/CreateStatusButton';
import { useTranslation } from 'react-i18next';

const GroupByFilterDropdown = () => {
  type GroupTypes = 'status' | 'priority' | 'phase';

  const [activeGroup, setActiveGroup] = useState<GroupTypes>('status');

  // localization
  const { t } = useTranslation('task-list-filters');

  const handleChange = (value: string) => {
    setActiveGroup(value as GroupTypes);
  };

  // get selected project from useSelectedPro
  const selectedProject = useSelectedProject();

  //get phases details from phases slice
  const phase =
    useAppSelector((state) => state.phaseReducer.phaseList).find(
      (phase) => phase.projectId === selectedProject?.projectId
    ) || null;

  const groupDropdownMenuItems = [
    { key: 'status', value: 'status', label: t('statusText') },
    { key: 'priority', value: 'priority', label: t('priorityText') },
    {
      key: 'phase',
      value: 'phase',
      label: phase ? phase?.phase : t('phaseText'),
    },
  ];

  return (
    <Flex align="center" gap={4} style={{ marginInlineStart: 12 }}>
      {t('groupByText')}:
      <Select
        defaultValue={'status'}
        options={groupDropdownMenuItems}
        onChange={handleChange}
        suffixIcon={<CaretDownFilled />}
      />
      {(activeGroup === 'status' || activeGroup === 'phase') && (
        <ConfigProvider wave={{ disabled: true }}>
          {activeGroup === 'phase' && (
            <ConfigPhaseButton color={colors.skyBlue} />
          )}
          {activeGroup === 'status' && <CreateStatusButton />}
        </ConfigProvider>
      )}
    </Flex>
  );
};

export default GroupByFilterDropdown;
