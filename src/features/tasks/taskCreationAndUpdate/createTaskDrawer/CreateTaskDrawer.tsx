import { Drawer, InputRef } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { toggleCreateTaskDrawer } from '../../taskSlice';
import TaskDrawerHeader from '../shared/TaskDrawerHeader';
import '../taskDrawer.css';
import TaskDrawerTabs from '../shared/TaskDrawerTabs';

const CreateTaskDrawer = () => {
  const [taskName, setTaskName] = useState<string>('Untitled Task');

  // get create task drawer state from task slice
  const isDrawerOpen = useAppSelector(
    (state) => state.taskReducer.isCreateTaskDrawerOpen
  );

  // auto focused when open the drawer
  const taskNameInputRef = useRef<InputRef>(null);

  useEffect(() => {
    taskNameInputRef.current?.focus();
  }, [isDrawerOpen]);

  const dispatch = useAppDispatch();

  return (
    <Drawer
      open={isDrawerOpen}
      onClose={() => dispatch(toggleCreateTaskDrawer())}
      width={720}
      style={{ justifyContent: 'space-between' }}
      styles={{ body: { paddingBlock: 8 } }}
      title={
        <TaskDrawerHeader
          taskName={taskName}
          setTaskName={setTaskName}
          inputRef={taskNameInputRef}
        />
      }
    >
      <TaskDrawerTabs drawerType={'create'} taskId={null} />
    </Drawer>
  );
};

export default CreateTaskDrawer;
