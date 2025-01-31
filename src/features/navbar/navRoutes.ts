export type NavRoutesType = {
  name: string;
  path: string;
  initialChild?: string | null;
};

export const navRoutes: NavRoutesType[] = [
  {
    name: 'home',
    path: '/worklenz/home',
    initialChild: null,
  },
  {
    name: 'projects',
    path: '/worklenz/projects',
    initialChild: null,
  },
  {
    name: 'schedule',
    path: '/worklenz/schedule',
    initialChild: null,
  },
  {
    name: 'reporting',
    path: '/worklenz/reporting',
    initialChild: 'overview',
  },
  {
    name: 'clientPortal',
    path: '/worklenz/client-portal',
    initialChild: 'clients',
  },
];
