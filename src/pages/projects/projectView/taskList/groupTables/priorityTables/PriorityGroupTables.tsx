import React from 'react';
import { TaskPriorityType, TaskType } from '../../../../../../types/task.types';
import { Flex } from 'antd';
import TaskListTableWrapper from '../../taskListTable/TaskListTableWrapper';
import { useAppSelector } from '../../../../../../hooks/useAppSelector';

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

  // fuction for get a color regariding the priority
  const getPriorityColor = (priority: TaskPriorityType) => {
    switch (priority) {
      case 'high':
        return themeMode === 'dark' ? '#8b3a3b' : '#f6bfc0';
      case 'medium':
        return themeMode === 'dark' ? '#916c33' : '#f9e3b1';
      case 'low':
        return themeMode === 'dark' ? '#3b6149' : '#c2e4d0';
      default:
        return themeMode === 'dark' ? '#916c33' : '#f9e3b1';
    }
  };

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
          color={getPriorityColor(priority.name as TaskPriorityType)}
        />
      ))}
    </Flex>
  );
};

export default PriorityGroupTables;
