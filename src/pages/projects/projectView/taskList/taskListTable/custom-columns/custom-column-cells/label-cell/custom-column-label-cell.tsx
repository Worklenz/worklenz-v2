import { Badge, Card, Dropdown, Flex, Menu, MenuProps, Typography } from 'antd';
import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
// custom css file
import './custom-column-label-cell.css';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../../../../../../styles/colors';

// temp label type
type LabelType = {
  labelId: string;
  labelName: string;
  labelColor: string;
};

const CustomColumnLabelCell = ({ labelsList }: { labelsList: LabelType[] }) => {
  const [currentLabelOption, setCurrentLabelOption] =
    useState<LabelType | null>(null);

  // localization
  const { t } = useTranslation('taskListTable');

  // menu type
  type MenuItem = Required<MenuProps>['items'][number];
  // label menu item
  const labelMenuItems: MenuItem[] = labelsList
    ? labelsList.map((label) => ({
        key: label.labelId,
        label: (
          <Flex gap={4}>
            <Badge color={label.labelColor} /> {label.labelName}
          </Flex>
        ),
      }))
    : [];

  // Handle label select
  const handleLabelOptionSelect: MenuProps['onClick'] = (e) => {
    const selectedOption = labelsList.find(
      (option) => option.labelId === e.key
    );

    if (selectedOption) {
      setCurrentLabelOption(selectedOption);
    }
  };

  //dropdown items
  const customColumnLabelCellItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Card className="custom-column-label-dropdown-card" bordered={false}>
          <Menu
            className="custom-column-label-menu"
            items={labelMenuItems}
            onClick={handleLabelOptionSelect}
          />
        </Card>
      ),
    },
  ];

  return (
    <Dropdown
      overlayClassName="custom-column-label-dropdown"
      menu={{ items: customColumnLabelCellItems }}
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
          backgroundColor: currentLabelOption?.labelColor,
          color: colors.darkGray,
          cursor: 'pointer',
        }}
      >
        {currentLabelOption ? (
          <Typography.Text
            ellipsis={{ expanded: false }}
            style={{
              textTransform: 'capitalize',
              fontSize: 13,
            }}
          >
            {currentLabelOption?.labelName}
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

export default CustomColumnLabelCell;
