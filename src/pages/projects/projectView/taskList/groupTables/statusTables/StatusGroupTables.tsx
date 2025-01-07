import React from 'react';
import { TaskType } from '../../../../../../types/task.types';
import { useAppSelector } from '../../../../../../hooks/useAppSelector';
import { Flex } from 'antd';
import TaskListTableWrapper from '../../taskListTable/TaskListTableWrapper';
import { createPortal } from 'react-dom';
import BulkTasksActionContainer from '../../../../../../features/projects/bulkActions/BulkTasksActionContainer';
import { useAppDispatch } from '../../../../../../hooks/useAppDispatch';
import { deselectAll } from '../../../../../../features/projects/bulkActions/bulkActionSlice';
import { getStatusColor } from '../../../../../../utils/getStatusColor';

const StatusGroupTables = ({ datasource }: { datasource: TaskType[] }) => {
  const statusList = useAppSelector((state) => state.statusReducer.status);

  const dispatch = useAppDispatch();

  // get bulk action detatils
  const selectedTaskIdsList = useAppSelector(
    (state) => state.bulkActionReducer.selectedTaskIdsList
  );

  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  return (
    <Flex gap={24} vertical>
      {statusList.map((status) => (
        <TaskListTableWrapper
          key={status.id}
          taskList={datasource.filter(
            (task) => task.status === status.category
          )}
          tableId={status.id}
          name={status.name}
          type="status"
          statusCategory={status.category}
          color={getStatusColor(status.category, themeMode)}
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

export default StatusGroupTables;
