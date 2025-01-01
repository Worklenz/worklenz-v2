import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Button,
  Drawer,
  Flex,
  Form,
  Input,
  message,
  Popconfirm,
  Table,
  Typography,
} from 'antd';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { toggleClientDrawer } from './portalClientSlice';
import jsonData from '../../pages/client-portal/clients/client.json';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import { avatarNamesMap } from '../../shared/constants';

interface ClientDrawerProps {
  selectedClientId: string | null;
}

const ClientDrawer: React.FC<ClientDrawerProps> = ({ selectedClientId }) => {
  const isDrawerOpen = useAppSelector(
    (state) => state.portalClientReducer.isClientDrawerOpen
  );
  const dispatch = useAppDispatch();

  const selectedClient = jsonData.find(
    (client) => client.clientId === selectedClientId
  );
  const [data, setData] = useState(selectedClient?.teamMembers || []);

  const handleDelete = (memberId: string) => {
    const updatedData = data?.filter((member) => member.memberId !== memberId);
    setData(updatedData);
  };

  const columns = [
    {
      key: 'name',
      title: <Typography.Text style={{ fontWeight: 500 }}>Name</Typography.Text>,
      dataIndex: 'memberName',
      render: (name: string) => (
        <Flex gap={8}>
          <Avatar
            style={{
              backgroundColor: avatarNamesMap[name.charAt(0)] || '#ccc',
              fontSize: '12px',
            }}
            size="small"
          >
            {name.charAt(0)}
          </Avatar>
          <div>{name}</div>
        </Flex>
      ),
    },
    {
      key: 'actions',
      title: <Typography.Text style={{ fontWeight: 500 }}>Actions</Typography.Text>,
      render: (_: any, record: { memberId: string }) => (
        <Flex gap={8}>
          <Popconfirm
            title="Are you sure?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.memberId)}
          >
            <Button icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  return (
    <Drawer
      title={selectedClient?.clientName}
      open={isDrawerOpen}
      onClose={() => dispatch(toggleClientDrawer())}
    >
      <Form layout="vertical">
        <Form.Item label="Copy link">
          <Flex gap={8}>
            <Input
              placeholder="https://app.worklenz.com/worklenz/projects/1803ce9b"
              readOnly
              value="https://app.worklenz.com/worklenz/projects/1803ce9b"
            />
            <Button
              icon={<CopyOutlined />}
              onClick={() => {
                const link = 'https://app.worklenz.com/worklenz/projects/1803ce9b';
                navigator.clipboard
                  .writeText(link)
                  .then(() => {
                    message.success('Link copied to clipboard');
                  })
                  .catch(() => {
                    message.error('Failed to copy link');
                  });
              }}
            />
          </Flex>
        </Form.Item>
        <Form.Item label="Add team members">
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item label="Team members">
          <Table
            dataSource={data}
            columns={columns}
            rowKey="memberId"
            className="custom-two-colors-row-table"
            pagination={{
              showSizeChanger: true,
              defaultPageSize: 20,
              pageSizeOptions: ['5', '10', '15', '20', '50', '100'],
              size: 'small',
            }}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ClientDrawer;
