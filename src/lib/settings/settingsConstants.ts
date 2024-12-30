import {
  BankOutlined,
  DollarCircleOutlined,
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
import ProfileSettings from '../../pages/settings/profile/ProfileSettings';
import NotificationsSettings from '../../pages/settings/notifications/NotificationsSettings';
import ClientsSettings from '../../pages/settings/clients/ClientsSettings';
import JobTitlesSettings from '../../pages/settings/jobTitles/JobTitlesSettings';
import LabelsSettings from '../../pages/settings/labels/LabelsSettings';
import CategoriesSettings from '../../pages/settings/categories/CategoriesSettings';
import ProjectTemplatesSettings from '../../pages/settings/projectTemplates/ProjectTemplatesSettings';
import TaskTemplatesSettings from '../../pages/settings/taskTemplates/TaskTemplatesSettings';
import TeamMembersSettings from '../../pages/settings/teamMembers/TeamMembersSettings';
import TeamsSettings from '../../pages/settings/teams/TeamsSettings';
import ChangePassword from '../../pages/settings/changePassword/ChangePassword';
import LanguageAndRegionSettings from '../../pages/settings/languageAndRegion/LanguageAndRegionSettings';
import RatecardSettings from '../../pages/settings/ratecard/ratecard-settings';

// type of a menu item in settings sidebar
type SettingMenuItems = {
  key: string;
  name: string;
  endpoint: string;
  icon: ReactNode;
  element: ReactNode;
};
// settings all element items use for sidebar and routes
export const settingsItems: SettingMenuItems[] = [
  {
    key: 'profile',
    name: 'profile',
    endpoint: 'profile',
    icon: React.createElement(UserOutlined),
    element: React.createElement(ProfileSettings),
  },
  {
    key: 'notifications',
    name: 'notifications',
    endpoint: 'notifications',
    icon: React.createElement(NotificationOutlined),
    element: React.createElement(NotificationsSettings),
  },
  {
    key: 'clients',
    name: 'clients',
    endpoint: 'clients',
    icon: React.createElement(UserSwitchOutlined),
    element: React.createElement(ClientsSettings),
  },
  {
    key: 'job-titles',
    name: 'jobTitles',
    endpoint: 'job-titles',
    icon: React.createElement(IdcardOutlined),
    element: React.createElement(JobTitlesSettings),
  },
  {
    key: 'labels',
    name: 'labels',
    endpoint: 'labels',
    icon: React.createElement(TagsOutlined),
    element: React.createElement(LabelsSettings),
  },
  {
    key: 'categories',
    name: 'categories',
    endpoint: 'categories',
    icon: React.createElement(GroupOutlined),
    element: React.createElement(CategoriesSettings),
  },
  {
    key: 'project-templates',
    name: 'projectTemplates',
    endpoint: 'project-templates',
    icon: React.createElement(FileZipOutlined),
    element: React.createElement(ProjectTemplatesSettings),
  },
  {
    key: 'task-templates',
    name: 'taskTemplates',
    endpoint: 'task-templates',
    icon: React.createElement(ProfileOutlined),
    element: React.createElement(TaskTemplatesSettings),
  },
  {
    key: 'team-members',
    name: 'teamMembers',
    endpoint: 'team-members',
    icon: React.createElement(TeamOutlined),
    element: React.createElement(TeamMembersSettings),
  },
  {
    key: 'teams',
    name: 'teams',
    endpoint: 'teams',
    icon: React.createElement(BankOutlined),
    element: React.createElement(TeamsSettings),
  },
  {
    key: 'change-password',
    name: 'changePassword',
    endpoint: 'password',
    icon: React.createElement(LockOutlined),
    element: React.createElement(ChangePassword),
  },
  {
    key: 'ratecard',
    name: 'ratecard',
    endpoint: 'ratecard',
    icon: React.createElement(DollarCircleOutlined),
    element: React.createElement(RatecardSettings),
  },
  {
    key: 'language-and-region',
    name: 'languageAndRegion',
    endpoint: 'language-and-region',
    icon: React.createElement(GlobalOutlined),
    element: React.createElement(LanguageAndRegionSettings),
  },
];
