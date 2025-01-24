import { Flex } from 'antd';
import React, { useState } from 'react';
import BoardSectionCard from './board-section-card/board-section-card';
import BoardCreateSectionCard from './board-section-card/board-create-section-card';
import { useAppSelector } from '@/hooks/useAppSelector';
import UpdateTaskDrawer from '@/features/tasks/taskCreationAndUpdate/updateTaskDrawer/UpdateTaskDrawer';

const BoardSectionCardContainer = ({
  datasource,
  group,
}: {
  datasource: any;
  group: 'status' | 'priority' | 'phases' | 'members';
}) => {
  const selectedTaskId = useAppSelector(
    (state) => state.boardReducer.selectedTaskId
  );

  return (
    <Flex
      gap={16}
      align="flex-start"
      className="max-w-screen max-h-[620px] min-h-[620px] overflow-x-scroll p-[1px]"
    >
      {datasource.map((data: any) => (
        <BoardSectionCard datasource={data} />
      ))}

      {group !== 'priority' && <BoardCreateSectionCard />}

      <UpdateTaskDrawer taskId={selectedTaskId || ''} />
    </Flex>
  );
};

export default BoardSectionCardContainer;
