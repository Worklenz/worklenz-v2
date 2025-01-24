import { Tabs } from 'antd';
import { TabsProps } from 'antd/lib';
import React from 'react';
import TaskDrawerInfoTab from './infoTab/TaskDrawerInfoTab';
import TaskDrawerTimeLog from './timeLog/TaskDrawerTimeLog';
import TaskDrawerActivityLog from './activityLog/TaskDrawerActivityLog';

const TaskDrawerTabs = ({
  drawerType,
  taskId = null,
}: {
  drawerType: 'create' | 'update';
  taskId?: string | null;
}) => {
  const tabItems: TabsProps['items'] = [
    {
      key: 'info',
      label: 'Info',
      children: <TaskDrawerInfoTab taskId={taskId} />,
    },
    { key: 'timeLog', label: 'Time Log', children: <TaskDrawerTimeLog /> },
    {
      key: 'activityLog',
      label: 'Activity Log',
      children: <TaskDrawerActivityLog />,
    },
  ];

  return <Tabs type="card" items={tabItems} />;
};

export default TaskDrawerTabs;
