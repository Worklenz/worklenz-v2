import {
  BankOutlined,
  FileZipOutlined,
  GlobalOutlined,
  GroupOutlined,
  IdcardOutlined,
  LockOutlined,
  NotificationOutlined,
  ProfileOutlined,
  TagsOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import React, { ReactNode } from 'react';
import Clients from '../../pages/client-portal/clients/clients';

// type of a menu item in settings sidebar
type ClientPortalMenuItems = {
  key: string;
  name: string;
  endpoint: string;
  icon: ReactNode;
  element: ReactNode;
};
// settings all element items use for sidebar and routes
export const clientPortalItems: ClientPortalMenuItems[] = [
  {
    key: 'clients',
    name: 'clients',
    endpoint: 'clients',
    icon: React.createElement(UsergroupAddOutlined),
    element: React.createElement(Clients),
  },
  {
    key: 'requests',
    name: 'requests',
    endpoint: 'requests',
    icon: React.createElement(UserOutlined),
    element: React.createElement(Clients),
  },
  {
    key: 'services',
    name: 'services',
    endpoint: 'services',
    icon: React.createElement(UserOutlined),
    element: React.createElement(Clients),
  },
  {
    key: 'chats',
    name: 'chats',
    endpoint: 'chats',
    icon: React.createElement(UserOutlined),
    element: React.createElement(Clients),
  },
  {
    key: 'invoices',
    name: 'invoices',
    endpoint: 'invoices',
    icon: React.createElement(UserOutlined),
    element: React.createElement(Clients),
  },
  {
    key: 'settings',
    name: 'settings',
    endpoint: 'settings',
    icon: React.createElement(UserOutlined),
    element: React.createElement(Clients),
  },
];
