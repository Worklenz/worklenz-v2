import React from 'react';
import { RouteObject } from 'react-router-dom';
import ClientPortalLayout from '../layouts/client-portal-layout';
import ClientPortalClients from '../pages/client-portal/clients/client-portal-clients';
import ClientPortalRequests from '../pages/client-portal/requests/client-portal-requests';
import ClientPortalServices from '../pages/client-portal/services/client-portal-services';
import ClientPortalSettings from '../pages/client-portal/settings/client-portal-settings';
import ClientPortalAddServices from '../pages/client-portal/services/add-service/client-portal-add-service';
import ClientPortalRequestDetails from '../pages/client-portal/requests/request-details/client-portal-request-details';
import ClientPortalChats from '../pages/client-portal/chats/client-portal-chats';

const clientPortalRoutes: RouteObject[] = [
  {
    path: 'worklenz/client-portal',
    element: <ClientPortalLayout />,
    children: [
      {
        path: 'clients',
        element: <ClientPortalClients />,
      },
      {
        path: 'requests',
        element: <ClientPortalRequests />,
      },
      {
        path: 'requests/:id',
        element: <ClientPortalRequestDetails />,
      },
      {
        path: 'services',
        element: <ClientPortalServices />,
      },
      {
        path: 'add-service',
        element: <ClientPortalAddServices />,
      },
      {
        path: 'chats',
        element: <ClientPortalChats />,
      },
      {
        path: 'settings',
        element: <ClientPortalSettings />,
      },
    ],
  },
];

export default clientPortalRoutes;
