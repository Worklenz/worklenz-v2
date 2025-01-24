import {
  Badge,
  Card,
  Dropdown,
  Empty,
  Flex,
  Menu,
  MenuProps,
  Typography,
} from 'antd';
import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
// custom css file
import './custom-column-selection-cell.css';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../../../../../../styles/colors';
import { SelectionType } from '../../custom-column-modal/selection-type-column/selection-type-column';

const CustomColumnSelectionCell = ({
  selectionsList,
}: {
  selectionsList: SelectionType[];
}) => {
  const [currentSelectionOption, setCurrentSelectionOption] =
    useState<SelectionType | null>(null);

  // localization
  const { t } = useTranslation('task-list-table');

  // esure selectionsList is an array and has valid data
  const selectionMenuItems: MenuProps['items'] =
    Array.isArray(selectionsList) && selectionsList.length > 0
      ? selectionsList.map((selection) => ({
          key: selection.selectionId,
          label: (
            <Flex gap={4}>
              <Badge color={selection.selectionColor} />{' '}
              {selection.selectionName}
            </Flex>
          ),
        }))
      : [
          {
            key: 'noSelections',
            label: <Empty />,
          },
        ];

  // handle selection selection
  const handleSelectionOptionSelect: MenuProps['onClick'] = (e) => {
    const selectedOption = selectionsList.find(
      (option) => option.selectionId === e.key
    );
    if (selectedOption) {
      setCurrentSelectionOption(selectedOption);
    }
  };

  // dropdown items
  const customColumnSelectionCellItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Card
          className="custom-column-selection-dropdown-card"
          bordered={false}
        >
          <Menu
            className="custom-column-selection-menu"
            items={selectionMenuItems}
            onClick={handleSelectionOptionSelect}
          />
        </Card>
      ),
    },
  ];

  return (
    <Dropdown
      overlayClassName="custom-column-selection-dropdown"
      menu={{ items: customColumnSelectionCellItems }}
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
          backgroundColor:
            currentSelectionOption?.selectionColor || colors.transparent,
          color: colors.darkGray,
          cursor: 'pointer',
        }}
      >
        {currentSelectionOption ? (
          <Typography.Text
            ellipsis={{ expanded: false }}
            style={{
              textTransform: 'capitalize',
              fontSize: 13,
            }}
          >
            {currentSelectionOption?.selectionName}
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

export default CustomColumnSelectionCell;
