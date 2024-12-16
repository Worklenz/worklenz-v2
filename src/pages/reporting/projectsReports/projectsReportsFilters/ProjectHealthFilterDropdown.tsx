import { CaretDownFilled } from '@ant-design/icons';
import { Button, Card, Checkbox, Dropdown, List, Space } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ProjectHealthFilterDropdown = () => {
  // state to track dropdown open status
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // localization
  const { t } = useTranslation('reporting-projects-filters');

  // projectHealth dropdown items
  type ProjectHealthFieldsType = {
    key: string;
    label: string;
  };

  const projectHealthFieldsList: ProjectHealthFieldsType[] = [
    { key: 'notSet', label: t('notSetText') },
    { key: 'needsAttention', label: t('needsAttentionText') },
    { key: 'atRisk', label: t('atRiskText') },
    { key: 'good', label: t('goodText') },
  ];

  // custom dropdown content
  const projectHealthDropdownContent = (
    <Card className="custom-card" styles={{ body: { padding: 0 } }}>
      <List style={{ padding: 0 }}>
        {projectHealthFieldsList.map((item) => (
          <List.Item
            className="custom-list-item"
            key={item.key}
            style={{
              display: 'flex',
              gap: 8,
              padding: '4px 8px',
              border: 'none',
            }}
          >
            <Space>
              <Checkbox id={item.key} />
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
      dropdownRender={() => projectHealthDropdownContent}
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
        {t('healthText')}
      </Button>
    </Dropdown>
  );
};

export default ProjectHealthFilterDropdown;
