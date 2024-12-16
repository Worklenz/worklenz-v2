import React, { memo, useState } from 'react';
import { ConfigProvider, Table, TableColumnsType } from 'antd';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import CustomTableTitle from '../../../../components/CustomTableTitle';
import TasksProgressCell from './tablesCells/tasksProgressCell/TasksProgressCell';
import MemberCell from './tablesCells/memberCell/MemberCell';
import MembersReportsDrawer from '../../../../features/reporting/membersReports/membersReportsDrawer/MembersReportsDrawer';
import { toggleMembersReportsDrawer } from '../../../../features/reporting/membersReports/membersReportsSlice';
import { useTranslation } from 'react-i18next';

type MembersReportsTableProps = {
  membersList: any[];
};

const MembersReportsTable = ({ membersList }: MembersReportsTableProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // localization
  const { t } = useTranslation('reporting-members');

  const dispatch = useAppDispatch();

  // function to handle drawer toggle
  const handleDrawerOpen = (id: string) => {
    setSelectedId(id);
    dispatch(toggleMembersReportsDrawer());
  };

  const columns: TableColumnsType = [
    {
      key: 'member',
      title: <CustomTableTitle title={t('memberColumn')} />,
      onCell: (record) => {
        return {
          onClick: () => handleDrawerOpen(record.id),
        };
      },
      render: (record) => <MemberCell member={record} />,
    },
    {
      key: 'tasksProgress',
      title: <CustomTableTitle title={t('tasksProgressColumn')} />,
      render: (record) => <TasksProgressCell tasksStat={record.tasks_stat} />,
    },
    {
      key: 'tasksAssigned',
      title: (
        <CustomTableTitle
          title={t('tasksAssignedColumn')}
          tooltip={t('tasksAssignedColumnTooltip')}
        />
      ),
      className: 'text-center group-hover:text-[#1890ff]',
      dataIndex: 'total_tasks',
      width: 180,
    },
    {
      key: 'overdueTasks',
      title: (
        <CustomTableTitle
          title={t('overdueTasksColumn')}
          tooltip={t('overdueTasksColumnTooltip')}
        />
      ),
      className: 'text-center group-hover:text-[#1890ff]',
      dataIndex: 'overdue',
      width: 180,
    },
    {
      key: 'completedTasks',
      title: (
        <CustomTableTitle
          title={t('completedTasksColumn')}
          tooltip={t('completedTasksColumnTooltip')}
        />
      ),
      className: 'text-center group-hover:text-[#1890ff]',
      dataIndex: 'total_completed',
      width: 180,
    },
    {
      key: 'ongoingTasks',
      title: (
        <CustomTableTitle
          title={t('ongoingTasksColumn')}
          tooltip={t('ongoingTasksColumnTooltip')}
        />
      ),
      className: 'text-center group-hover:text-[#1890ff]',
      dataIndex: 'total_ongoing',
      width: 180,
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
        pagination={{ showSizeChanger: true, defaultPageSize: 10 }}
        scroll={{ x: 'max-content' }}
        onRow={(record) => {
          return {
            style: { height: 48, cursor: 'pointer' },
            className: 'group even:bg-[#4e4e4e10]',
          };
        }}
      />

      <MembersReportsDrawer memberId={selectedId} />
    </ConfigProvider>
  );
};

export default memo(MembersReportsTable);
