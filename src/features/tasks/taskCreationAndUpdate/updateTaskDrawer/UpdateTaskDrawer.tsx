import { Drawer, InputRef } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { toggleUpdateTaskDrawer } from '../../taskSlice';
import TaskDrawerHeader from '../shared/TaskDrawerHeader';
import '../taskDrawer.css';
import TaskDrawerTabs from '../shared/TaskDrawerTabs';

const UpdateTaskDrawer = ({ taskId }: { taskId: string }) => {
  const [taskName, setTaskName] = useState<string>('Untitled Task');

  // get create task drawer state from task slice
  const isDrawerOpen = useAppSelector(
    (state) => state.taskReducer.isUpdateTaskDrawerOpen
  );

  // auto focused when open the drawer
  const taskNameInputRef = useRef<InputRef>(null);

  // get currently selected task
  const selectedTask = useAppSelector((state) => state.taskReducer.tasks).find(
    (task) => task.taskId === taskId
  );

  // Load task details into state when selectedTask changes
  // Update form fields when selectedTask changes
  useEffect(() => {
    if (selectedTask) {
      setTaskName(selectedTask.task);
    }
  }, [selectedTask]);

  useEffect(() => {
    taskNameInputRef.current?.focus();
  }, [isDrawerOpen]);

  const dispatch = useAppDispatch();

  return (
    <Drawer
      open={isDrawerOpen}
      onClose={() => dispatch(toggleUpdateTaskDrawer())}
      width={720}
      style={{ justifyContent: 'space-between' }}
      styles={{ footer: { height: 'auto', justifySelf: 'flex-end' }, body: { paddingTop: '8px' } }}
      title={
        <TaskDrawerHeader
          taskName={taskName}
          setTaskName={setTaskName}
          inputRef={taskNameInputRef}
        />
      }
    >
      <TaskDrawerTabs drawerType="update" taskId={taskId} />
    </Drawer>
  );
};

export default UpdateTaskDrawer;
