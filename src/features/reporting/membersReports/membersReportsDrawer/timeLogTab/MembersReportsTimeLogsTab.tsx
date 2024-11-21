import { Flex } from 'antd';
import React, { useMemo, useState } from 'react';
import BillableFilter from './BillableFilter';
import { fetchData } from '../../../../../utils/fetchData';
import TimeLogCard from './TimeLogCard';
import EmptyListPlaceholder from '../../../../../components/EmptyListPlaceholder';
import UpdateTaskDrawer from '../../../../tasks/taskCreationAndUpdate/updateTaskDrawer/UpdateTaskDrawer';
import { useTranslation } from 'react-i18next';

type MembersReportsTimeLogsTabProps = {
  memberId: string | null;
};

const MembersReportsTimeLogsTab = ({
  memberId = null,
}: MembersReportsTimeLogsTabProps) => {
  // this state for open task drawer
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const [timeLogsData, setTimeLogsData] = useState<any[]>([]);

  // localization
  const { t } = useTranslation('reportingMembersDrawer');

  // useMemo for memoizing the fetch functions
  useMemo(() => {
    fetchData(
      '/reportingMockData/membersReports/timeLogs.json',
      setTimeLogsData
    );
  }, []);

  return (
    <Flex vertical gap={24}>
      <BillableFilter />

      {timeLogsData.length > 0 ? (
        <Flex vertical gap={24}>
          {timeLogsData.map((logs) => (
            <TimeLogCard
              key={logs.log_day}
              data={logs}
              setSelectedTaskId={setSelectedTaskId}
            />
          ))}
        </Flex>
      ) : (
        <EmptyListPlaceholder text={t('timeLogsEmptyPlaceholder')} />
      )}

      {/* update task drawer  */}
      <UpdateTaskDrawer taskId={selectedTaskId || ''} />
    </Flex>
  );
};

export default MembersReportsTimeLogsTab;
