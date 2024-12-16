import { Badge, Card, Dropdown, Flex, Menu, MenuProps, Typography } from 'antd';
import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { healthStatusData } from '@/lib/project/projectConstants';
import { colors } from '@/styles/colors';
import './project-health-cell.css';
import { useTranslation } from 'react-i18next';

type HealthStatusDataType = {
  value: string;
  label: React.ReactNode;
  color: string;
};

const ProjectHealthCell = () => {
  const [projectHealth, setProjectHealth] =
    useState<HealthStatusDataType | null>(healthStatusData[0] || null);

  // localization
  const { t } = useTranslation('reporting-projects');

  // health selection options
  const healthOptions = healthStatusData.map((status) => ({
    key: status.value,
    label: (
      <Typography.Text
        style={{ display: 'flex', alignItems: 'center', gap: 4 }}
      >
        <Badge color={status.color} /> {t(`${status.value}Text`)}
      </Typography.Text>
    ),
  }));

  // handle health status select
  const onClick: MenuProps['onClick'] = (e) => {
    const selectedStatus = healthStatusData.find(
      (status) => status.value === e.key
    );
    if (selectedStatus) {
      setProjectHealth(selectedStatus);
    }
  };

  // dropdown items
  const projectHealthCellItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Card className="project-health-dropdown-card" bordered={false}>
          <Menu
            className="project-health-menu"
            items={healthOptions}
            onClick={onClick}
          />
        </Card>
      ),
    },
  ];

  return (
    <Dropdown
      overlayClassName="project-health-dropdown"
      menu={{ items: projectHealthCellItems }}
      placement="bottomRight"
      trigger={['click']}
    >
      <Flex
        gap={6}
        align="center"
        style={{
          width: 'fit-content',
          borderRadius: 24,
          paddingInline: 8,
          height: 30,
          backgroundColor: projectHealth?.color || colors.transparent,
          color: colors.darkGray,
          cursor: 'pointer',
        }}
      >
        <Typography.Text
          style={{
            textTransform: 'capitalize',
            color: colors.darkGray,
            fontSize: 13,
          }}
        >
          {projectHealth?.label || t('notSetText')}
        </Typography.Text>

        <DownOutlined />
      </Flex>
    </Dropdown>
  );
};

export default ProjectHealthCell;
