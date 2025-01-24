import { RouteObject } from 'react-router-dom';
import AdminCenterLayout from '@/layouts/admin-center-layout';
import { adminCenterItems } from '@/pages/admin-center/admin-center-constants';
import { Suspense } from 'react';
import { SuspenseFallback } from '@/components/suspense-fallback/suspense-fallback';

const adminCenterRoutes: RouteObject[] = [
  {
    path: 'admin-center',
    element: (
      <Suspense fallback={<SuspenseFallback />}>
        <AdminCenterLayout />
      </Suspense>
    ),
    children: adminCenterItems.map((item) => ({
      path: item.endpoint,
      element: item.element,
    })),
  },
];

export default adminCenterRoutes;
