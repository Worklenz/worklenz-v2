import React from 'react';
import { RouteObject } from 'react-router-dom';
import { clientPortalItems } from '../lib/client-portal/client-portal-constants';
import ClientPortalLayout from '../layouts/client-portal-layout';

const clientPortalRoutes: RouteObject[] = [
  {
    path: 'worklenz/client-portal',
    element: <ClientPortalLayout />,
    children: clientPortalItems.map((item) => ({
      path: item.endpoint,
      element: item.element,
    })),
  },
];

export default clientPortalRoutes;
