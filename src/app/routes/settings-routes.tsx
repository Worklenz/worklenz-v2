import { RouteObject } from 'react-router-dom';
import SettingsLayout from '@/layouts/SettingsLayout';
import { settingsItems } from '@/lib/settings/settings-constants';

const settingsRoutes: RouteObject[] = [
  {
    path: 'settings',
    element: <SettingsLayout />,
    children: settingsItems.map(item => ({
      path: item.endpoint,
      element: item.element,
    })),
  },
];

export default settingsRoutes;
