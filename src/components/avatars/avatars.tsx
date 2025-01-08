import { Avatar, Tooltip } from 'antd';
import { InlineMember } from '@/types/teamMembers/inlineMember.types';

interface AvatarsProps {
  members: InlineMember[];
  maxCount?: number;
}

const renderAvatar = (member: InlineMember, index: number) => (
  <Tooltip key={member.team_member_id || index} title={member.end && member.names ? member.names.join(', ') : member.name}>
    {member.avatar_url ? (
      <Avatar src={member.avatar_url} size={28} key={member.team_member_id || index}/>
    ) : (
      <Avatar
        size={28}
        key={member.team_member_id || index}
        style={{
          backgroundColor: member.color_code || '#ececec',
          fontSize: '14px',
        }}
      >
        {member.end && member.names ? member.name : member.name.charAt(0).toUpperCase()}
      </Avatar>
    )}
  </Tooltip>
);

const Avatars: React.FC<AvatarsProps> = ({ members, maxCount }) => {
  const visibleMembers = maxCount ? members.slice(0, maxCount) : members;
  return (
    <Avatar.Group>
      {visibleMembers.map((member, index) => renderAvatar(member, index))}
    </Avatar.Group>
  );
};

export default Avatars;
