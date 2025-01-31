import { createBrowserRouter } from 'react-router-dom';
import rootRoutes from './rootRoutes';
import authRoutes from './authRoutes';
import mainRoutes from './mainRoutes';
import notFoundRoute from './notFoundRoute';
import accountSetupRoute from './accountSetupRoutes';
import reportingRoutes from './reportingRoutes';
import projectViewRoutes from './project-view-routes';
import clientPortalRoutes from './client-portal-routes';

const router = createBrowserRouter([
  ...rootRoutes,
  ...authRoutes,
  ...mainRoutes,
  ...reportingRoutes,
  ...projectViewRoutes,
  ...clientPortalRoutes,
  notFoundRoute,
  accountSetupRoute,
]);

export default router;
