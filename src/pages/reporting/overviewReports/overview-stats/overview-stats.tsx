import { Flex, Typography } from 'antd';
import React, { useMemo, useState } from 'react';
import OverviewStatCard from './overview-stat-card';
import {
  BankOutlined,
  FileOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { colors } from '../../../../styles/colors';
import { useTranslation } from 'react-i18next';

type TeamsStats = {
  count: number;
  projects: number;
  members: number;
};

type ProjectsStats = {
  count: number;
  active: number;
  overdue: number;
};

type MembersStats = {
  count: number;
  unassigned: number;
  overdue: number;
};

type StatsType = {
  teams: TeamsStats;
  projects: ProjectsStats;
  members: MembersStats;
};

const OverviewStats = () => {
  const [stats, setStats] = useState<StatsType | null>(null);

  //   localization
  const { t } = useTranslation('reporting-overview');

  // useMemo for memoizing the fetch functions
  useMemo(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          '/reportingMockData/overviewReports/stats.json'
        );
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error(
          `Error fetching data from /reportingMockData/overviewReports/stats.json:`,
          error
        );
      }
    };

    fetchData();
  }, []);

  return (
    <Flex gap={24}>
      <OverviewStatCard
        icon={<BankOutlined style={{ color: colors.skyBlue, fontSize: 42 }} />}
        title={`${stats?.teams.count} ${stats?.teams.count === 1 ? t('teamCount') : t('teamCountPlural')}`}
        children={
          <Flex vertical>
            <Typography.Text type="secondary">{`${stats?.teams.projects} ${stats?.teams.projects === 1 ? t('projectCount') : t('projectCountPlural')}`}</Typography.Text>
            <Typography.Text type="secondary">{`${stats?.teams.members} ${stats?.teams.members === 1 ? t('memberCount') : t('memberCountPlural')}`}</Typography.Text>
          </Flex>
        }
      />

      <OverviewStatCard
        icon={
          <FileOutlined style={{ color: colors.limeGreen, fontSize: 42 }} />
        }
        title={`${stats?.projects.count} ${stats?.projects.count === 1 ? t('projectCount') : t('projectCountPlural')}`}
        children={
          <Flex vertical>
            <Typography.Text type="secondary">
              {`${stats?.projects.active} ${stats?.projects.active === 1 ? t('activeProjectCount') : t('activeProjectCountPlural')}`}
            </Typography.Text>
            <Typography.Text type="danger">{`${stats?.projects.overdue} ${stats?.projects.overdue === 1 ? t('overdueProjectCount') : t('overdueProjectCountPlural')}`}</Typography.Text>
          </Flex>
        }
      />

      <OverviewStatCard
        icon={
          <UsergroupAddOutlined
            style={{ color: colors.lightGray, fontSize: 42 }}
          />
        }
        title={`${stats?.members.count} ${stats?.members.count === 1 ? t('memberCount') : t('memberCountPlural')}`}
        children={
          <Flex vertical>
            <Typography.Text type="secondary">
              {`${stats?.members.unassigned} ${stats?.members.unassigned === 1 ? t('unassignedMemberCount') : t('unassignedMemberCountPlural')}`}
            </Typography.Text>
            <Typography.Text type="danger">
              {`${stats?.members.overdue} ${stats?.members.overdue === 1 ? t('memberWithOverdueTaskCount') : t('memberWithOverdueTaskCountPlural')}`}
            </Typography.Text>
          </Flex>
        }
      />
    </Flex>
  );
};

export default OverviewStats;
