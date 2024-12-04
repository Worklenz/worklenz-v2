import React, { useEffect } from 'react';
import CustomPageHeader from '../pageHeader/CustomPageHeader';
import { Button, Card, Checkbox, Flex, Skeleton, Typography } from 'antd';
import OverviewStats from './overviewStats/OverviewStats';
import { useTranslation } from 'react-i18next';
import OverviewReportsTable from './overviewTable/OverviewReportsTable';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { fetchTeamsData } from '../../../features/reporting/overviewReports/overviewReportsSlice';
import { useDocumentTitle } from '../../../hooks/useDoumentTItle';

const OverviewReports = () => {
  //   localization
  const { t } = useTranslation('reportingOverview');

  useDocumentTitle('Reporting - Overview')

  const dispatch = useAppDispatch();

  // get teams list and loading state from teams repors reducer
  const { teamsList, isLoading } = useAppSelector(
    (state) => state.overviewReportsReducer
  );

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
          <Typography.Text style={{ fontSize: 16 }}>
            {t('teamsText')}
          </Typography.Text>
          {isLoading ? (
            <Skeleton />
          ) : (
            <OverviewReportsTable teamsList={teamsList} />
          )}
        </Flex>
      </Card>
    </Flex>
  );
};

export default OverviewReports;
