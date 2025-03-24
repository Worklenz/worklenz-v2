import { fetchReportingProjects, setNoCategory, setSelectOrDeselectAllCategories, setSelectOrDeselectCategory } from '@/features/reporting/time-reports/time-reports-overview.slice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { CaretDownFilled } from '@ant-design/icons';
import { Button, Card, Checkbox, Divider, Dropdown, Input, MenuProps } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Categories: React.FC = () => {
  const dispatch = useAppDispatch();

  const [searchText, setSearchText] = useState('');
  const [selectAll, setSelectAll] = useState(true);
  const { t } = useTranslation('time-report');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { categories, loadingCategories, noCategory } = useAppSelector(
    state => state.timeReportsOverviewReducer
  );

  const filteredItems = categories.filter(item =>
    item.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Handle checkbox change for individual items
  const handleCheckboxChange = async (key: string, checked: boolean) => {
    await dispatch(setSelectOrDeselectCategory({ id: key, selected: checked }));
    await dispatch(fetchReportingProjects());
  };

  // Handle "Select All" checkbox change
  const handleSelectAllChange = async (e: CheckboxChangeEvent) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    await dispatch(setNoCategory(isChecked));
    await dispatch(setSelectOrDeselectAllCategories(isChecked));
    await dispatch(fetchReportingProjects());

  };

  const handleNoCategoryChange = async (checked: boolean) => {
    await dispatch(setNoCategory(checked));
    await dispatch(fetchReportingProjects());
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
    ...(categories.length > 0
      ? [
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
            type: 'divider' as const,
          },
        ]
      : []),
      {
        key: 'noCategory',
        label: (
          <Checkbox
            onClick={e => e.stopPropagation()}
            checked={noCategory}
            onChange={e => handleNoCategoryChange(e.target.checked)}
          >
            {t('noCategory')}
          </Checkbox>
        ),
      },
    ...(filteredItems.length > 0
      ? filteredItems.map(item => ({
          key: item.id || '',
          label: (
            <Checkbox
              onClick={e => e.stopPropagation()}
              checked={item.selected}
              onChange={e => handleCheckboxChange(item.id || '', e.target.checked)}
            >
              {item.name}
            </Checkbox>
          ),
        }))
      : [
          {
            key: 'empty',
            label: t('noCategories'),
          },
        ]),
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
        <Button loading={loadingCategories}>
          {t('categories')} <CaretDownFilled />
        </Button>
      </Dropdown>
    </div>
  );
};

export default Categories;
