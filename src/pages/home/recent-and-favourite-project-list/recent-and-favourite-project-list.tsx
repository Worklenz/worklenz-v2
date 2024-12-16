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
import { useCallback, useEffect, useMemo, useState } from 'react';
import AddFavouriteProjectButton from './add-favourite-project-button';
import { IProjectViewModel } from '@/types/project/projectViewModel.types';
import { homePageApiService } from '@/api/home-page/home-page.api.service';
import { useTranslation } from 'react-i18next';

const RecentAndFavouriteProjectList = () => {
  const [projectSegment, setProjectSegment] = useState<'Recent' | 'Favourites'>('Recent');
  const [isLoading, setIsLoading] = useState(false);
  const [projectsList, setProjectsList] = useState<IProjectViewModel[]>([]);
  const { t } = useTranslation('home');

  const myProjectsActiveFilterKey = 'my-dashboard-active-projects-filter';

  const getActiveProjectsFilter = useCallback(() => {
    return +(localStorage.getItem(myProjectsActiveFilterKey) || 0);
  }, [myProjectsActiveFilterKey]);

  const setActiveProjectsFilter = useCallback(
    (value: number) => {
      localStorage.setItem(myProjectsActiveFilterKey, value.toString());
    },
    [myProjectsActiveFilterKey]
  );

  const getProjectsList = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await homePageApiService.getProjects(getActiveProjectsFilter());
      if (res.done) {
        setProjectsList(res.body);
      }
    } finally {
      setIsLoading(false);
    }
  }, [getActiveProjectsFilter]);

  const handleRefresh = useCallback(() => {
    getProjectsList();
  }, [getProjectsList]);

  const handleSegmentChange = useCallback(
    (value: 'Recent' | 'Favourites') => {
      setProjectSegment(value);
      setActiveProjectsFilter(value === 'Recent' ? 0 : 1);
      getProjectsList();
    },
    [getProjectsList, setActiveProjectsFilter]
  );

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

  useEffect(() => {
    getProjectsList();
  }, [getProjectsList]);

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

  return (
    <Card
      title={
        <Typography.Title level={5} style={{ marginBlockEnd: 0 }}>
          {t('projects.title')} ({projectsList.length})
        </Typography.Title>
      }
      extra={
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
            defaultValue="Recent"
            onChange={handleSegmentChange}
          />
        </Flex>
      }
      style={{ width: '100%' }}
    >
      <div>
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
      </div>
    </Card>
  );
};

export default RecentAndFavouriteProjectList;
