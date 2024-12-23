import React, { ReactNode } from 'react';
import OverviewReports from '../../pages/reporting/overviewReports/OverviewReports';
import ProjectsReports from '../../pages/reporting/projectsReports/ProjectsReports';
import MembersReports from '../../pages/reporting/membersReports/MembersReports';
import OverviewTimeReports from '../../pages/reporting/timeReports/OverviewTimeReports';
import ProjectsTimeReports from '../../pages/reporting/timeReports/ProjectsTimeReports';
import MembersTimeReports from '../../pages/reporting/timeReports/MembersTimeReports';
import SmartChatReport from '../../pages/reporting/smartChatReports/smartChatReport';
import EstimatedVsActualTimeReports from '../../pages/reporting/timeReports/EstimatedVsActualTimeReports';

// Type definition for a menu item
export type ReportingMenuItems = {
  key: string;
  name: string;
  endpoint: string;
  element: ReactNode;
  children?: ReportingMenuItems[];
};

// Reporting paths and related elements with nested structure
export const reportingsItems: ReportingMenuItems[] = [
  {
    key: 'overview',
    name: 'overview',
    endpoint: 'overview',
    element: React.createElement(OverviewReports),
  },
  {
    key: 'projects',
    name: 'projects',
    endpoint: 'projects',
    element: React.createElement(ProjectsReports),
  },
  {
    key: 'members',
    name: 'members',
    endpoint: 'members',
    element: React.createElement(MembersReports),
  },
  {
    key: 'time-sheet',
    name: 'timeReports',
    endpoint: 'time-sheets',
    element: null,
    children: [
      {
        key: 'time-sheet-overview',
        name: 'overview',
        endpoint: 'time-sheet-overview',
        element: React.createElement(OverviewTimeReports),
      },
      {
        key: 'time-sheet-projects',
        name: 'projects',
        endpoint: 'time-sheet-projects',
        element: React.createElement(ProjectsTimeReports),
      },
      {
        key: 'time-sheet-members',
        name: 'members',
        endpoint: 'time-sheet-members',
        element: React.createElement(MembersTimeReports),
      },
      {
        key: 'time-sheet-estimate-vs-actual',
        name: 'estimateVsActual',
        endpoint: 'time-sheet-estimate-vs-actual',
        element: React.createElement(EstimatedVsActualTimeReports),
      },
    ],
  },
  {
    key: 'smart-chat',
    name: 'Smart Chat',
    endpoint: 'smart-chat',
    element: React.createElement(SmartChatReport),
  },
];
