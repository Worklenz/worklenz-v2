import React from 'react';
import { RouteObject } from 'react-router-dom';
import { clientPortalItems } from '../lib/client-portal-constants/client-portal-constants';
import SettingsLayout from '../layouts/SettingsLayout';

const ClientPortalRoutes: RouteObject[] = [
  {
    path: 'client-portal',
    element: <SettingsLayout />,
    children: clientPortalItems.map((item) => ({
      path: item.endpoint,
      element: item.element,
    })),
  },
];

export default ClientPortalRoutes;
