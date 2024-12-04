import { CaretDownFilled } from "@ant-design/icons";
import { Button, Checkbox, Divider, Dropdown, Input, MenuProps, Space } from "antd";
import React, { useState } from "react";
import type { CheckboxChangeEvent } from "antd/es/checkbox"; 
import { useTranslation } from "react-i18next";

const Team: React.FC = () => {
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const {t} = useTranslation('timeReport')
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const allItems = [
    { key: '1', label: 'Team 1' },
    { key: '2', label: 'Team 2' },
    { key: '3', label: 'Team 3' },
  ];

  // Filter items based on search text
  const filteredItems = allItems.filter(item =>
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );

  // Handle checkbox change for individual items
  const handleCheckboxChange = (key: string, checked: boolean) => {
    setCheckedList(prev => 
      checked ? [...prev, key] : prev.filter(item => item !== key)
    );
  };

  // Handle "Select All" checkbox change
  const handleSelectAllChange = (e: CheckboxChangeEvent) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    setCheckedList(isChecked ? allItems.map(item => item.key) : []);
  };

  // Dropdown items for the menu
  const menuItems: MenuProps['items'] = [
      {
        key: 'search',
        label: (
          <Input
            placeholder={t('searchByName')}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        ),
      },
    {
      key: 'selectAll',
      label: (
        <div>
            <Checkbox  onClick={(e) => e.stopPropagation()} onChange={handleSelectAllChange} checked={selectAll}>
              {t('selectAll')}
            </Checkbox>
            <Divider style={{margin: '4px 0'}}/>
        </div>
      ),
    },
    ...filteredItems.map(item => ({
      key: item.key,
      label: (
        <Checkbox
          onClick={(e) => e.stopPropagation()}
          checked={checkedList.includes(item.key)}
          onChange={(e) => handleCheckboxChange(item.key, e.target.checked)}
        >
          {item.label}
        </Checkbox>
      ),
    })),
  ];

  return (
    <div>
      <Dropdown
        menu={{ items: menuItems }}
        placement="bottomLeft"
        trigger={['click']}
        overlayStyle={{maxHeight: '330px', overflowY: 'auto'}}
        onOpenChange={(visible) => {
          setDropdownVisible(visible)
          if (!visible) {
            setSearchText('')
          }
        }}
      >
        <Button >
          {t('teams')} <CaretDownFilled />
        </Button>
      </Dropdown>
    </div>
  );
};

export default Team;
