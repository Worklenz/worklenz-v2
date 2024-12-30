import { Button, Drawer, Form, Input, Table, Typography } from 'antd';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TableProps } from 'antd/lib';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { toggleFinanceDrawer } from '../finance-slice';

const FinanceDrawer = () => {
  const { t } = useTranslation('ratecard-settings');
  const isDrawerOpen = useAppSelector(
    (state) => state.financeReducer.isFinanceDrawerOpen
  );
  const dispatch = useAppDispatch();

  // Mock data to match the image
  const data = [
    {
      key: '1',
      jobTitle: 'Project Managers',
      laborHours: 180,
      cost: 'Rs. 48,000',
    },
    {
      key: '2',
      jobTitle: 'Amila Sushitha',
      laborHours: 60,
      cost: 'Rs. 24,000',
    },
    {
      key: '3',
      jobTitle: 'Kevin Johnson',
      laborHours: 60,
      cost: 'Rs. 24,000',
    },
    {
      key: '4',
      jobTitle: 'UI/UX Designers',
      laborHours: 180,
      cost: 'Rs. 48,000',
    },
    {
      key: '5',
      jobTitle: 'Amila Sushitha',
      laborHours: 60,
      cost: 'Rs. 24,000',
    },
    {
      key: '6',
      jobTitle: 'Kevin Sushitha',
      laborHours: 60,
      cost: 'Rs. 24,000',
    },
  ];

  const columns: TableProps['columns'] = [
    {
      key: 'jobTitle',
      title: '',
      dataIndex: 'jobTitle',
      render: (text, record) => (
        <Typography.Text
          className={record.key % 3 === 1 ? 'font-medium' : 'pl-4'}
        >
          {text}
        </Typography.Text>
      ),
    },
    {
      key: 'laborHours',
      title: 'Labor Hours',
      dataIndex: 'laborHours',
      align: 'right',
      render: (hours) => <Typography.Text>{hours}</Typography.Text>,
    },
    {
      key: 'cost',
      title: 'Cost',
      dataIndex: 'cost',
      align: 'right',
      render: (cost) => <Typography.Text>{cost}</Typography.Text>,
    },
  ];

  return (
    <Drawer
      title={
        <Typography.Text style={{ fontWeight: 500, fontSize: 16 }}>
          Managing Data
        </Typography.Text>
      }
      open={isDrawerOpen}
      onClose={() => dispatch(toggleFinanceDrawer())}
      width={600}
    >
      <div className="rounded-lg bg-[#fafafa] p-4">
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          className="finance-table"
        />
      </div>
    </Drawer>
  );
};

export default FinanceDrawer;
