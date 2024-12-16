import { Flex, Skeleton } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import CustomSearchbar from '../../../../../components/CustomSearchbar';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import { fetchMembersData } from '../../../membersReports/membersReportsSlice';
import OverviewReportsMembersTable from './OverviewReportsMembersTable';

type OverviewReportsMembersTabProps = { teamsId?: string | null };

const OverviewReportsMembersTab = ({
  teamsId = null,
}: OverviewReportsMembersTabProps) => {
  const [searchQuery, setSearhQuery] = useState<string>('');

  // localization
  const { t } = useTranslation('reporting-overview-drawer');

  const dispatch = useAppDispatch();

  // get member list and loading state from member repors reducer
  const { membersList, isLoading } = useAppSelector(
    (state) => state.membersReportsReducer
  );

  // load data from member reports reducer
  useEffect(() => {
    dispatch(fetchMembersData());
  }, [dispatch]);

  // used useMemo hook for re render the list when searching
  const filteredMembersData = useMemo(() => {
    return membersList.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, membersList]);

  return (
    <Flex vertical gap={24}>
      <CustomSearchbar
        placeholderText={t('searchByNameInputPlaceholder')}
        searchQuery={searchQuery}
        setSearchQuery={setSearhQuery}
      />

      {isLoading ? (
        <Skeleton />
      ) : (
        <OverviewReportsMembersTable membersList={filteredMembersData} />
      )}
    </Flex>
  );
};

export default OverviewReportsMembersTab;
