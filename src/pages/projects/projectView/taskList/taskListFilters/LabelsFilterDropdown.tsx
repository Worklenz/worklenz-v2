import { CaretDownFilled } from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Dropdown,
  Empty,
  Flex,
  Input,
  InputRef,
  List,
  Space,
} from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { colors } from '../../../../../styles/colors';
import { useTranslation } from 'react-i18next';

const LabelsFilterDropdown = () => {
  const labelInputRef = useRef<InputRef>(null);
  const [selectedCount, setSelectedCount] = useState<number>(0);
  // this is for get the current string that type on search bar
  const [searchQuery, setSearchQuery] = useState<string>('');

  // localization
  const { t } = useTranslation('taskListFilters');

  // get label list from label reducer
  const labelList = useAppSelector((state) => state.labelReducer.labelList);

  // used useMemo hook for re render the list when searching
  const filteredLabelData = useMemo(() => {
    return labelList.filter((label) =>
      label.labelName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [labelList, searchQuery]);

  const themeMode = useAppSelector((state) => state.themeReducer.mode)

  // handle selected filters count
  const handleSelectedFiltersCount = (checked: boolean) => {
    setSelectedCount((prev) => (checked ? prev + 1 : prev - 1));
  };

  // function to focus labels input
  const handleLabelsDropdownOpen = (open: boolean) => {
    if (open) {
      setTimeout(() => {
        labelInputRef.current?.focus();
      }, 0);
    }
  };

  // custom dropdown content
  const labelsDropdownContent = (
    <Card className="custom-card" styles={{ body: { padding: 8, width: 260 } }}>
      <Flex vertical gap={8}>
        <Input
          ref={labelInputRef}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          placeholder={t('searchInputPlaceholder')}
        />

        <List style={{ padding: 0 }}>
          {filteredLabelData.length ? (
            filteredLabelData.map((label) => (
              <List.Item
                className={`custom-list-item ${themeMode === 'dark' ? 'dark' : ''}`}
                key={label.labelId}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  gap: 8,
                  padding: '4px 8px',
                  border: 'none',
                }}
              >
                <Checkbox
                  id={label.labelId}
                  onChange={(e) => handleSelectedFiltersCount(e.target.checked)}
                />

                <Flex gap={8}>
                  <Badge color={label.labelColor} />
                  {label.labelName}
                </Flex>
              </List.Item>
            ))
          ) : (
            <Empty />
          )}
        </List>
      </Flex>
    </Card>
  );

  return (
    <Dropdown
      overlayClassName="custom-dropdown"
      trigger={['click']}
      dropdownRender={() => labelsDropdownContent}
      onOpenChange={handleLabelsDropdownOpen}
    >
      <Button
        icon={<CaretDownFilled />}
        iconPosition="end"
        style={{
          backgroundColor:
            selectedCount > 0 ? colors.paleBlue : colors.transparent,

          color: selectedCount > 0 ? colors.darkGray : 'inherit',
        }}
      >
        <Space>
          {t('labelsText')}
          {selectedCount > 0 && (
            <Badge size="small" count={selectedCount} color={colors.skyBlue} />
          )}
        </Space>
      </Button>
    </Dropdown>
  );
};

export default LabelsFilterDropdown;
