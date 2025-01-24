import { Avatar, Button, Flex, Tooltip } from 'antd';
import React from 'react';
import AddMembersDropdown from '@/components/add-members-dropdown/add-members-dropdown';
import CustomAvatar from '../CustomAvatar';

const CustomAvatarGroup = ({ assignees }: { assignees: any[] | null }) => {
  return assignees ? (
    <Flex
      gap={4}
      align="center"
      style={{
        borderRadius: 4,
        cursor: 'pointer',
      }}
    >
      <Avatar.Group>
        {assignees.map((assignee: any) =>
          assignee?.avatar_url ? (
            <Tooltip key={assignee.id} title={assignee?.name}>
              <Avatar
                src={assignee.avatar_url}
                style={{ width: 26, height: 26 }}
              />
            </Tooltip>
          ) : (
            <CustomAvatar
              key={assignee.id}
              avatarName={assignee?.name}
              size={26}
            />
          )
        )}
      </Avatar.Group>
      <Button
        shape="circle"
        type="dashed"
        size="small"
        style={{
          background: 'transparent',
          boxShadow: 'none',
          width: 26,
          height: 26,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <AddMembersDropdown />
      </Button>
    </Flex>
  ) : (
    <Button
      shape="circle"
      type="dashed"
      size="small"
      style={{
        background: 'transparent',
        boxShadow: 'none',
        width: 26,
        height: 26,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <AddMembersDropdown />
    </Button>
  );
};

export default CustomAvatarGroup;
