/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Dropdown,
  Empty,
  Flex,
  Input,
  InputRef,
  List,
  Typography,
} from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { toggleProjectMemberDrawer } from '../../../features/projects/singleProject/members/projectMembersSlice';
import { toggleMember } from '../../../features/tasks/taskSlice';
import CustomAvatar from '../../CustomAvatar';
import { colors } from '../../../styles/colors';
import { PlusOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import SingleAvatar from '@/components/common/single-avatar/single-avatar';
import { InlineMember } from '@/types/teamMembers/inlineMember.types';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

const AssigneeSelector = ({ taskId }: { taskId: string }) => {
  const membersInputRef = useRef<InputRef>(null);
  // this is for get the current string that type on search bar
  const [searchQuery, setSearchQuery] = useState<string>('');

  // localization
  const { t } = useTranslation('task-list-table');

  const dispatch = useAppDispatch();

  // get members list from members reducer
  const members = useAppSelector(state => state.teamMembersReducer.teamMembers);

  // used useMemo hook for re render the list when searching
  const filteredMembersData = useMemo(() => {
    return members?.data?.filter((member) =>
      member.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [members, searchQuery]);

  // function to handle invite project member drawer
  const handleInviteProjectMemberDrawer = () => {
    dispatch(toggleProjectMemberDrawer());
  };

  // function to focus members input
  const handleMembersDropdownOpen = (open: boolean) => {
    if (open) {
      setTimeout(() => {
        membersInputRef.current?.focus();
      }, 0);
    }
  };

  const handleMemberChange = (e: CheckboxChangeEvent) => {
    console.log(e);
  };

  // custom dropdown content
  const membersDropdownContent = (
    <Card className="custom-card" styles={{ body: { padding: 8 } }}>
      <Flex vertical>
        <Input
          ref={membersInputRef}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          placeholder={t('searchInputPlaceholder')}
        />

        <List style={{ padding: 0, height: 250, overflow: 'auto' }}>
          {filteredMembersData?.length ? (
            filteredMembersData.map((member) => (
              <List.Item
                className="custom-list-item"
                key={member.id}
                style={{
                  display: 'flex',
                  gap: 8,
                  justifyContent: 'flex-start',
                  padding: '4px 8px',
                  border: 'none',
                }}
              >
                <Checkbox
                  id={member.id}
                  onChange={(e) => handleMemberChange(e)}
                />
                <div>
                  <SingleAvatar avatarUrl={member.avatar_url} name={member.name} email={member.email} />
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
              </List.Item>
            ))
          ) : (
            <Empty />
          )}
        </List>

        <Divider style={{ marginBlock: 0 }} />

        <Button
          icon={<UsergroupAddOutlined />}
          type="text"
          style={{
            color: colors.skyBlue,
            border: 'none',
            backgroundColor: colors.transparent,
            width: '100%',
          }}
          onClick={handleInviteProjectMemberDrawer}
        >
          {t('assigneeSelectorInviteButton')}
        </Button>

        <Divider style={{ marginBlock: 8 }} />

        <Button type="primary" style={{ alignSelf: 'flex-end' }}>
          {t('okButton')}
        </Button>
      </Flex>
    </Card>
  );

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

export default AssigneeSelector;
