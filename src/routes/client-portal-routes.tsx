import React from 'react';
import { RouteObject } from 'react-router-dom';
import ClientPortalLayout from '../layouts/client-portal-layout';
import { clientPortalItems } from '../lib/client-portal-constants/client-portal-constants';

const settingsRoutes: RouteObject[] = [
  {
    path: 'client-portal',
    element: <ClientPortalLayout />,
    children: clientPortalItems.map((item) => ({
      path: item.endpoint,
      element: item.element,
    })),
  },
];

export default settingsRoutes;
