import React from 'react';
import OverviewReportsProjectStatusGraph from './OverviewReportsProjectStatusGraph';
import OverviewReportsProjectCategoryGraph from './OverviewReportsProjectCategoryGraph';
import OverviewReportsProjectHealthGraph from './OverviewReportsProjectHealthGraph';

type OverviewReportsOverviewTabProps = {
  teamsId?: string | null;
};

const OverviewReportsOverviewTab = ({
  teamsId = null,
}: OverviewReportsOverviewTabProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <OverviewReportsProjectStatusGraph />
      <OverviewReportsProjectCategoryGraph />
      <OverviewReportsProjectHealthGraph />
    </div>
  );
};

export default OverviewReportsOverviewTab;
