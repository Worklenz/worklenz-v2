import { Flex } from 'antd';
import React, { useMemo, useState } from 'react';
import { fetchData } from '@/utils/fetchData';
import EmptyListPlaceholder from '@/components/EmptyListPlaceholder';
import ActivityLogCard from './ActivityLogCard';
import { useTranslation } from 'react-i18next';

const TaskDrawer = React.lazy(() => import('@components/task-drawer/task-drawer'));

type MembersReportsActivityLogsTabProps = {
  memberId: string | null;
};

const MembersReportsActivityLogsTab = ({ memberId = null }: MembersReportsActivityLogsTabProps) => {
  // this state for open task drawer
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const [activityLogsData, setActivityLogsData] = useState<any[]>([]);

  // localization
  const { t } = useTranslation('reporting-members-drawer');

  // useMemo for memoizing the fetch functions
  useMemo(() => {
    fetchData('/reportingMockData/membersReports/activityLogs.json', setActivityLogsData);
  }, []);

  return (
    <>
      {activityLogsData.length > 0 ? (
        <Flex vertical gap={24}>
          {activityLogsData.map(logs => (
            <ActivityLogCard key={logs.log_day} data={logs} setSelectedTaskId={setSelectedTaskId} />
          ))}
        </Flex>
      ) : (
        <EmptyListPlaceholder text={t('activityLogsEmptyPlaceholder')} />
      )}

      {/* update task drawer  */}
      <TaskDrawer />
    </>
  );
};

export default MembersReportsActivityLogsTab;
