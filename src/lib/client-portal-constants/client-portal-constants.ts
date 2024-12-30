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
    UserOutlined,
    UserSwitchOutlined,
  } from '@ant-design/icons';
  import React, { ReactNode } from 'react';
import ProfileSettings from '../../pages/client-portal/client-portal-view/profile/ProfileSettings';
  // type of a menu item in settings sidebar
  type ClientPortalItems = {
    key: string;
    name: string;
    endpoint: string;
    icon: ReactNode;
    element: ReactNode;
  };
  // settings all element items use for sidebar and routes
  export const clientPortalItems: ClientPortalItems[] = [
    {
      key: 'profile',
      name: 'profile',
      endpoint: 'profile',
      icon: React.createElement(UserOutlined),
      element: React.createElement(ProfileSettings),
    },
  ];
  