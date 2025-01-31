import {
  AppstoreOutlined,
  CommentOutlined,
  FileDoneOutlined,
  GroupOutlined,
  SettingOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import React, { ReactNode } from 'react';
import ClientPortalClients from '../../pages/client-portal/clients/client-portal-clients';
import ClientPortalRequests from '../../pages/client-portal/requests/client-portal-requests';
import ClientPortalServices from '../../pages/client-portal/services/client-portal-services';
import ClientPortalChats from '../../pages/client-portal/chats/client-portal-chats';
import ClientPortalInvoices from '../../pages/client-portal/invoices/client-portal-invoices';
import ClientPortalSettings from '../../pages/client-portal/settings/client-portal-settings';

// type of a menu item in client portal sidebar
type clientPortalMenuItems = {
  key: string;
  name: string;
  endpoint: string;
  icon: ReactNode;
  element: ReactNode;
};
// clientPortal all element items use for sidebar and routes
export const clientPortalItems: clientPortalMenuItems[] = [
  {
    key: 'clients',
    name: 'clients',
    endpoint: 'clients',
    icon: React.createElement(GroupOutlined),
    element: React.createElement(ClientPortalClients),
  },
  {
    key: 'requests',
    name: 'requests',
    endpoint: 'requests',
    icon: React.createElement(UnorderedListOutlined),
    element: React.createElement(ClientPortalRequests),
  },
  {
    key: 'services',
    name: 'services',
    endpoint: 'services',
    icon: React.createElement(AppstoreOutlined),
    element: React.createElement(ClientPortalServices),
  },
  {
    key: 'chats',
    name: 'chats',
    endpoint: 'chats',
    icon: React.createElement(CommentOutlined),
    element: React.createElement(ClientPortalChats),
  },
  // {
  //   key: 'invoices',
  //   name: 'invoices',
  //   endpoint: 'invoices',
  //   icon: React.createElement(FileDoneOutlined),
  //   element: React.createElement(ClientPortalInvoices),
  // },
  {
    key: 'settings',
    name: 'settings',
    endpoint: 'settings',
    icon: React.createElement(SettingOutlined),
    element: React.createElement(ClientPortalSettings),
  },
];
