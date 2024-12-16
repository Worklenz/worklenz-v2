import { Tabs } from 'antd';
import { TabsProps } from 'antd/lib';
import React from 'react';
import { useTranslation } from 'react-i18next';
import OverviewReportsOverviewTab from './overviewTab/OverviewReportsOverviewTab';
import OverviewReportsProjectsTab from './projectsTab/OverviewReportsProjectsTab';
import OverviewReportsMembersTab from './membersTab/OverviewReportsMembersTab';

type OverviewReportsDrawerProps = {
  teamsId?: string | null;
};

const OverviewReportsDrawerTabs = ({
  teamsId = null,
}: OverviewReportsDrawerProps) => {
  // localization
  const { t } = useTranslation('reporting-overview-drawer');

  const tabItems: TabsProps['items'] = [
    {
      key: 'overview',
      label: t('overviewTab'),
      children: <OverviewReportsOverviewTab teamsId={teamsId} />,
    },
    {
      key: 'projects',
      label: t('projectsTab'),
      children: <OverviewReportsProjectsTab teamsId={teamsId} />,
    },
    {
      key: 'members',
      label: t('membersTab'),
      children: <OverviewReportsMembersTab teamsId={teamsId} />,
    },
  ];

  return <Tabs type="card" items={tabItems} />;
};

export default OverviewReportsDrawerTabs;
