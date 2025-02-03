import { Flex } from 'antd';
import CustomColordLabel from '@/components/taskListCommon/labelsSelector/CustomColordLabel';
import CustomNumberLabel from '@/components/taskListCommon/labelsSelector/CustomNumberLabel';
import LabelsSelector from '@/components/taskListCommon/labelsSelector/LabelsSelector';
import { IProjectTask } from '@/types/project/projectTasksViewModel.types';

interface TaskListLabelsCellProps {
  task: IProjectTask;
}

const TaskListLabelsCell = ({ task }: TaskListLabelsCellProps) => {
  return (
    <Flex>
      {task.labels?.map(label => (
        label.end && label.names && label.name ? (
          <CustomNumberLabel key={label.id} labelList={label.names ?? []} namesString={label.name} />
        ) : (
          <CustomColordLabel key={label.id} label={label} />
        )
      ))}
      <LabelsSelector task={task} />
    </Flex>
  );
};

export default TaskListLabelsCell;
