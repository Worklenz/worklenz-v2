import React, { Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import AccountSetup from '@/pages/account-setup/account-setup';
import { SuspenseFallback } from '@/components/suspense-fallback/suspense-fallback';

const accountSetupRoute: RouteObject = {
  path: '/worklenz/setup',
  element: (
    <Suspense fallback={<SuspenseFallback />}>
      <AccountSetup />
    </Suspense>
  ),
};

export default accountSetupRoute;
