import React, { memo, useState } from 'react';
import { ConfigProvider, Table, TableColumnsType } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import CustomTableTitle from '../../../../CustomTableTitle';

type OverviewReportsMembersReportsTableProps = {
  membersList: any[];
};

const OverviewReportsMembersReportsTable = ({
  membersList,
}: OverviewReportsMembersReportsTableProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // localization
  const { t } = useTranslation('reporting-overview-drawer');

  const dispatch = useAppDispatch();

  // function to handle drawer toggle
  const handleDrawerOpen = (id: string) => {
    setSelectedId(id);
    // dispatch(toggleMembersReportsDrawer());
  };

  const columns: TableColumnsType = [
    {
      key: 'name',
      title: <CustomTableTitle title={t('nameColumn')} />,
      className: 'group-hover:text-[#1890ff]',
      dataIndex: 'name',
    },
    {
      key: 'email',
      title: <CustomTableTitle title={t('emailColumn')} />,
      className: 'group-hover:text-[#1890ff]',
      dataIndex: 'email',
    },
    {
      key: 'projects',
      title: <CustomTableTitle title={t('projectsColumn')} />,
      className: 'text-center group-hover:text-[#1890ff]',
      dataIndex: 'projects',
      width: 80,
    },
    {
      key: 'tasks',
      title: <CustomTableTitle title={t('tasksColumn')} />,
      className: 'text-center group-hover:text-[#1890ff]',
      dataIndex: 'total_tasks',
      width: 80,
    },
    {
      key: 'overdueTasks',
      title: <CustomTableTitle title={t('overdueTasksColumn')} />,
      className: 'text-center group-hover:text-[#1890ff]',
      dataIndex: 'overdue',
      width: 120,
    },
    {
      key: 'completedTasks',
      title: <CustomTableTitle title={t('completedTasksColumn')} />,
      className: 'text-center group-hover:text-[#1890ff]',
      dataIndex: 'total_completed',
      width: 140,
    },
    {
      key: 'ongoingTasks',
      title: <CustomTableTitle title={t('ongoingTasksColumn')} />,
      className: 'text-center group-hover:text-[#1890ff]',
      dataIndex: 'total_ongoing',
      width: 120,
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            cellPaddingBlock: 8,
            cellPaddingInline: 10,
          },
        },
      }}
    >
      <Table
        columns={columns}
        dataSource={membersList}
        scroll={{ x: 'max-content' }}
        onRow={record => {
          return {
            style: { height: 38, cursor: 'pointer' },
            className: 'group even:bg-[#4e4e4e10]',
          };
        }}
      />

      {/* <MembersReportsDrawer memberId={selectedId} /> */}
    </ConfigProvider>
  );
};

export default memo(OverviewReportsMembersReportsTable);
