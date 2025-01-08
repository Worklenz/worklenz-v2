import { ContainerOutlined } from '@ant-design/icons';
import { Badge, Button, Table, TableProps } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface DataType {
  key: string;
  transactionId: string;
  startingDate: Date;
  endingDate: Date;
  status: string;
  paymentMethod: string;
}

const InvoicesTable: React.FC = () => {
  const { t } = useTranslation('current-bill');

  const columns: TableProps['columns'] = [
    {
      title: t('transactionId'),
      key: 'transactionId',
      dataIndex: 'transactionId',
    },
    {
      title: t('transactionDate'),
      key: 'transactionDate',
      render: (record) => {
        const formattedStartingDate = new Date(
          record.startingDate
        ).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        return `${formattedStartingDate}`;
      },
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
      title: t('paymentMethod'),
      key: 'paymentMethod',
      dataIndex: 'paymentMethod',
    },
    {
      title: t('status'),
      key: 'status',
      dataIndex: 'status',
      render: (text) => (
        <>
          <Badge status="success" />
          <span style={{ paddingLeft: '4px' }}>{text}</span>
        </>
      ),
    },
    {
      key: 'button',
      render: () => (
        <Button size="small">
          <ContainerOutlined />
        </Button>
      ),
    },
  ];

  const data: DataType[] = [
    {
      key: '1',
      transactionId: '113687890',
      startingDate: new Date('2024-08-31T08:30:00'),
      endingDate: new Date('2025-08-30T08:30:00'),
      status: 'Success',
      paymentMethod: 'Card',
    },
  ];

  return <Table columns={columns} dataSource={data} pagination={false} />;
};

export default InvoicesTable;
