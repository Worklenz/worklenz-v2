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

import CreateJobTitlesDrawer from '../../../features/settings/job/CreateJobTitlesDrawer';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import {
  deleteJobTitle,
  toggleCreateJobTitleDrawer,
  toggleUpdateJobTitleDrawer,
} from '../../../features/settings/job/jobSlice';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { JobType } from '../../../types/job.types';

import PinRouteToNavbarButton from '../../../components/PinRouteToNavbarButton';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  SearchOutlined,
} from '@ant-design/icons';
import UpdateJobTitlesDrawer from '../../../features/settings/job/UpdateJobTitlesDrawer';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../styles/colors';
import { useDocumentTitle } from '../../../hooks/useDoumentTItle';

const JobTitlesSettings = () => {
  // localization
  const { t } = useTranslation('jobTitlesSettings');
  // get currently hover row
  const [hoverRow, setHoverRow] = useState<string | null>(null);
  // get currently selected job id
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useDocumentTitle('Manage Job Titles');

  // get data from job reducer
  const jobTitlesList = useAppSelector((state) => state.jobReducer.jobsList);
  const dispatch = useAppDispatch();
  // this is for get the current string that type on search bar
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobTitlesData = useMemo(() => {
    return jobTitlesList.filter((item) =>
      item.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [jobTitlesList, searchQuery]);

  // table columns
  const columns: TableProps['columns'] = [
    {
      key: 'jobTitle',
      title: t('nameColumn'),
      sorter: (a, b) => a.jobTitle.localeCompare(b.jobTitle),
      onCell: (record) => ({
        onClick: () => {
          setSelectedJobId(record.jobId);
          dispatch(toggleUpdateJobTitleDrawer());
        },
      }),
      render: (record: JobType) => (
        <Typography.Text
          style={{
            color: hoverRow === record.jobId ? colors.skyBlue : 'inherit',
          }}
        >
          {record.jobTitle}
        </Typography.Text>
      ),
    },
    {
      key: 'actionBtns',
      width: 80,
      render: (record: JobType) =>
        hoverRow === record.jobId && (
          <Flex gap={8} style={{ padding: 0 }}>
            <Tooltip title="Edit">
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => {
                  setSelectedJobId(record.jobId);
                  dispatch(toggleUpdateJobTitleDrawer());
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
              onConfirm={() => dispatch(deleteJobTitle(record.jobId))}
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
              onClick={() => dispatch(toggleCreateJobTitleDrawer())}
            >
              {t('createJobTitleButton')}
            </Button>

            <Tooltip title={t('pinTooltip')} trigger={'hover'}>
              {/* this button pin this route to navbar  */}
              <PinRouteToNavbarButton
                name="jobTitles"
                path="/worklenz/settings/job-titles"
              />
            </Tooltip>
          </Flex>
        </Flex>
      }
    >
      <Table
        className="custom-two-colors-row-table"
        dataSource={filteredJobTitlesData}
        columns={columns}
        rowKey={(record: any) => record.jobId}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 20,
          pageSizeOptions: ['5', '10', '15', '20', '50', '100'],
          size: 'small',
        }}
        onRow={(record: any) => {
          return {
            onMouseEnter: () => setHoverRow(record.jobId),
            onMouseLeave: () => setHoverRow(null),
            style: {
              cursor: 'pointer',
              height: 36,
            },
          };
        }}
      />
      {/* create job title drawer  */}
      <CreateJobTitlesDrawer />
      <UpdateJobTitlesDrawer selectedJobTitleId={selectedJobId} />
    </Card>
  );
};

export default JobTitlesSettings;
