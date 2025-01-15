import React from 'react';
import { RouteObject } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Homepage from '../pages/home/Homepage';
import ProjectList from '../pages/projects/ProjectList';
import settingsRoutes from './settingsRoutes';
import adminCenterRoutes from './adminCenterRoutes';
import ProjectTemplateEditView from '../pages/settings/projectTemplates/projectTemplateEditView/ProjectTemplateEditView';
import LicenseExpired from '../pages/licenseExpired/LicenseExpired';

const mainRoutes: RouteObject[] = [
  {
    path: '/worklenz',
    element: <MainLayout />,
    children: [
      { path: 'home', element: <Homepage /> },
      { path: 'projects', element: <ProjectList /> },
      {
        path: `settings/project-templates/edit/:templateId/:templateName`,
        element: <ProjectTemplateEditView />,
      },
      { path: 'license-expired', element: <LicenseExpired /> },
      ...settingsRoutes,
      ...adminCenterRoutes,
    ],
  },
];

export default mainRoutes;
