import { Flex } from 'antd';
import Avatars from '@/components/avatars/avatars';
import AssigneeSelector from '@/components/taskListCommon/assigneeSelector/AssigneeSelector';
import { InlineMember } from '@/types/teamMembers/inlineMember.types';

type TaskListMembersCellProps = {
  members: InlineMember[];
  selectedTaskId: string | null;
};

const TaskListMembersCell = ({
  members,
  selectedTaskId,
}: TaskListMembersCellProps) => {
  return (
    <Flex gap={4} align="center">
      <Avatars members={members} />
      <AssigneeSelector taskId={selectedTaskId || ''} />
    </Flex>
  );
};

export default TaskListMembersCell;
