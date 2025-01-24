import { Badge, Card, Dropdown, Flex, Menu, MenuProps, Typography } from 'antd';
import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
// custom css file
import './phaseDropdown.css';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { PhaseOption } from '../../../types/phase.types';
import { colors } from '../../../styles/colors';
import { useTranslation } from 'react-i18next';

const PhaseDropdown = ({ projectId }: { projectId: string }) => {
  const [currentPhaseOption, setCurrentPhaseOption] =
    useState<PhaseOption | null>(null);

  // localization
  const { t } = useTranslation('task-list-table');

  // get phase data from redux
  const phaseList = useAppSelector((state) => state.phaseReducer.phaseList);

  //get phases details from phases slice
  const phase = phaseList.find((el) => el.projectId === projectId);

  // menu type
  type MenuItem = Required<MenuProps>['items'][number];
  // phase menu item
  const phaseMenuItems: MenuItem[] = phase
    ? phase.phaseOptions.map((option) => ({
        key: option.optionId,
        label: (
          <Flex gap={4}>
            <Badge color={option.optionColor} /> {option.optionName}
          </Flex>
        ),
      }))
    : [];

  // Handle phase select
  const handlePhaseOptionSelect: MenuProps['onClick'] = (e) => {
    const selectedOption = phase?.phaseOptions.find(
      (option) => option.optionId === e.key
    );
    if (selectedOption) {
      setCurrentPhaseOption(selectedOption);
    }
  };

  //dropdown items
  const phaseDropdownItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Card className="phase-dropdown-card" bordered={false}>
          <Menu
            className="phase-menu"
            items={phaseMenuItems}
            onClick={handlePhaseOptionSelect}
          />
        </Card>
      ),
    },
  ];

  return (
    <Dropdown
      overlayClassName="phase-dropdown"
      menu={{ items: phaseDropdownItems }}
      placement="bottomRight"
      trigger={['click']}
    >
      <Flex
        gap={6}
        align="center"
        justify="space-between"
        style={{
          width: 'fit-content',
          borderRadius: 24,
          paddingInline: 8,
          height: 22,
          fontSize: 13,
          backgroundColor: currentPhaseOption?.optionColor,
          color: colors.darkGray,
          cursor: 'pointer',
        }}
      >
        {currentPhaseOption ? (
          <Typography.Text
            ellipsis={{ expanded: false }}
            style={{
              textTransform: 'capitalize',
              color: colors.darkGray,
              fontSize: 13,
            }}
          >
            {currentPhaseOption?.optionName}
          </Typography.Text>
        ) : (
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            {t('selectText')}
          </Typography.Text>
        )}

        <DownOutlined style={{ fontSize: 12 }} />
      </Flex>
    </Dropdown>
  );
};

export default PhaseDropdown;
