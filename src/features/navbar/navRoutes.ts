export type NavRoutesType = {
  name: string;
  path: string;
};

export const navRoutes: NavRoutesType[] = [
  {
    name: 'home',
    path: '/worklenz/home',
  },
  {
    name: 'projects',
    path: '/worklenz/projects',
  },
  {
    name: 'schedule',
    path: '/worklenz/schedule',
  },
  {
    name: 'reporting',
    path: '/worklenz/reporting/overview',
  },
];
