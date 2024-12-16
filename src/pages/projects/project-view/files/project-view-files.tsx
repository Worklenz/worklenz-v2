import {
  Button,
  Card,
  Flex,
  Popconfirm,
  Segmented,
  Table,
  TableProps,
  Tooltip,
  Typography,
} from 'antd';
import React, { useState } from 'react';
import { filesData, FilesDataType } from './files-date';
import { colors } from '@/styles/colors';
import {
  AppstoreOutlined,
  BarsOutlined,
  CloudDownloadOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import fileIcon from '@/assets/icons/file-icon.png';
import { durationDateFormat } from '@utils/durationDateFormat';
import EmptyListPlaceholder from '@components/EmptyListPlaceholder';

const ProjectViewFiles = () => {
  // get currently hover row
  const [hoverRow, setHoverRow] = useState<string | null>(null);

  // localization
  const { t } = useTranslation('project-view-files');

  // table columns
  const columns: TableProps['columns'] = [
    {
      key: 'fileName',
      title: t('nameColumn'),
      render: (record: FilesDataType) => (
        <Flex gap={4} align="center">
          <img
            src={fileIcon}
            alt={t('fileIconAlt')}
            style={{ width: '100%', maxWidth: 25 }}
          />
          <Typography.Text
            style={{
              color: hoverRow === record.fileId ? colors.skyBlue : 'inherit',
            }}
          >
            {record.fileName}
          </Typography.Text>
        </Flex>
      ),
    },
    {
      key: 'attachedTask',
      title: t('attachedTaskColumn'),
      render: (record: FilesDataType) => (
        <Typography.Text
          style={{
            color: hoverRow === record.fileId ? colors.skyBlue : 'inherit',
          }}
        >
          {record.attachedTask}
        </Typography.Text>
      ),
    },
    {
      key: 'size',
      title: t('sizeColumn'),
      render: (record: FilesDataType) => (
        <Typography.Text
          style={{
            color: hoverRow === record.fileId ? colors.skyBlue : 'inherit',
          }}
        >
          {record.size}
        </Typography.Text>
      ),
    },
    {
      key: 'uploadedBy',
      title: t('uploadedByColumn'),
      render: (record: FilesDataType) => (
        <Typography.Text
          style={{
            color: hoverRow === record.fileId ? colors.skyBlue : 'inherit',
          }}
        >
          {record.uploadedBy}
        </Typography.Text>
      ),
    },
    {
      key: 'uploadedAt',
      title: t('uploadedAtColumn'),
      render: (record: FilesDataType) => (
        <Typography.Text
          style={{
            color: hoverRow === record.fileId ? colors.skyBlue : 'inherit',
          }}
        >
          <Tooltip title='Nov 25,2024,10.45.54 AM'>
            {durationDateFormat(record.uploadedDate)}
          </Tooltip>
        </Typography.Text>
      ),
    },
    {
      key: 'actionBtns',
      width: 80,
      render: (record: FilesDataType) =>
        hoverRow === record.fileId && (
          <Flex gap={8} style={{ padding: 0 }}>
            <Popconfirm
              title={t('deleteConfirmationTitle')}
              icon={
                <ExclamationCircleFilled
                  style={{ color: colors.vibrantOrange }}
                />
              }
              okText={t('deleteConfirmationOk')}
              cancelText={t('deleteConfirmationCancel')}
              onConfirm={() => console.log('File deleted')}
            >
              <Tooltip title='Delete'>
                <Button shape="default" icon={<DeleteOutlined />} size="small" />
              </Tooltip>
            </Popconfirm>

            <Tooltip title='Download'>
              <Button size="small" icon={<CloudDownloadOutlined />} />
            </Tooltip>
          </Flex>
        ),
    },
  ];

  return (
    <Card
      style={{ width: '100%' }}
      title={
        <Flex justify="space-between">
          <Typography.Text
            style={{
              display: 'flex',
              gap: 4,
              alignItems: 'center',
              color: colors.lightGray,
              fontSize: 13,
              lineHeight: 1,
            }}
          >
            <ExclamationCircleOutlined />
            {t('titleDescriptionText')}
          </Typography.Text>

          <Tooltip title={t('segmentedTooltip')}>
            <Segmented
              options={[
                { value: 'listView', icon: <BarsOutlined /> },
                { value: 'thumbnailView', icon: <AppstoreOutlined /> },
              ]}
              defaultValue={'listView'}
              disabled={true}
            />
          </Tooltip>
        </Flex>
      }
    >
      {filesData.length === 0 ? (
        <EmptyListPlaceholder
          imageSrc="https://app.worklenz.com/assets/images/empty-box.webp"
          imageHeight={120}
          text={t('emptyText')}
        />
      ) : (
        <Table
          className="custom-two-colors-row-table"
          dataSource={filesData}
          columns={columns}
          rowKey={(record) => record.fileId}
          pagination={{
            showSizeChanger: true,
            defaultPageSize: 20,
          }}
          onRow={(record) => {
            return {
              onMouseEnter: () => setHoverRow(record.fileId),
              onMouseLeave: () => setHoverRow(null),
              style: {
                cursor: 'pointer',
                height: 42,
              },
            };
          }}
        />
      )}
    </Card>
  );
};

export default ProjectViewFiles;
