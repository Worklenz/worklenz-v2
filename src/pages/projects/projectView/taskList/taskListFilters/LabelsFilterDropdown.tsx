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
import { useAppSelector } from '@/hooks/useAppSelector';
import { colors } from '@/styles/colors';
import { useTranslation } from 'react-i18next';
import { ITaskLabel } from '@/types/tasks/taskLabel.types';

interface LabelsFilterDropdownProps {
  labels: ITaskLabel[];
}

const LabelsFilterDropdown = (props: LabelsFilterDropdownProps) => {
  const labelInputRef = useRef<InputRef>(null);
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { t } = useTranslation('task-list-filters');

  const filteredLabelData = useMemo(() => {
    return props.labels.filter((label) =>
      label.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [props.labels, searchQuery]);

  const themeMode = useAppSelector((state) => state.themeReducer.mode);

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

        <List style={{ padding: 0 , maxHeight: 250, overflow: 'auto'}}>
          {filteredLabelData.length ? (
            filteredLabelData.map((label) => (
              <List.Item
                className={`custom-list-item ${themeMode === 'dark' ? 'dark' : ''}`}
                key={label.id}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  gap: 8,
                  padding: '4px 8px',
                  border: 'none',
                }}
              >
                <Checkbox
                  id={label.id}
                  onChange={(e) => handleSelectedFiltersCount(e.target.checked)}
                >
                  <Flex gap={8}>
                    <Badge color={label.color_code} />
                    {label.name}
                  </Flex>
                </Checkbox>
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
            selectedCount > 0
              ? themeMode === 'dark'
                ? '#003a5c'
                : colors.paleBlue
              : colors.transparent,

          color:
            selectedCount > 0
              ? themeMode === 'dark'
                ? 'white'
                : colors.darkGray
              : 'inherit',
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
