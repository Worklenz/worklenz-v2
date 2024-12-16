export type NavRoutesType = {
  name: string;
  path: string;
  adminOnly: boolean;
};

export const navRoutes: NavRoutesType[] = [
  {
    name: 'home',
    path: '/worklenz/home',
    adminOnly: false,
  },
  {
    name: 'projects',
    path: '/worklenz/projects',
    adminOnly: false,
  },
  {
    name: 'schedule',
    path: '/worklenz/schedule',
    adminOnly: true,
  },
  {
    name: 'reporting',
    path: '/worklenz/reporting/overview',
    adminOnly: true,
  },
];
