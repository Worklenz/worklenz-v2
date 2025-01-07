import React from 'react';
import { TaskPriorityType, TaskType } from '../../../../../../types/task.types';
import { Flex } from 'antd';
import TaskListTableWrapper from '../../taskListTable/TaskListTableWrapper';
import { useAppSelector } from '../../../../../../hooks/useAppSelector';
import { getPriorityColor } from '../../../../../../utils/getPriorityColors';

const PriorityGroupTables = ({ datasource }: { datasource: TaskType[] }) => {
  const priorityList: { id: string; name: string }[] = [
    {
      id: 'high',
      name: 'high',
    },
    {
      id: 'medium',
      name: 'medium',
    },
    {
      id: 'low',
      name: 'low',
    },
  ];

  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  return (
    <Flex gap={24} vertical>
      {priorityList.map((priority, index) => (
        <TaskListTableWrapper
          key={index}
          taskList={datasource.filter(
            (task) => task.priority === priority.name
          )}
          tableId={priority.id}
          name={priority.name}
          type="priority"
          priorityCategory={priority.name}
          color={getPriorityColor(priority.name as TaskPriorityType, themeMode)}
        />
      ))}
    </Flex>
  );
};

export default PriorityGroupTables;
