import React, { useEffect } from 'react';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import TaskListFilters from '../taskList/taskListFilters/TaskListFilters';
import { Empty, Flex, Skeleton } from 'antd';
import BoardSectionCardContainer from './board-section/board-section-container';
import { fetchTaskData } from '../../../../features/board/board-slice';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';

const ProjectViewBoard = () => {
  const { taskList, group, isLoading, error } = useAppSelector(
    (state) => state.boardReducer
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    const endpointMap = {
      status: '/project-view-mock-data/mock-data-board-status.json',
      phase: '/project-view-mock-data/mock-data-board-phase.json',
      priority: '/project-view-mock-data/mock-data-board-priority.json',
      members: '/project-view-mock-data/mock-data-board-members.json',
    };

    dispatch(fetchTaskData(endpointMap[group]));
  }, [dispatch, group]);

  console.log(taskList, group);

  return (
    <Flex vertical gap={16}>
      <TaskListFilters position={'board'} />

      {isLoading ? (
        <Skeleton />
      ) : error ? (
        <Empty />
      ) : (
        <BoardSectionCardContainer
          datasource={taskList}
          group={group as 'status' | 'priority' | 'phases' | 'members'}
        />
      )}
    </Flex>
  );
};

export default ProjectViewBoard;
