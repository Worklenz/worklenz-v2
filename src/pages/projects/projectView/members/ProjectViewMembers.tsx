import {
  Button,
  Card,
  Flex,
  Popconfirm,
  Progress,
  Skeleton,
  Table,
  TableProps,
  Tooltip,
  Typography,
} from 'antd';
import React, { useState } from 'react';
import { colors } from '../../../../styles/colors';
import {
  DeleteOutlined,
  ExclamationCircleFilled,
  SyncOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import EmptyListPlaceholder from '../../../../components/EmptyListPlaceholder';
import CustomAvatar from '../../../../components/CustomAvatar';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { ProjectMemberType } from '../../../../types/projectMember.types';

const ProjectViewMembers = () => {
  // get currently hover row
  const [hoverRow, setHoverRow] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // localization
  const { t } = useTranslation('projectViewMembersTab');

  // get member list from project members slice
  const projectMembersList = useAppSelector(
    (state) => state.projectMemberReducer.membersList
  );

  // function for handle refresh
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  // table columns
  const columns: TableProps['columns'] = [
    {
      key: 'memberName',
      title: t('nameColumn'),
      sorter: (a, b) => a.memberName.localeCompare(b.memberName),
      render: (record: ProjectMemberType) => (
        <Flex gap={8} align="center">
          <CustomAvatar avatarName={record.memberName} size={26} />
          <Typography.Text
            style={{
              color: hoverRow === record.memberId ? colors.skyBlue : 'inherit',
            }}
          >
            {record.memberName}
          </Typography.Text>
        </Flex>
      ),
    },
    {
      key: 'jobTitle',
      title: t('jobTitleColumn'),
      sorter: (a, b) => a.jobTitle.localeCompare(b.jobTitle),
      width: 120,
      render: (record: ProjectMemberType) => (
        <Typography.Text
          style={{
            color: hoverRow === record.memberId ? colors.skyBlue : 'inherit',
            marginInlineStart: 12,
          }}
        >
          {record.jobTitle || '-'}
        </Typography.Text>
      ),
    },
    {
      key: 'email',
      title: t('emailColumn'),
      sorter: (a, b) => a.email.localeCompare(b.email),
      render: (record: ProjectMemberType) => (
        <Typography.Text
          style={{
            color: hoverRow === record.memberId ? colors.skyBlue : 'inherit',
          }}
        >
          {record.memberEmail}
        </Typography.Text>
      ),
    },
    {
      key: 'tasks',
      title: t('tasksColumn'),
      width: 90,
      render: (record: ProjectMemberType) => (
        <Typography.Text
          style={{
            color: hoverRow === record.memberId ? colors.skyBlue : 'inherit',
            marginInlineStart: 12,
          }}
        >
          {`${record.completedTasks}/${record.totalAssignedTasks}`}
        </Typography.Text>
      ),
    },
    {
      key: 'taskProgress',
      title: t('taskProgressColumn'),
      render: (record: ProjectMemberType) => (
        <Progress
          percent={Math.floor(
            (record.completedTasks / record.totalAssignedTasks) * 100
          )}
        />
      ),
    },
    {
      key: 'access',
      title: t('accessColumn'),
      sorter: (a, b) => a.access.localeCompare(b.access),
      render: (record: ProjectMemberType) => (
        <Typography.Text
          style={{
            color: hoverRow === record.memberId ? colors.skyBlue : 'inherit',
            textTransform: 'capitalize',
          }}
        >
          {record.memberRole}
        </Typography.Text>
      ),
    },
    {
      key: 'actionBtns',
      width: 80,
      render: (record: ProjectMemberType) =>
        hoverRow === record.memberId && (
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
              <Tooltip title={t('deleteButtonTooltip')}>
                <Button
                  disabled
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
        <Flex justify="space-between">
          <Typography.Text style={{ fontSize: 16, fontWeight: 500 }}>
            {projectMembersList?.length}{' '}
            {projectMembersList?.length !== 1
              ? t('membersCountPlural')
              : t('memberCount')}
          </Typography.Text>

          <Tooltip title={t('refreshButtonTooltip')}>
            <Button
              shape="circle"
              icon={<SyncOutlined />}
              onClick={() => handleRefresh()}
            />
          </Tooltip>
        </Flex>
      }
    >
      {projectMembersList?.length === 0 ? (
        <EmptyListPlaceholder imageHeight={120} text={t('emptyText')} />
      ) : isLoading ? (
        <Skeleton />
      ) : (
        <Table
          className="custom-two-colors-row-table"
          dataSource={projectMembersList ? projectMembersList : []}
          columns={columns}
          rowKey={(record) => record.memberId}
          pagination={{
            showSizeChanger: true,
            defaultPageSize: 20,
          }}
          onRow={(record) => {
            return {
              onMouseEnter: () => setHoverRow(record.memberId),
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

export default ProjectViewMembers;
