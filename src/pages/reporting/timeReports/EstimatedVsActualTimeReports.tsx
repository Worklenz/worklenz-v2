import {
  Card,
  Flex,
  Segmented,
} from 'antd';
import React from 'react';
import TimeReportPageHeader from './pageHeader/TimeReportPageHeader';
import EstimatedVsActualTimeSheet from './estimatedVsActualTimeSheet/EstimatedVsActualTimeSheet';
import TimeReportingRightHeader from './timeReportingRightHeader/TimeReportingRightHeader';
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '../../../hooks/useDoumentTItle';

const EstimatedVsActualTimeReports = () => {

  const {t} = useTranslation('timeReport')

  useDocumentTitle('Reporting - Allocation')

  return (
    <Flex vertical>
      <TimeReportingRightHeader title = {t('estimatedVsActual')}/>

      <Card
        style={{ borderRadius: '4px' }}
        title={
          <div
            style={{
              padding: '16px 0',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <TimeReportPageHeader />
            <Segmented
              style={{ fontWeight: 500 }}
              options={[t('workingDays'), t('manDays')]}
            />
          </div>
        }
        styles={{
          body: {
            maxWidth: 'calc(100vw - 220px)',
            overflowX: 'auto',
            padding: '16px'
          },
        }}
      >
        <EstimatedVsActualTimeSheet />
      </Card>
    </Flex>
  );
};

export default EstimatedVsActualTimeReports;
