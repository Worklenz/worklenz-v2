import { Flex } from 'antd';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import BoardSectionCard from './board-section-card/board-section-card';
import BoardCreateSectionCard from './board-section-card/board-create-section-card';
import { ITaskListGroup } from '@/types/tasks/taskList.types';

const BoardSectionCardContainer = ({
  datasource,
  group,
}: {
  datasource: ITaskListGroup[];
  group: 'status' | 'priority' | 'phases' | 'members';
}) => {
  return (
    <Flex
      gap={16}
      align="flex-start"
      className="max-w-screen max-h-[620px] min-h-[620px] overflow-x-scroll p-[1px]"
    >
      <SortableContext 
        items={datasource?.map((section: any) => section.id)}
        strategy={horizontalListSortingStrategy}
      >
        {datasource?.map((data: any) => (
          <BoardSectionCard key={data.id} taskGroup={data} />
        ))}
      </SortableContext>
      
      {group !== 'priority' && <BoardCreateSectionCard />}
    </Flex>
  );
};

export default BoardSectionCardContainer;