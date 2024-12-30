import { Button, Drawer, Table, Typography } from 'antd';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TableProps } from 'antd/lib';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { toggleFinanceDrawer } from '../finance-slice';

const FinanceDrawer = ({ task }: { task: any }) => {
  const { t } = useTranslation('ratecard-settings');
  const isDrawerOpen = useAppSelector(
    (state) => state.financeReducer.isFinanceDrawerOpen
  );
  const dispatch = useAppDispatch();

  console.log('here', task);

  // transform members data into a table-compatible format with null-checks
  const dataSource = useMemo(() => {
    if (!task || !task.members) {
      return [];
    }

    const totalMembers = task.members.length || 1; // Avoid division by zero
    const laborHoursPerMember = task.hours ? task.hours / totalMembers : 0;

    return task.members.map(
      (member: { jobRole: any; hourlyRate: number }, index: number) => ({
        key: index + 1,
        jobTitle: member.jobRole || 'N/A',
        laborHours: laborHoursPerMember,
        cost: member.hourlyRate ? laborHoursPerMember * member.hourlyRate : 0,
      })
    );
  }, [task]);

  // table columns
  const columns: TableProps['columns'] = [
    {
      key: 'jobTitle',
      title: 'Job Title',
      dataIndex: 'jobTitle',
      render: (text) => (
        <Typography.Text className="pl-4">{text}</Typography.Text>
      ),
    },
    {
      key: 'laborHours',
      title: 'Labor Hours',
      dataIndex: 'laborHours',
      align: 'right',
      render: (hours) => <Typography.Text>{hours.toFixed(2)}</Typography.Text>,
    },
    {
      key: 'cost',
      title: 'Cost',
      dataIndex: 'cost',
      align: 'right',
      render: (cost) => <Typography.Text>{cost.toFixed(2)}</Typography.Text>,
    },
  ];

  return (
    <Drawer
      title={
        <Typography.Text style={{ fontWeight: 500, fontSize: 16 }}>
          {task?.task}
        </Typography.Text>
      }
      open={isDrawerOpen}
      onClose={() => dispatch(toggleFinanceDrawer())}
      width={600}
    >
      <div className="rounded-lg bg-[#fafafa] p-4">
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          className="finance-table"
        />
      </div>
    </Drawer>
  );
};

export default FinanceDrawer;
