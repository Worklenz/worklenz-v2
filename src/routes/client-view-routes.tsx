import { RouteObject } from 'react-router-dom';
import ClientViewLayout from '../layouts/client-view-layout';
import ClientViewServices from '../pages/client-view/services/client-view-service';
import ClientViewServiceDetails from '../pages/client-view/services/service-details/client-view-service-details';
import ClientViewProjects from '../pages/client-view/projects/client-view-projects';
import ClientViewChats from '../pages/client-view/chat/client-view-chats';
import ClientViewRequests from '../pages/client-view/requests/client-view-requests';

const clientViewRoutes: RouteObject[] = [
  {
    path: 'client-view',
    element: <ClientViewLayout />,
    children: [
      {
        path: 'services',
        element: <ClientViewServices />,
      },
      { path: 'services/:id', element: <ClientViewServiceDetails /> },
      { path: 'projects', element: <ClientViewProjects /> },
      { path: 'chats', element: <ClientViewChats /> },
      { path: 'requests', element: <ClientViewRequests /> },
    ],
  },
];

export default clientViewRoutes;
