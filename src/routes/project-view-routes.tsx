import React from 'react';
import { RouteObject } from 'react-router-dom';
import ProjectViewLayout from '../layouts/project-view-layout';
import ProjectView from '../pages/projects/projectView/ProjectView';

const projectViewRoutes: RouteObject[] = [
  {
    path: '/worklenz',
    element: <ProjectViewLayout />,
    children: [{ path: `projects/:projectId`, element: <ProjectView /> }],
  },
];

export default projectViewRoutes;

// ,
