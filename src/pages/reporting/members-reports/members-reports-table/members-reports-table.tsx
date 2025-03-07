import { useEffect, useState } from 'react';
import { ConfigProvider, Table, TableColumnsType } from 'antd';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from '@/hooks/useAppDispatch';
import CustomTableTitle from '@/components/CustomTableTitle';
import TasksProgressCell from './tablesCells/tasksProgressCell/TasksProgressCell';
import MemberCell from './tablesCells/memberCell/MemberCell';
import { fetchMembersData, toggleMembersReportsDrawer } from '@/features/reporting/membersReports/membersReportsSlice';
import { useAppSelector } from '@/hooks/useAppSelector';

const MembersReportsTable = () => {
  const { t } = useTranslation('reporting-members');
  const dispatch = useAppDispatch();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { membersList, isLoading, total, archived, searchQuery } = useAppSelector(state => state.membersReportsReducer);

  // function to handle drawer toggle
  const handleDrawerOpen = (id: string) => {
    setSelectedId(id);
    dispatch(toggleMembersReportsDrawer());
  };

  const columns: TableColumnsType = [
    {
      key: 'member',
      title: <CustomTableTitle title={t('memberColumn')} />,
      onCell: record => {
        return {
          onClick: () => handleDrawerOpen(record.id),
        };
      },
      render: record => <MemberCell member={record} />,
    },
    {
      key: 'tasksProgress',
      title: <CustomTableTitle title={t('tasksProgressColumn')} />,
      render: record => {
        const { todo, doing, done } = record.tasks_stat;
        return (todo || doing || done) ? <TasksProgressCell tasksStat={record.tasks_stat} /> : '-';
      },
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

  useEffect(() => {
    if (!isLoading) dispatch(fetchMembersData());
  }, [dispatch, archived, searchQuery]);

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
        pagination={{ showSizeChanger: true, defaultPageSize: 10, total: total }}
        scroll={{ x: 'max-content' }}
        loading={isLoading}
        onRow={record => {
          return {
            style: { height: 48, cursor: 'pointer' },
            className: 'group even:bg-[#4e4e4e10]',
          };
        }}
      />

      {/* <MembersReportsDrawer memberId={selectedId} /> */}
    </ConfigProvider>
  );
};

export default MembersReportsTable;
