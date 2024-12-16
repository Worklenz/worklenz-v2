import { Drawer, Typography } from 'antd';
import React, { useMemo, useState } from 'react';
import { useAppSelector } from '../../../../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../../../../hooks/useAppDispatch';
import { useTranslation } from 'react-i18next';
import { toggleMembersOverviewProjectsStatsDrawer } from '../../../membersReportsSlice';
import { fetchData } from '../../../../../../utils/fetchData';
import MembersOverviewProjectsStatsTable from './MembersOverviewProjectsStatsTable';

type MembersOverviewProjectsStatsDrawerProps = {
  memberId: string | null;
};

const MembersOverviewProjectsStatsDrawer = ({
  memberId,
}: MembersOverviewProjectsStatsDrawerProps) => {
  const [projectsData, setprojectsData] = useState<any[]>([]);

  // localization
  const { t } = useTranslation('reporting-members-drawer');

  const dispatch = useAppDispatch();

  // get drawer open state from the member reports reducer
  const isDrawerOpen = useAppSelector(
    (state) =>
      state.membersReportsReducer.isMembersOverviewProjectsStatsDrawerOpen
  );
  const { membersList } = useAppSelector(
    (state) => state.membersReportsReducer
  );

  // find the selected member based on memberId
  const selectedMember = membersList.find((member) => member.id === memberId);

  // function to handle drawer close
  const handleClose = () => {
    dispatch(toggleMembersOverviewProjectsStatsDrawer());
  };

  // useMemo for memoizing the fetch functions
  useMemo(() => {
    fetchData(
      '/reportingMockData/membersReports/projectsStatsOverview.json',
      setprojectsData
    );
  }, []);

  console.log(projectsData);

  return (
    <Drawer
      open={isDrawerOpen}
      onClose={handleClose}
      width={900}
      title={
        selectedMember && (
          <Typography.Text>
            {selectedMember.name}
            {t('projectsStatsOverviewDrawerTitle')}
          </Typography.Text>
        )
      }
    >
      <MembersOverviewProjectsStatsTable projectList={projectsData} />
    </Drawer>
  );
};

export default MembersOverviewProjectsStatsDrawer;
