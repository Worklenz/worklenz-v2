/* eslint-disable react-hooks/exhaustive-deps */
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
  Typography,
} from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { colors } from '../../../../../styles/colors';
import CustomAvatar from '../../../../../components/CustomAvatar';
import { useTranslation } from 'react-i18next';
import { ITaskListMemberFilter } from '@/types/tasks/taskList.types';
import SingleAvatar from '@/components/common/single-avatar/single-avatar';

const MembersFilterDropdown = (props: { members: ITaskListMemberFilter[] }) => {
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const membersInputRef = useRef<InputRef>(null);

  // localization
  const { t } = useTranslation('task-list-filters');

  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  // this is for get the current string that type on search bar
  const [searchQuery, setSearchQuery] = useState<string>('');

  // used useMemo hook for re render the list when searching
  const filteredMembersData = useMemo(() => {
    return props.members.filter((member) =>
      member.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [props.members, searchQuery]);

  // handle selected filters count
  const handleSelectedFiltersCount = (checked: boolean) => {
    setSelectedCount((prev) => (checked ? prev + 1 : prev - 1));
  };

  // custom dropdown content
  const membersDropdownContent = (
    <Card className="custom-card" styles={{ body: { padding: 8 } }}>
      <Flex vertical gap={8}>
        <Input
          ref={membersInputRef}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          placeholder={t('searchInputPlaceholder')}
        />

        <List style={{ padding: 0, maxHeight: 250, overflow: 'auto' }}>
          {filteredMembersData.length ? (
            filteredMembersData.map((member) => (
              <List.Item
                className={`custom-list-item ${themeMode === 'dark' ? 'dark' : ''}`}
                key={member.id}
                style={{
                  display: 'flex',
                  gap: 8,
                  padding: '4px 8px',
                  border: 'none',
                }}
              >
                <Checkbox
                  id={member.id}
                  onChange={(e) => handleSelectedFiltersCount(e.target.checked)}
                >
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div>
                      <SingleAvatar avatarUrl={member.avatar_url} name={member.name} email={member.email}/>
                    </div>
                    <Flex vertical>
                      {member.name}

                      <Typography.Text
                        style={{
                          fontSize: 12,
                          color: colors.lightGray,
                        }}
                      >
                        {member.email}
                      </Typography.Text>
                    </Flex>
                  </div>
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

  // function to focus members input
  const handleMembersDropdownOpen = (open: boolean) => {
    if (open) {
      setTimeout(() => {
        membersInputRef.current?.focus();
      }, 0);
    }
  };

  return (
    <Dropdown
      overlayClassName="custom-dropdown"
      trigger={['click']}
      dropdownRender={() => membersDropdownContent}
      onOpenChange={handleMembersDropdownOpen}
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
          {t('membersText')}
          {selectedCount > 0 && (
            <Badge size="small" count={selectedCount} color={colors.skyBlue} />
          )}
        </Space>
      </Button>
    </Dropdown>
  );
};

export default MembersFilterDropdown;
