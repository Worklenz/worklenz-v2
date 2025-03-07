import { Button, Card, Checkbox, Dropdown, Flex, Skeleton, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import MembersReportsTable from './members-reports-table/members-reports-table';
import TimeWiseFilter from './time-wise-filter';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslation } from 'react-i18next';
import CustomSearchbar from '@components/CustomSearchbar';
import { useDocumentTitle } from '@/hooks/useDoumentTItle';
import CustomPageHeader from '../page-header/custom-page-header';
import {
  fetchMembersData,
  setArchived,
  setDuration,
  setDateRange,
  setSearchQuery,
} from '@/features/reporting/membersReports/membersReportsSlice';

const MembersReports = () => {
  const { t } = useTranslation('reporting-members');
  const dispatch = useAppDispatch();
  useDocumentTitle('Reporting - Members');

  const { archived, searchQuery, duration, dateRange } = useAppSelector(
    state => state.membersReportsReducer,
  );

  const handleExport = () => {
    console.log('export');
  };

  return (
    <Flex vertical>
      <CustomPageHeader
        title={`Members`}
        children={
          <Space>
            <Button>
              <Checkbox checked={archived} onChange={() => dispatch(setArchived(!archived))}>
                <Typography.Text>{t('includeArchivedButton')}</Typography.Text>
              </Checkbox>
            </Button>

            <TimeWiseFilter
              setDuration={duration => dispatch(setDuration(duration))}
              setDateRange={dateRange => dispatch(setDateRange(dateRange))}
              duration={duration}
              dateRange={dateRange}
            />

            <Dropdown
              menu={{ items: [{ key: '1', label: t('excelButton') }], onClick: handleExport }}
            >
              <Button type="primary" icon={<DownOutlined />} iconPosition="end">
                {t('exportButton')}
              </Button>
            </Dropdown>
          </Space>
        }
      />

      <Card
        title={
          <Flex justify="flex-end">
            <CustomSearchbar
              placeholderText={t('searchByNameInputPlaceholder')}
              searchQuery={searchQuery}
              setSearchQuery={query => dispatch(setSearchQuery(query))}
            />
          </Flex>
        }
      >
        <MembersReportsTable />
      </Card>
    </Flex>
  );
};

export default MembersReports;
