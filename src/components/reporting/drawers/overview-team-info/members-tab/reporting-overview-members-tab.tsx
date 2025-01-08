import { Flex, Skeleton } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import CustomSearchbar from '../../../../CustomSearchbar';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import OverviewReportsMembersTable from './reporting-overview-members-table';
import { IRPTMember } from '@/types/reporting/reporting.types';

type OverviewReportsMembersTabProps = { teamsId?: string | null };

const OverviewReportsMembersTab = ({
  teamsId = null,
}: OverviewReportsMembersTabProps) => {
  const { t } = useTranslation('reporting-overview-drawer');

  const [searchQuery, setSearhQuery] = useState<string>('');
  const [membersList, setMembersList] = useState<IRPTMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
