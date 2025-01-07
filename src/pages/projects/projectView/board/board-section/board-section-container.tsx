import { Flex } from 'antd';
import React from 'react';
import BoardSectionCard from './board-section-card/board-section-card';
import BoardCreateSectionCard from './board-section-card/board-create-section-card';

const BoardSectionCardContainer = ({
  datasource,
  group,
}: {
  datasource: any;
  group: 'status' | 'priority' | 'phases' | 'members';
}) => {
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
    </Flex>
  );
};

export default BoardSectionCardContainer;
