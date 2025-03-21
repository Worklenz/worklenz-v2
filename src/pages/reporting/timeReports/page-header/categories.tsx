import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { CaretDownFilled } from '@ant-design/icons';
import { Button, Checkbox, Divider, Dropdown, Input, MenuProps } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Categories: React.FC = () => {
  const dispatch = useAppDispatch();

  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectAll, setSelectAll] = useState(true);
  const { t } = useTranslation('time-report');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { categories, loadingCategories } = useAppSelector(
    state => state.timeReportsOverviewReducer
  );

  const filteredItems = categories.filter(item =>
    item.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Handle checkbox change for individual items
  const handleCheckboxChange = (key: string, checked: boolean) => {
    setCheckedList(prev => (checked ? [...prev, key] : prev.filter(item => item !== key)));
  };

  // Handle "Select All" checkbox change
  const handleSelectAllChange = (e: CheckboxChangeEvent) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    setCheckedList(isChecked ? filteredItems.map(item => item.id).filter((id): id is string => id !== undefined) : []);
  };

  // Dropdown items for the menu
  const menuItems: MenuProps['items'] = [
    {
      key: 'search',
      label: (
        <Input
          onClick={e => e.stopPropagation()}
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
          <Checkbox
            onClick={e => e.stopPropagation()}
            onChange={handleSelectAllChange}
            checked={selectAll}
          >
            {t('selectAll')}
          </Checkbox>
        </div>
      ),
    },
    {
      key: 'divider',
      type: 'divider',
    },
    ...filteredItems.map(item => ({
      key: item.id,
      label: (
        <Checkbox
          onClick={e => e.stopPropagation()}
          checked={item.selected}
          onChange={e => handleCheckboxChange(item.id, e.target.checked)}
        >
          {item.name}
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
        overlayStyle={{ maxHeight: '330px', overflowY: 'auto' }}
        onOpenChange={visible => {
          setDropdownVisible(visible);
          if (!visible) {
            setSearchText('');
          }
        }}
      >
        <Button>
          {t('categories')} <CaretDownFilled />
        </Button>
      </Dropdown>
    </div>
  );
};

export default Categories;
