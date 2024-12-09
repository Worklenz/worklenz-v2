import { Avatar, Flex } from 'antd';
import React from 'react';
import CustomAvatar from '../../../../../../../components/CustomAvatar';
import AssigneeSelector from '../../../../../../../components/taskListCommon/assigneeSelector/AssigneeSelector';
import { MemberType } from '../../../../../../../types/member.types';

type TaskListMembersCellProps = {
  members: MemberType[];
  selectedTaskId: string | null;
};

const TaskListMembersCell = ({
  members,
  selectedTaskId,
}: TaskListMembersCellProps) => {
  return (
    <Flex gap={4} align="center">
      <Avatar.Group>
        {members?.map((member) => (
          <CustomAvatar
            key={member.memberId}
            avatarName={member.memberName}
            size={26}
          />
        ))}
      </Avatar.Group>
      <AssigneeSelector taskId={selectedTaskId || '0'} />
    </Flex>
  );
};

export default TaskListMembersCell;
