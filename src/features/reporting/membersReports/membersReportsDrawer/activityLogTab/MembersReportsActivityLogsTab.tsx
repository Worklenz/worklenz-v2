import { Flex } from 'antd';
import React, { useMemo, useState } from 'react';
import { fetchData } from '../../../../../utils/fetchData';
import EmptyListPlaceholder from '../../../../../components/EmptyListPlaceholder';
import ActivityLogCard from './ActivityLogCard';
import UpdateTaskDrawer from '../../../../tasks/taskCreationAndUpdate/updateTaskDrawer/UpdateTaskDrawer';
import { useTranslation } from 'react-i18next';

type MembersReportsActivityLogsTabProps = {
  memberId: string | null;
};

const MembersReportsActivityLogsTab = ({
  memberId = null,
}: MembersReportsActivityLogsTabProps) => {
  // this state for open task drawer
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const [activityLogsData, setActivityLogsData] = useState<any[]>([]);

  // localization
  const { t } = useTranslation('reporting-members-drawer');

  // useMemo for memoizing the fetch functions
  useMemo(() => {
    fetchData(
      '/reportingMockData/membersReports/activityLogs.json',
      setActivityLogsData
    );
  }, []);

  console.log(activityLogsData);

  return (
    <>
      {activityLogsData.length > 0 ? (
        <Flex vertical gap={24}>
          {activityLogsData.map((logs) => (
            <ActivityLogCard
              key={logs.log_day}
              data={logs}
              setSelectedTaskId={setSelectedTaskId}
            />
          ))}
        </Flex>
      ) : (
        <EmptyListPlaceholder text={t('activityLogsEmptyPlaceholder')} />
      )}

      {/* update task drawer  */}
      <UpdateTaskDrawer taskId={selectedTaskId || ''} />
    </>
  );
};

export default MembersReportsActivityLogsTab;
