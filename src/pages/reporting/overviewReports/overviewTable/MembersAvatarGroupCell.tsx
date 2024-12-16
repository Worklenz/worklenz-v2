import { Avatar, Tooltip } from 'antd';
import React from 'react';
import CustomAvatar from '../../../../components/CustomAvatar';

const MembersAvatarGroupCell = ({ membersList }: { membersList: any[] }) => {
  return (
    <Avatar.Group>
      {membersList.map((member) =>
        member?.avatar_url ? (
          <Tooltip title={member?.name}>
            <Avatar src={member.avatar_url} style={{ width: 26, height: 26 }} />
          </Tooltip>
        ) : member?.end ? (
          <Tooltip title={member?.names.filter(Boolean).join(', ')}>
            <Avatar
              style={{
                backgroundColor: member?.color_code,
                width: 26,
                height: 26,
              }}
            >
              {member?.name}
            </Avatar>
          </Tooltip>
        ) : (
          <CustomAvatar avatarName={member?.name} size={26} />
        )
      )}
    </Avatar.Group>
  );
};

export default MembersAvatarGroupCell;
