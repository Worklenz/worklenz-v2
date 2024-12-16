import React from 'react';
import MembersReportsStatCard from './MembersReportsStatCard';
import MembersReportsStatusGraph from './MembersReportsStatusGraph';
import MembersReportsPriorityGraph from './MembersReportsPriorityGraph';
import MembersReportsProjectGraph from './MembersReportsProjectGraph';

type MembersReportsOverviewTabProps = {
  memberId: string | null;
};

const MembersReportsOverviewTab = ({
  memberId,
}: MembersReportsOverviewTabProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <MembersReportsStatCard />
      <MembersReportsProjectGraph />
      <MembersReportsStatusGraph />
      <MembersReportsPriorityGraph />
    </div>
  );
};

export default MembersReportsOverviewTab;
