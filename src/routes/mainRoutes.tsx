import React from 'react';
import { RouteObject } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Homepage from '../pages/home/Homepage';
import ProjectList from '../pages/projects/ProjectList';
import ProjectView from '../pages/projects/projectView/ProjectView';
import settingsRoutes from './settingsRoutes';
import adminCenterRoutes from './adminCenterRoutes';
import Schedule from '../pages/schedule/Schedule';
import ProjectTemplateEditView from '../pages/settings/projectTemplates/projectTemplateEditView/ProjectTemplateEditView';

const mainRoutes: RouteObject[] = [
  {
    path: '/worklenz',
    element: <MainLayout />,
    children: [
      { path: 'home', element: <Homepage /> },
      { path: 'projects', element: <ProjectList /> },
      { path: 'schedule', element: <Schedule /> },
      { path: `projects/:projectId`, element: <ProjectView /> },
      { path: `settings/project-templates/edit/:templateId/:templateName`, element: <ProjectTemplateEditView />},
      ...settingsRoutes,
      ...adminCenterRoutes,
    ],
  },
];

export default mainRoutes;
