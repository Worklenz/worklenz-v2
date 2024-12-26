import { Tabs } from 'antd';
import React from 'react';
import AddTaskInlineForm from './AddTaskInlineForm';

const ListView = () => {
  // tasks filter tab items
  const tabItems = [
    {
      key: 'upcoming',
      label: `Upcoming (0)`,
    },
    {
      key: 'overdue',
      label: `Overdue (0)`,
    },
    {
      key: 'completed',
      label: `Completed (0)`,
    },
  ];

  return (
    //  tasks filtering tabs
    <Tabs type="card" items={tabItems} />
  );
};

export default ListView;
