import { RouteObject } from 'react-router-dom';
import AdminCenterLayout from '@/layouts/admin-center-layout';
import { adminCenterItems } from '@/pages/admin-center/admin-center-constants';

const adminCenterRoutes: RouteObject[] = [
  {
    path: 'admin-center',
    element: <AdminCenterLayout />,
    children: adminCenterItems.map((item) => ({
      path: item.endpoint,
      element: item.element,
    })),
  },
];

export default adminCenterRoutes;
