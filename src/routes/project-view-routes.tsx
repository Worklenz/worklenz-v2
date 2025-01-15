import React from 'react';
import { RouteObject } from 'react-router-dom';
import ProjectViewLayout from '../layouts/project-view-layout';
import ProjectView from '../pages/projects/projectView/ProjectView';
import Schedule from '../pages/schedule/Schedule';

const projectViewRoutes: RouteObject[] = [
  {
    path: '/worklenz',
    element: <ProjectViewLayout />,
    children: [
      { path: `projects/:projectId`, element: <ProjectView /> },
      { path: 'schedule', element: <Schedule /> },
    ],
  },
];

export default projectViewRoutes;
