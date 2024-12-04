import { SyncOutlined } from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Empty,
  Flex,
  Segmented,
  Skeleton,
  Table,
  TableProps,
  Tooltip,
  Typography,
} from 'antd';
import React, { useState } from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { ProjectType } from '../../../types/project.types';
import AddFavouriteProjectButton from './AddFavouriteProjectButton';

const RecentAndFavouriteProjectList = () => {
  const [projectSegment, setProjectSegment] = useState<'Recent' | 'Favourites'>(
    'Recent'
  );
  const [isLoading, setIsLoading] = useState(false);
  const projectsList = useAppSelector(
    (state) => state.projectReducer.projectsList
  );

  // this project list check wheather it's recent projects or favourite projects
  const activeProjectsList =
    projectSegment === 'Recent'
      ? projectsList
      : projectsList.filter((project) => project.isFavourite);

  // function for handle refresh
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  // function for handle segmaent change between recent and favourites
  const handleSegmentChange = (value: 'Recent' | 'Favourites') => {
    if (value === 'Recent') {
      setProjectSegment('Recent');
      handleRefresh();
    } else {
      setProjectSegment('Favourites');
      handleRefresh();
    }
  };

  // table columns
  const columns: TableProps<ProjectType>['columns'] = [
    {
      key: 'completeBtn',
      width: 32,
      render: (record: ProjectType) => (
        <AddFavouriteProjectButton key={record.projectId} record={record} />
      ),
    },
    {
      key: 'name',
      render: (record: ProjectType) => (
        <Typography.Paragraph
          key={record.projectId}
          style={{ margin: 0, paddingInlineEnd: 6 }}
        >
          <Badge color={record.projectColor} style={{ marginInlineEnd: 4 }} />
          {record.projectName}
        </Typography.Paragraph>
      ),
    },
  ];

  return (
    <Card
      title={
        <Typography.Title level={5} style={{ marginBlockEnd: 0 }}>
          Projects ({activeProjectsList.length})
        </Typography.Title>
      }
      extra={
        <Flex gap={8} align="center">
          <Tooltip title='Refresh tasks'>
            <Button
              shape="circle"
              icon={<SyncOutlined spin={isLoading} />}
              onClick={() => handleRefresh()}
            />
          </Tooltip>
          <Segmented<'Recent' | 'Favourites'>
            options={['Recent', 'Favourites']}
            defaultValue="Recent"
            onChange={(value: 'Recent' | 'Favourites') =>
              handleSegmentChange(value)
            }
          />
        </Flex>
      }
      style={{ width: '100%' }}
    >
      {isLoading ? (
        <Skeleton />
      ) : (
        <div>
          {activeProjectsList.length === 0 ? (
            <Empty
              image="https://app.worklenz.com/assets/images/empty-box.webp"
              imageStyle={{ height: 60 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              description={
                <Typography.Text>
                  {projectSegment === 'Recent'
                    ? 'You have not assigned to any project yet.'
                    : 'No any favourite projects yet.'}
                </Typography.Text>
              }
            />
          ) : (
            <Table
              className="custom-two-colors-row-table"
              rowKey={(record) => record.projectId}
              dataSource={activeProjectsList}
              columns={columns}
              showHeader={false}
              pagination={false}
            />
          )}
        </div>
      )}
    </Card>
  );
};

export default RecentAndFavouriteProjectList;
