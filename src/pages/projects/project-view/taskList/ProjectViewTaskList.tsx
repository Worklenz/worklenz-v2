import React, { useEffect } from 'react';
import { Flex } from 'antd';
import TaskListFilters from './taskListFilters/TaskListFilters';
import { TaskType } from '../../../../types/task.types';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import StatusGroupTables from './statusTables/StatusGroupTables';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchStatusesCategories } from '@/features/taskAttributes/taskStatusSlice';
import { fetchTaskGroups } from '@/features/tasks/taskSlice';
import { ITaskListConfigV2 } from '@/types/tasks/taskList.types';
import TaskListTableWrapper from './taskListTable/TaskListTableWrapper';

const ProjectViewTaskList = () => {
  // sample data from task reducer
  const dispatch = useAppDispatch();
  const { taskGroups, loadingGroups } = useAppSelector(state => state.taskReducer);
  const { statusCategories } = useAppSelector(state => state.taskStatusReducer);
  const projectId = useAppSelector(state => state.projectReducer.projectId);

  useEffect(() => {
    if (projectId) {
      const config: ITaskListConfigV2 = {
        id: projectId,
        field: 'id',
        order: 'desc',
        search: '',
        statuses: '',
        members: '',
        projects: '',
        isSubtasksInclude: true,
      };
      dispatch(fetchTaskGroups(config));
    }
    if (!statusCategories.length) {
      dispatch(fetchStatusesCategories());
    }
  }, [dispatch, projectId]);
  
  return (
    <Flex vertical gap={16} style={{overflowX: 'hidden'}}>
      <TaskListFilters position="list" />

      {taskGroups.map((group) => (
        <TaskListTableWrapper
          key={group.id}
          taskList={group.tasks}
          tableId={group.id || ''}
          name={group.name || ''}
          type="status"
          statusCategory={group.id || ''}
          color={group.color_code || ''}
        />
      ))}
    </Flex>
  );
};

export default ProjectViewTaskList;
