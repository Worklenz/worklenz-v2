import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Flex,
  Input,
  Popconfirm,
  Table,
  TableProps,
  Tooltip,
  Typography,
} from 'antd';
import React, { useMemo, useState } from 'react';
import { colors } from '../../../styles/colors';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import {
  deleteClient,
  toggleCreateClientDrawer,
  toggleUpdateClientDrawer,
} from '../../../features/settings/client/clientSlice';
import CreateClientDrawer from '../../../features/settings/client/CreateClientDrawer';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { ClientType } from '../../../types/client.types';

import PinRouteToNavbarButton from '../../../components/PinRouteToNavbarButton';
import UpdateClientDrawer from '../../../features/settings/client/UpdateClientDrawer';
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '../../../hooks/useDoumentTItle';

const ClientsSettings = () => {
  // localization
  const { t } = useTranslation('clientSettings');

  useDocumentTitle('Manage Clients');

  // get currently hover row
  const [hoverRow, setHoverRow] = useState<string | null>(null);
  // get currently selected client id
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // get data from client reducer
  const clientsList = useAppSelector(
    (state) => state.clientReducer.clientsList
  );
  const dispatch = useAppDispatch();

  // this is for get the current string that type on search bar
  const [searchQuery, setSearchQuery] = useState<string>('');

  // used useMemo hook for re render the list when searching
  const filteredClientsData = useMemo(() => {
    return clientsList.filter((item) =>
      item.clientName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [clientsList, searchQuery]);

  // table columns
  const columns: TableProps['columns'] = [
    {
      key: 'clientName',
      title: t('nameColumn'),
      sorter: (a, b) => a.clientName.localeCompare(b.clientName),
      onCell: (record) => ({
        onClick: () => {
          setSelectedClientId(record.clientId);
          dispatch(toggleUpdateClientDrawer());
        },
      }),
      render: (record: ClientType) => (
        <Typography.Text
          style={{
            color: hoverRow === record.clientId ? colors.skyBlue : 'inherit',
          }}
        >
          {record.clientName}
        </Typography.Text>
      ),
    },
    {
      key: 'project',
      title: t('projectColumn'),
      onCell: (record) => ({
        onClick: () => {
          setSelectedClientId(record.clientId);
          dispatch(toggleUpdateClientDrawer());
        },
      }),
      render: (record: ClientType) =>
        record.project ? (
          <Typography.Text>{record.project}</Typography.Text>
        ) : (
          <Typography.Text type="secondary">
            {t('noProjectsAvailable')}
          </Typography.Text>
        ),
    },
    {
      key: 'actionBtns',
      width: 80,
      render: (record: ClientType) =>
        hoverRow === record.clientId && (
          <Flex gap={8} style={{ padding: 0 }}>
            <Tooltip title="Edit">
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => {
                  setSelectedClientId(record.clientId);
                  dispatch(toggleUpdateClientDrawer());
                }}
              />
            </Tooltip>

            <Popconfirm
              title={t('deleteConfirmationTitle')}
              icon={
                <ExclamationCircleFilled
                  style={{ color: colors.vibrantOrange }}
                />
              }
              okText={t('deleteConfirmationOk')}
              cancelText={t('deleteConfirmationCancel')}
              onConfirm={() => dispatch(deleteClient(record.clientId))}
            >
              <Tooltip title="Delete">
                <Button
                  shape="default"
                  icon={<DeleteOutlined />}
                  size="small"
                />
              </Tooltip>
            </Popconfirm>
          </Flex>
        ),
    },
  ];

  return (
    <Card
      style={{ width: '100%' }}
      title={
        <Flex justify="flex-end">
          <Flex
            gap={8}
            align="center"
            justify="flex-end"
            style={{ width: '100%', maxWidth: 400 }}
          >
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              placeholder={t('searchPlaceholder')}
              style={{ maxWidth: 232 }}
              suffix={<SearchOutlined />}
            />
            <Button
              type="primary"
              onClick={() => dispatch(toggleCreateClientDrawer())}
            >
              {t('createClient')}
            </Button>

            <Tooltip title={t('pinTooltip')} trigger={'hover'}>
              {/* this button pin this route to navbar  */}
              <PinRouteToNavbarButton
                name="clients"
                path="/worklenz/settings/clients"
              />
            </Tooltip>
          </Flex>
        </Flex>
      }
    >
      <Table
        className="custom-two-colors-row-table"
        dataSource={filteredClientsData}
        columns={columns}
        rowKey={(record) => record.clientId}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 20,
          pageSizeOptions: ['5', '10', '15', '20', '50', '100'],
          size: 'small',
        }}
        onRow={(record) => {
          return {
            onMouseEnter: () => setHoverRow(record.clientId),
            onMouseLeave: () => setHoverRow(null),
            style: {
              cursor: 'pointer',
              height: 36,
            },
          };
        }}
      />

      {/*  client drawers  */}
      <CreateClientDrawer />
      <UpdateClientDrawer selectedClientId={selectedClientId} />
    </Card>
  );
};

export default ClientsSettings;
