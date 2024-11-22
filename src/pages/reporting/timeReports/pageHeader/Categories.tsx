import { CaretDownFilled } from "@ant-design/icons";
import { Button, Checkbox, Divider, Dropdown, Input, MenuProps } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const Categories:React.FC = () => {
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const {t} = useTranslation('timeReport')

  const allItems = [
    { key: '1', label: 'Category 1' },
    { key: '2', label: 'Category 2' },
    { key: '3', label: 'Category 3' },
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
            placeholder={t('searchByCategory')}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        ),
      },
    {
      key: 'selectAll',
      label: (
        <div>
            <Checkbox onChange={handleSelectAllChange} checked={selectAll}>
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
      >
        <Button >
          {t('categories')} <CaretDownFilled />
        </Button>
      </Dropdown>
    </div>
  );
};

export default Categories;
