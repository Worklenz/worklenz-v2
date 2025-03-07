import { TabsProps, Tabs } from 'antd';
import Drawer from 'antd/es/drawer';
import { InputRef } from 'antd/es/input';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';

import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import {
  setSelectedTaskId,
  setShowTaskDrawer,
  setTaskFormViewModel,
  setTaskSubscribers,
} from '@/features/task-drawer/task-drawer.slice';

import './task-drawer.css';
import TaskDrawerHeader from './task-drawer-header/task-drawer-header';
import TaskDrawerActivityLog from './shared/activity-log/task-drawer-activity-log';
import TaskDrawerInfoTab from './shared/infoTab/TaskDrawerInfoTab';
import TaskDrawerTimeLog from './shared/timeLog/task-drawer-time-log';
import { DEFAULT_TASK_NAME } from '@/shared/constants';

const TaskDrawer = () => {
  const { t } = useTranslation('task-drawer/task-drawer');

  const { showTaskDrawer } = useAppSelector(state => state.taskDrawerReducer);

  const taskNameInputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (taskNameInputRef.current?.input?.value === DEFAULT_TASK_NAME) {
      taskNameInputRef.current.focus();
    }
  }, [showTaskDrawer]);

  const dispatch = useAppDispatch();

  const handleOnClose = () => {
    dispatch(setShowTaskDrawer(false));
    dispatch(setSelectedTaskId(null));
    dispatch(setTaskFormViewModel({}));
    dispatch(setTaskSubscribers([]));
  };

  const tabItems: TabsProps['items'] = [
    {
      key: 'info',
      label: t('taskInfoTab.title'),
      children: <TaskDrawerInfoTab t={t} />,
    },
    {
      key: 'timeLog',
      label: t('taskTimeLogTab.title'),
      children: <TaskDrawerTimeLog t={t} />,
    },
    {
      key: 'activityLog',
      label: t('taskActivityLogTab.title'),
      children: <TaskDrawerActivityLog />,
    },
  ];

  return (
    <Drawer
      open={showTaskDrawer}
      onClose={handleOnClose}
      width={720}
      style={{ justifyContent: 'space-between' }}
      destroyOnClose
      title={
        <TaskDrawerHeader
          inputRef={taskNameInputRef}
          t={t}
        />
      }
    >
      <Tabs type="card" items={tabItems} destroyInactiveTabPane />
    </Drawer>
  );
};

export default TaskDrawer;
