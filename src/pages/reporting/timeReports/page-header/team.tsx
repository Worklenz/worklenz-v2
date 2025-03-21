import { CaretDownFilled } from '@ant-design/icons';
import { Button, Checkbox, Divider, Dropdown, Input, MenuProps, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useTranslation } from 'react-i18next';
import { ISelectableTeam } from '@/types/reporting/reporting-filters.types';
import { reportingApiService } from '@/api/reporting/reporting.api.service';
import logger from '@/utils/errorLogger';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchReportingProjects, fetchReportingTeams, setSelectOrDeselectAllTeams, setSelectOrDeselectTeam } from '@/features/reporting/time-reports/time-reports-overview.slice';

const Team: React.FC = () => {
  const dispatch = useAppDispatch();
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectAll, setSelectAll] = useState(true);
  const { t } = useTranslation('time-report');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const { teams, loadingTeams } = useAppSelector(state => state.timeReportsOverviewReducer);

  const filteredItems = teams.filter(item =>
    item.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCheckboxChange = (key: string, checked: boolean) => {
    dispatch(setSelectOrDeselectTeam({ id: key, selected: checked }));
  };

  const handleSelectAllChange = (e: CheckboxChangeEvent) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    dispatch(setSelectOrDeselectAllTeams(isChecked));
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'search',
      label: (
        <Input
          placeholder={t('searchByName')}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          onClick={e => e.stopPropagation()}
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
          onChange={e => {
            e.preventDefault();
            handleCheckboxChange(item.id || '', e.target.checked);
          }}
        >
          {item.name}
        </Checkbox>
      ),
    })),
  ];

  return (
    <div>
      <Dropdown
        menu={{ 
          items: menuItems,
        }}
        placement="bottomLeft"
        trigger={['click']}
        overlayStyle={{ maxHeight: '330px', overflowY: 'auto' }}
        open={dropdownVisible}
        onOpenChange={visible => {
          setDropdownVisible(visible);
          if (!visible) {
            setSearchText('');
          }
        }}
      >
        <Button loading={loadingTeams}>
          {t('teams')} <CaretDownFilled />
        </Button>
      </Dropdown>
    </div>
  );
};

export default Team;
