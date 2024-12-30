import React, { ReactNode } from 'react';
import ProjectViewTaskList from '../../pages/projects/projectView/taskList/ProjectViewTaskList';
import ProjectViewBoard from '../../pages/projects/projectView/board/ProjectViewBoard';
import ProjectViewWorkload from '../../pages/projects/projectView/workload/ProjectViewWorkload';
import ProjectViewRoadmap from '../../pages/projects/projectView/roadmap/project-view-roadmap';
import ProjectViewInsights from '../../pages/projects/projectView/insights/ProjectViewInsights';
import ProjectViewFiles from '../../pages/projects/projectView/files/ProjectViewFiles';
import ProjectViewMembers from '../../pages/projects/projectView/members/ProjectViewMembers';
import ProjectViewUpdates from '../../pages/projects/projectView/updates/ProjectViewUpdates';
import ProjectViewFinance from '../../pages/projects/projectView/finance/project-view-finance';

// type of a tab items
type TabItems = {
  key: string;
  name: string;
  isPinShow?: boolean;
  element: ReactNode;
};

// settings all element items use for tabs
export const tabItems: TabItems[] = [
  {
    key: 'taskList',
    name: 'Task List',
    isPinShow: true,
    element: React.createElement(ProjectViewTaskList),
  },
  {
    key: 'board',
    name: 'Board',
    isPinShow: true,
    element: React.createElement(ProjectViewBoard),
  },
  {
    key: 'workload',
    name: 'Workload',
    element: React.createElement(ProjectViewWorkload),
  },
  {
    key: 'roadmap',
    name: 'Roadmap',
    element: React.createElement(ProjectViewRoadmap),
  },
  {
    key: 'insights',
    name: 'Insights',
    element: React.createElement(ProjectViewInsights),
  },
  {
    key: 'files',
    name: 'Files',
    element: React.createElement(ProjectViewFiles),
  },
  {
    key: 'members',
    name: 'Members',
    element: React.createElement(ProjectViewMembers),
  },
  {
    key: 'updates',
    name: 'Updates',
    element: React.createElement(ProjectViewUpdates),
  },
  {
    key: 'finance',
    name: 'Finance',
    element: React.createElement(ProjectViewFinance),
  },
];
