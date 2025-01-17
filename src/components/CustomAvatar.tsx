import { Avatar, Tooltip } from 'antd';
import React from 'react';
import { avatarNamesMap } from '../shared/constants';

const CustomAvatar = ({
  avatarName,
  size = 32,
}: {
  avatarName: string;
  size?: number;
}) => {
  const avatarCharacter = avatarName[0].toUpperCase();

  return (
    <Tooltip title={avatarName}>
      <Avatar
        style={{
          backgroundColor: avatarNamesMap[avatarCharacter],
          verticalAlign: 'middle',
          width: size,
          height: size,
        }}
      >
        {avatarCharacter}
      </Avatar>
    </Tooltip>
  );
};

export default React.memo(CustomAvatar);
