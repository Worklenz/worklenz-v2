import React from 'react';
import { Flex } from 'antd';
import TaskListFilters from './taskListFilters/TaskListFilters';
import { TaskType } from '../../../../types/task.types';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import StatusGroupTables from './groupTables/statusTables/StatusGroupTables';
import PriorityGroupTables from './groupTables/priorityTables/PriorityGroupTables';

const ProjectViewTaskList = () => {
  // sample data from task reducer
  const dataSource: TaskType[] = useAppSelector(
    (state) => state.taskReducer.tasks
  );

  return (
    <Flex vertical gap={16} style={{overflowX: 'hidden'}}>
      <TaskListFilters position="list" />

      <StatusGroupTables datasource={dataSource} />
      <PriorityGroupTables datasource={dataSource} />
    </Flex>
  );
};

export default ProjectViewTaskList;
