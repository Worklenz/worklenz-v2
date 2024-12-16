import React, { useEffect, useState } from 'react';
import CustomPageHeader from '@/pages/reporting/page-header/custom-page-header';
import { Button, Card, Checkbox, Flex, Table, TableProps, Typography, Skeleton } from 'antd';

import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { fetchTeamsData } from '../../../features/reporting/overviewReports/overviewReportsSlice';
import { useDocumentTitle } from '../../../hooks/useDoumentTItle';
import OverviewStats from '../overviewReports/overview-stats/overview-stats';
import OverviewReportsTable from '../overviewReports/overviewTable/OverviewReportsTable';

const OverviewReports = () => {
  //   localization
  const { t } = useTranslation('reporting-overview');

  useDocumentTitle('Reporting - Overview');

  const dispatch = useAppDispatch();

  // get teams list and loading state from teams repors reducer
  const { teamsList, isLoading } = useAppSelector(state => state.overviewReportsReducer);

  // load data from project reports reducer
  useEffect(() => {
    dispatch(fetchTeamsData());
  }, [dispatch]);

  return (
    <Flex vertical gap={24}>
      <CustomPageHeader
        title={t('overviewTitle')}
        children={
          <Button>
            <Checkbox />
            <Typography.Text>{t('includeArchivedButton')}</Typography.Text>
          </Button>
        }
      />

      <OverviewStats />

      <Card>
        <Flex vertical gap={12}>
          <Typography.Text style={{ fontSize: 16 }}>{t('teamsText')}</Typography.Text>
          {isLoading ? <Skeleton /> : <OverviewReportsTable teamsList={teamsList} />}
        </Flex>
      </Card>
    </Flex>
  );
};

export default OverviewReports;
