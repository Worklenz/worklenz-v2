import React, { useEffect } from 'react';
import { Flex, Skeleton } from 'antd';
import TaskListFilters from './taskListFilters/TaskListFilters';
import { TaskType } from '../../../../types/task.types';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import TaskGroupWrapper from './groupTables/task-group-wrapper/task-group-wrapper';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { ITaskListConfigV2 } from '@/types/tasks/taskList.types';
import { fetchTaskGroups } from '@/features/tasks/tasks.slice';
import { fetchStatusesCategories } from '@/features/taskAttributes/taskStatusSlice';

const ProjectViewTaskList = () => {
  const dataSource: TaskType[] = useAppSelector(
    (state) => state.tasksReducer.tasks
  );
  const dispatch = useAppDispatch();
  
  const projectId = useAppSelector(state => state.projectReducer.projectId);

  const { taskGroups, loadingGroups, group: groupBy  } = useAppSelector(state => state.taskReducer);
  const { statusCategories } = useAppSelector(state => state.taskStatusReducer);

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
    <Flex vertical gap={16} style={{ overflowX: 'hidden' }}>
      <TaskListFilters position="list" />

      {loadingGroups ? <Skeleton /> : <TaskGroupWrapper taskGroups={taskGroups} groupBy={groupBy} />}
    </Flex>
  );
};

export default ProjectViewTaskList;
