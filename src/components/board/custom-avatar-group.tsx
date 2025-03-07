import { Button, Flex } from 'antd';
import AddMembersDropdown from '@/components/add-members-dropdown/add-members-dropdown';
import Avatars from '../avatars/avatars';
import { IProjectTask } from '@/types/project/projectTasksViewModel.types';
import AssigneeSelector from '../taskListCommon/assignee-selector/assignee-selector';

type CustomAvatarGroupProps = {
  task: IProjectTask;
  sectionId: string;
};

const CustomAvatarGroup = ({ task, sectionId }: CustomAvatarGroupProps) => {
  return (
    <Flex
      gap={4}
      align="center"
      onClick={(e) => e.stopPropagation()}
      style={{
        borderRadius: 4,
        cursor: 'pointer',
      }}
    >
      <Avatars members={task.names || []} />

      <AssigneeSelector task={task} groupId={sectionId} />
    </Flex>
  );
};

export default CustomAvatarGroup;
