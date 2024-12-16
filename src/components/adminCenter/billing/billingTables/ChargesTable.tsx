import { Table, TableProps } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface DataType {
  key: string;
  description: string;
  startingDate: Date;
  endingDate: Date;
  billStatus: string;
  perUserValue: number;
  users: number;
  amount: number;
}

const ChargesTable: React.FC = () => {
  const perUserValue = 5.99;
  const users = 23;

  const { t } = useTranslation('current-bill');

  const columns: TableProps['columns'] = [
    {
      title: t('description'),
      key: 'description',
      dataIndex: 'description',
    },
    {
      title: t('billingPeriod'),
      key: 'billingPeriod',
      render: (record) => {
        const formattedStartingDate = new Date(
          record.startingDate
        ).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        const formattedEndingDate = new Date(
          record.endingDate
        ).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        return `${formattedStartingDate} - ${formattedEndingDate}`;
      },
    },
    {
      title: t('billStatus'),
      key: 'billStatus',
      dataIndex: 'billStatus',
    },
    {
      title: t('perUserValue'),
      key: 'perUserValue',
      dataIndex: 'perUserValue',
      render: (text) => <span>USD {text}</span>,
    },
    {
      title: t('users'),
      key: 'users',
      dataIndex: 'users',
    },
    {
      title: t('amount'),
      key: 'amount',
      dataIndex: 'amount',
      render: (text) => <span>USD {text}</span>,
    },
  ];

  const data: DataType[] = [
    {
      key: '1',
      description: 'PRO - Monthly Plan Charge',
      startingDate: new Date('2024-08-31T08:30:00'),
      endingDate: new Date('2025-08-30T08:30:00'),
      billStatus: 'Deleted',
      perUserValue: perUserValue,
      users: users,
      amount: perUserValue * users,
    },
  ];

  return <Table columns={columns} dataSource={data} pagination={false} />;
};

export default ChargesTable;
