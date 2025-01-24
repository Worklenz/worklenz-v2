import { RouteObject } from 'react-router-dom';
import SettingsLayout from '@/layouts/SettingsLayout';
import { settingsItems } from '@/lib/settings/settings-constants';
import { SuspenseFallback } from '@/components/suspense-fallback/suspense-fallback';
import { Suspense } from 'react';

const settingsRoutes: RouteObject[] = [
  {
    path: 'settings',
    element: (
      <Suspense fallback={<SuspenseFallback />}>
        <SettingsLayout />
      </Suspense>
    ),
    children: settingsItems.map((item) => ({
      path: item.endpoint,
      element: item.element,
    })),
  },
];

export default settingsRoutes;
