import React from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Flex } from 'antd';
import TaskListTableWrapper from '@/pages/projects/projectView/taskList/taskListTable/TaskListTableWrapper';
import { createPortal } from 'react-dom';
import BulkTasksActionContainer from '@features/projects/bulkActions/BulkTasksActionContainer';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { deselectAll } from '@features/projects/bulkActions/bulkActionSlice';
import { ITaskListGroup } from '@/types/tasks/taskList.types';

interface TaskGroupWrapperProps {
  taskGroups: ITaskListGroup[];
  groupBy: string;
}

const TaskGroupWrapper = ({ taskGroups, groupBy }: TaskGroupWrapperProps) => {

  const dispatch = useAppDispatch();

  // get bulk action detatils
  const selectedTaskIdsList = useAppSelector(
    (state) => state.bulkActionReducer.selectedTaskIdsList
  );

  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  return (
    <Flex gap={24} vertical>
      {taskGroups.map((taskGroup) => (
        <TaskListTableWrapper
          key={taskGroup.id}
          taskList={taskGroup.tasks}
          tableId={taskGroup.id}
          name={taskGroup.name}
          groupBy={groupBy}
          statusCategory={taskGroup.category_id}
          color={themeMode === 'dark' ? taskGroup.color_code_dark : taskGroup.color_code}
        />
      ))}

      {/* bulk action container ==> used tailwind to recreate the animation */}
      {createPortal(
        <div
          className={`absolute bottom-0 left-1/2 z-20 -translate-x-1/2 ${selectedTaskIdsList.length > 0 ? 'overflow-visible' : 'h-[1px] overflow-hidden'}`}
        >
          <div
            className={`${selectedTaskIdsList.length > 0 ? 'bottom-4' : 'bottom-0'} absolute left-1/2 z-[999] -translate-x-1/2 transition-all duration-300`}
          >
            <BulkTasksActionContainer
              selectedTaskIds={selectedTaskIdsList}
              closeContainer={() => dispatch(deselectAll())}
            />
          </div>
        </div>,
        document.body
      )}
    </Flex>
  );
};

export default TaskGroupWrapper;
