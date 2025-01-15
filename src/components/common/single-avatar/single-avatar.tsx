import { AvatarNamesMap } from '@/shared/constants';
import { Avatar } from 'antd';

interface SingleAvatarProps {
  avatarUrl?: string;
  name?: string;
}

const SingleAvatar: React.FC<SingleAvatarProps> = ({ avatarUrl, name }) => {
  return (
    <Avatar
      src={avatarUrl}
      size={28}
      style={{ backgroundColor: AvatarNamesMap[name?.charAt(0) || ''] }}
    >
      {name?.charAt(0)}
    </Avatar>
  );
};

export default SingleAvatar;
