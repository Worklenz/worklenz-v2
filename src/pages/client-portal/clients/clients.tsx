import { Button, Card, Flex, Form, Popconfirm, Select, Table, Typography } from 'antd';
import React, { useState } from 'react';
import { useDocumentTitle } from '../../../hooks/useDoumentTItle';
import ClientPortalPageHeader from '../page-header/client-portal-page-header';
import { TableProps } from 'antd/lib';
import jsonData from './client.json';
import {
  DeleteOutlined,
  SettingOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { toggleClientDrawer } from '../../../features/client-portal/portalClientSlice';
import ClientDrawer from '../../../features/client-portal/client-drawer';

const Clients = () => {
  useDocumentTitle('Clients');

const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
const dispatch = useAppDispatch()
const [data, setData] = useState(jsonData);

const handleDelete = (clientId: string) => {
  const updatedData = data.filter((client) => client.clientId !== clientId);
  setData(updatedData)
}

  const columns: TableProps['columns'] = [
    {
      key: 'client',
      title: <Typography.Text style={{fontWeight: 500}}>Client</Typography.Text>,
      width: 500,
      dataIndex: 'clientName',
      onCell: (record) => ({
        onClick: () => {
          setSelectedClientId(record.clientId);
          dispatch(toggleClientDrawer())
        },
      })
    },
    {
      key: 'assignedProjects',
      title: <Typography.Text style={{fontWeight: 500}}>Assigned projects</Typography.Text>,
      dataIndex: 'assignedProjects',
    },
    {
      key: 'actions',
      title: <Typography.Text style={{fontWeight: 500}}>Actions</Typography.Text>,
      render: (_, record) => (
        <Flex gap={8}>
          <Button icon={<SettingOutlined />} size="small" />
          <Button icon={<ShareAltOutlined />} size="small" />
          <Popconfirm
            title="Are you sure?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.clientId)}
          >
            <Button icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  return (
    <Flex vertical style={{ position: 'relative', top: -50, width: '100%' }}>
      <ClientPortalPageHeader
        title={'Clients'}
        children={<Button type="primary">Add Client</Button>}
      />
      <Card style={{ width: '100%' }}>
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(record) => record.clientId}
          className="custom-two-colors-row-table"
          pagination={{
            showSizeChanger: true,
            defaultPageSize: 20,
            pageSizeOptions: ['5', '10', '15', '20', '50', '100'],
            size: 'small',
          }}
        />
      </Card>
      <ClientDrawer selectedClientId={selectedClientId}/>
    </Flex>
  );
};

export default Clients;
