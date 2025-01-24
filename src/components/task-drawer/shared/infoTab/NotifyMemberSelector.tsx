import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Dropdown,
  Empty,
  Flex,
  Input,
  InputRef,
  List,
  Typography,
} from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/hooks/useAppSelector';
import CustomAvatar from '@/components/CustomAvatar';
import { colors } from '@/styles/colors';

const NotifyMemberSelector = () => {
  const membersInputRef = useRef<InputRef>(null);

  // localization
  const { t } = useTranslation('task-list-filters');

  // get members list from members reducer
  const membersList = [
    ...useAppSelector((state) => state.memberReducer.membersList),
    useAppSelector((state) => state.memberReducer.owner),
  ];

  // this is for get the current string that type on search bar
  const [searchQuery, setSearchQuery] = useState<string>('');

  // used useMemo hook for re render the list when searching
  const filteredMembersData = useMemo(() => {
    return membersList.filter((member) =>
      member.memberName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [membersList, searchQuery]);

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

        <List style={{ padding: 0 }}>
          {filteredMembersData.length ? (
            filteredMembersData.map((member) => (
              <List.Item
                className="custom-list-item"
                key={member.memberId}
                style={{
                  display: 'flex',
                  gap: 8,
                  padding: '4px 8px',
                  border: 'none',
                }}
              >
                <Checkbox id={member.memberId} />
                <div>
                  <CustomAvatar avatarName={member.memberName} />
                </div>
                <Flex vertical>
                  {member.memberName}

                  <Typography.Text
                    style={{
                      fontSize: 12,
                      color: colors.lightGray,
                    }}
                  >
                    {member.memberEmail}
                  </Typography.Text>
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
        type="dashed"
        shape="circle"
        size="small"
        icon={
          <PlusOutlined
            style={{
              fontSize: 12,
              width: 22,
              height: 22,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        }
      />
    </Dropdown>
  );
};

export default NotifyMemberSelector;
