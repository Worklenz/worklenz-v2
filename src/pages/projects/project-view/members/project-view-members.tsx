// Ant Design Components
import {
  Avatar,
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

// Icons
import { DeleteOutlined, ExclamationCircleFilled, SyncOutlined } from '@ant-design/icons';

// React & Router
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Services & API
import { projectsApiService } from '@/api/projects/projects.api.service';
import { projectMembersApiService } from '@/api/project-members/project-members.api.service';
import { useAuth } from '@/hooks/useAuth';

// Types
import { IProjectMembersViewModel, IProjectMemberViewModel } from '@/types/projectMember.types';

// Constants & Utils
import { DEFAULT_PAGE_SIZE } from '@/shared/constants';
import { colors } from '../../../../styles/colors';
import logger from '@/utils/errorLogger';

// Components
import EmptyListPlaceholder from '../../../../components/EmptyListPlaceholder';

interface PaginationType {
  current: number;
  pageSize: number;
  field: string;
  order: string;
  total: number;
  pageSizeOptions: string[];
  size: 'small' | 'default';
}

const ProjectViewMembers = () => {
  // Hooks
  const { projectId } = useParams();
  const { t } = useTranslation('project-view-members');
  const auth = useAuth();
  const user = auth.getCurrentSession();
  const isOwnerOrAdmin = auth.isOwnerOrAdmin();

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState<IProjectMembersViewModel>();
  const [pagination, setPagination] = useState<PaginationType>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    field: 'name',
    order: 'desc',
    total: 0,
    pageSizeOptions: ['5', '10', '15', '20', '50', '100'],
    size: 'small',
  });

  // API Functions
  const getProjectMembers = async () => {
    if (!projectId) return;
    
    setIsLoading(true);
    try {
      const res = await projectsApiService.getMembers(
        projectId, 
        pagination.current, 
        pagination.pageSize, 
        pagination.field, 
        pagination.order, 
        null
      );
      if (res.done) {
        setMembers(res.body);
      }
    } catch (error) {
      logger.error('Error fetching members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMember = async (memberId: string | undefined) => {
    if (!memberId || !projectId) return;
    
    try {
      const res = await projectMembersApiService.deleteProjectMember(memberId, projectId);
      if (res.done) {
        void getProjectMembers();
      }
    } catch (error) {
      logger.error('Error deleting member:', error);
    }
  };

  // Helper Functions
  const checkDisabled = (record: IProjectMemberViewModel): boolean => {
    if (!isOwnerOrAdmin) return true;
    if (user?.team_member_id === record.team_member_id) return true;
    return false;
  };

  const calculateProgressPercent = (completed: number = 0, total: number = 0): number => {
    if (total === 0) return 0;
    return Math.floor((completed / total) * 100);
  };

  // Effects
  useEffect(() => {
    void getProjectMembers();
  }, [projectId, pagination.current, pagination.pageSize, pagination.field, pagination.order]);

  // Table Configuration
  const columns: TableProps['columns'] = [
    {
      key: 'memberName',
      title: t('nameColumn'),
      sorter: true,
      render: (record: IProjectMemberViewModel) => (
        <Flex gap={8} align="center">
          <Avatar size={28} src={record.avatar_url}>
            {record.name?.charAt(0)}
          </Avatar>
          <Typography.Text>{record.name}</Typography.Text>
        </Flex>
      ),
    },
    {
      key: 'jobTitle',
      title: t('jobTitleColumn'),
      sorter: (a, b) => a.jobTitle.localeCompare(b.jobTitle),
      width: 120,
      render: (record: IProjectMemberViewModel) => (
        <Typography.Text style={{ marginInlineStart: 12 }}>
          {record.job_title || '-'}
        </Typography.Text>
      ),
    },
    {
      key: 'email',
      title: t('emailColumn'),
      sorter: (a, b) => a.email.localeCompare(b.email),
      render: (record: IProjectMemberViewModel) => (
        <Typography.Text>{record.email}</Typography.Text>
      ),
    },
    {
      key: 'tasks',
      title: t('tasksColumn'),
      width: 90,
      render: (record: IProjectMemberViewModel) => (
        <Typography.Text style={{ marginInlineStart: 12 }}>
          {`${record.completed_tasks_count}/${record.all_tasks_count}`}
        </Typography.Text>
      ),
    },
    {
      key: 'taskProgress',
      title: t('taskProgressColumn'),
      render: (record: IProjectMemberViewModel) => (
        <Progress
          percent={calculateProgressPercent(record.completed_tasks_count, record.all_tasks_count)}
        />
      ),
    },
    {
      key: 'access',
      title: t('accessColumn'),
      sorter: (a, b) => a.access.localeCompare(b.access),
      render: (record: IProjectMemberViewModel) => (
        <Typography.Text style={{ textTransform: 'capitalize' }}>
          {record.access}
        </Typography.Text>
      ),
    },
    {
      key: 'actionBtns',
      width: 80,
      render: (record: IProjectMemberViewModel) => (
        <Flex gap={8} style={{ padding: 0 }} className="action-buttons">
          <Popconfirm
            title={t('deleteConfirmationTitle')}
            icon={<ExclamationCircleFilled style={{ color: colors.vibrantOrange }} />}
            okText={t('deleteConfirmationOk')}
            cancelText={t('deleteConfirmationCancel')}
            onConfirm={() => deleteMember(record.id)}
          >
            <Tooltip title={t('deleteButtonTooltip')}>
              <Button 
                disabled={checkDisabled(record)} 
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
            {members?.total} {members?.total !== 1 ? t('membersCountPlural') : t('memberCount')}
          </Typography.Text>

          <Tooltip title={t('refreshButtonTooltip')}>
            <Button 
              shape="circle" 
              icon={<SyncOutlined />} 
              onClick={() => void getProjectMembers()} 
            />
          </Tooltip>
        </Flex>
      }
    >
      {members?.total === 0 ? (
        <EmptyListPlaceholder
          imageSrc="https://app.worklenz.com/assets/images/empty-box.webp"
          imageHeight={120}
          text={t('emptyText')}
        />
      ) : isLoading ? (
        <Skeleton />
      ) : (
        <Table
          className="custom-two-colors-row-table"
          dataSource={members?.data}
          columns={columns}
          rowKey={record => record.id}
          pagination={{
            showSizeChanger: true,
            defaultPageSize: 20,
          }}
          onRow={record => ({
            style: {
              cursor: 'pointer',
              height: 42,
            },
          })}
        />
      )}
    </Card>
  );
};

export default ProjectViewMembers;
