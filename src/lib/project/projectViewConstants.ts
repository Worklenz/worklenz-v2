import React, { ReactNode } from 'react';
import ProjectViewBoard from '@/pages/projects/project-view/board/project-view-board';
import ProjectViewWorkload from '@/pages/projects/project-view/workload/ProjectViewWorkload';
import ProjectViewInsights from '@/pages/projects/project-view/insights/ProjectViewInsights';
import ProjectViewFiles from '@/pages/projects/project-view/files/project-view-files';
import ProjectViewMembers from '@/pages/projects/project-view/members/ProjectViewMembers';
import ProjectViewUpdates from '@/pages/projects/project-view/updates/ProjectViewUpdates';
import TaskList from '@/pages/projects/project-view/task-list/task-list';
import ProjectViewTaskList from '@/pages/projects/project-view/taskList/ProjectViewTaskList';
import ProjectViewRoadmap from '@/pages/projects/project-view/roadmap/project-view-roadmap';

// type of a tab items
type TabItems = {
  index: number;
  key: string;
  label: string;
  isPinned?: boolean;
  element: ReactNode;
};

// settings all element items use for tabs
export const tabItems: TabItems[] = [
  {
    index: 0,
    key: 'tasks-list',
    label: 'Task List',
    isPinned: true,
    element: React.createElement(TaskList),
  },
  {
    index: 1,
    key: 'board',
    label: 'Board',
    isPinned: true,
    element: React.createElement(ProjectViewBoard),
  },
  {
    index: 2,
    key: 'workload',
    label: 'Workload',
    element: React.createElement(ProjectViewWorkload),
  },
  {
    index: 3,
    key: 'roadmap',
    label: 'Roadmap',
    element: React.createElement(ProjectViewRoadmap),
  },
  {
    index: 4,
    key: 'project-insights-member-overview',
    label: 'Insights',
    element: React.createElement(ProjectViewInsights),
  },
  {
    index: 5,
    key: 'all-attachments',
    label: 'Files',
    element: React.createElement(ProjectViewFiles),
  },
  {
    index: 6,
    key: 'members',
    label: 'Members',
    element: React.createElement(ProjectViewMembers),
  },
  {
    index: 7,
    key: 'updates',
    label: 'Updates',
    element: React.createElement(ProjectViewUpdates),
  },
];
