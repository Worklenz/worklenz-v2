import { Drawer, InputRef } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { toggleTaskDrawer } from '@/features/tasks/tasks.slice';

import './task-drawer.css';
import TaskDrawerHeader from './shared/TaskDrawerHeader';
import TaskDrawerTabs from './shared/TaskDrawerTabs';

const TaskDrawer = () => {
  const [taskName, setTaskName] = useState<string>('Untitled Task');

  const {isTaskDrawerOpen} = useAppSelector(    (state) => state.taskReducer  );

  // auto focused when open the drawer
  const taskNameInputRef = useRef<InputRef>(null);

  useEffect(() => {
    taskNameInputRef.current?.focus();
  }, [isTaskDrawerOpen]);

  const dispatch = useAppDispatch();

  return (
    <Drawer
      open={isTaskDrawerOpen}
      onClose={() => dispatch(toggleTaskDrawer())}
      width={720}
      style={{ justifyContent: 'space-between' }}
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

export default TaskDrawer;
