import { RouteObject } from 'react-router-dom';
import ReportingLayout from '@/layouts/ReportingLayout';
import {
  ReportingMenuItems,
  reportingsItems,
} from '@/lib/reporting/reporting-constants';
import { SuspenseFallback } from '@/components/suspense-fallback/suspense-fallback';
import { Suspense } from 'react';

//  function to flatten nested menu items
const flattenItems = (items: ReportingMenuItems[]): ReportingMenuItems[] => {
  return items.reduce<ReportingMenuItems[]>((acc, item) => {
    if (item.children) {
      return [...acc, ...flattenItems(item.children)];
    }
    return [...acc, item];
  }, []);
};

const flattenedItems = flattenItems(reportingsItems);

const reportingRoutes: RouteObject[] = [
  {
    path: 'worklenz/reporting',
    element: (
      <Suspense fallback={<SuspenseFallback />}>
        <ReportingLayout />
      </Suspense>
    ),
    children: flattenedItems.map((item) => ({
      path: item.endpoint,
      element: item.element,
    })),
  },
];

export default reportingRoutes;
