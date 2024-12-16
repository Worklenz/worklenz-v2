import { RouteObject } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/home/home-page';
import ProjectList from '@/pages/projects/project-list';
import ProjectView from '@/pages/projects/project-view/project-view';
import settingsRoutes from './settings-routes';
import adminCenterRoutes from './admin-center-routes';
import Schedule from '@/pages/schedule/schedule';
import ProjectTemplateEditView from '@/pages/settings/project-templates/projectTemplateEditView/ProjectTemplateEditView';
import LicenseExpired from '@/pages/licenseExpired/LicenseExpired';

const mainRoutes: RouteObject[] = [
  {
    path: '/worklenz',
    element: <MainLayout />,
    children: [
      { path: 'home', element: <HomePage /> },
      { path: 'projects', element: <ProjectList /> },
      { path: 'schedule', element: <Schedule /> },
      { path: `projects/:projectId`, element: <ProjectView /> },
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
