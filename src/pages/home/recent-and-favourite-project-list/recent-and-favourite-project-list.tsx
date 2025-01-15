import { SyncOutlined } from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Empty,
  Flex,
  Segmented,
  Table,
  TableProps,
  Tooltip,
  Typography,
} from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import AddFavouriteProjectButton from './add-favourite-project-button';
import { IProjectViewModel } from '@/types/project/projectViewModel.types';

interface RecentAndFavouriteProjectListProps {
  handleRefresh: () => void;
  projectsList: IProjectViewModel[];
  projectSegment: 'Recent' | 'Favourites';
  handleSegmentChange: (value: 'Recent' | 'Favourites') => void;
  isLoading: boolean;
}

const RecentAndFavouriteProjectList = ({
  handleRefresh,
  projectsList,
  projectSegment,
  handleSegmentChange,
  isLoading,
}: RecentAndFavouriteProjectListProps) => {
  const { t } = useTranslation('home');

  // Table columns configuration
  const columns = useMemo<TableProps<IProjectViewModel>['columns']>(
    () => [
      {
        key: 'completeBtn',
        width: 32,
        render: (record: IProjectViewModel) => (
          <AddFavouriteProjectButton
            key={record.id}
            record={record}
            handleRefresh={handleRefresh}
          />
        ),
      },
      {
        key: 'name',
        render: (record: IProjectViewModel) => (
          <Typography.Paragraph key={record.id} style={{ margin: 0, paddingInlineEnd: 6 }}>
            <Badge color={record.color_code} style={{ marginInlineEnd: 4 }} />
            {record.name}
          </Typography.Paragraph>
        ),
      },
    ],
    [handleRefresh]
  );

  // Empty state message
  const emptyDescription = useMemo(
    () => (
      <Typography.Text>
        {projectSegment === 'Recent'
          ? t('projects.noRecentProjects')
          : t('projects.noFavouriteProjects')}
      </Typography.Text>
    ),
    [projectSegment, t]
  );

  // Card header components
  const cardTitle = (
    <Typography.Title level={5} style={{ marginBlockEnd: 0 }}>
      {t('projects.title')} ({projectsList.length})
    </Typography.Title>
  );

  const cardExtra = (
    <Flex gap={8} align="center">
      <Tooltip title={t('projects.refreshProjects')}>
        <Button
          shape="circle"
          icon={<SyncOutlined spin={isLoading} />}
          onClick={handleRefresh}
        />
      </Tooltip>
      <Segmented<'Recent' | 'Favourites'>
        options={['Recent', 'Favourites']}
        defaultValue={projectSegment}
        onChange={handleSegmentChange}
      />
    </Flex>
  );

  return (
    <Card
      title={cardTitle}
      extra={cardExtra}
      style={{ width: '100%' }}
    >
      {projectsList.length === 0 ? (
        <Empty
          image="https://app.worklenz.com/assets/images/empty-box.webp"
          imageStyle={{ height: 60 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          description={emptyDescription}
        />
      ) : (
        <Table
          className="custom-two-colors-row-table"
          rowKey="id"
          dataSource={projectsList}
          columns={columns}
          showHeader={false}
          pagination={false}
          loading={isLoading}
        />
      )}
    </Card>
  );
};

export default RecentAndFavouriteProjectList;
