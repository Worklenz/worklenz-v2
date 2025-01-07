import { Card, Flex } from 'antd';
import React from 'react';
import TimeReportPageHeader from './pageHeader/TimeReportPageHeader';
import EstimatedVsActualTimeSheet from './estimatedVsActualTimeSheet/EstimatedVsActualTimeSheet';
import TimeReportingRightHeader from './timeReportingRightHeader/TimeReportingRightHeader';
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '../../../hooks/useDoumentTItle';

const EstimatedVsActualTimeReports = () => {
  const { t } = useTranslation('timeReport');

  useDocumentTitle('Reporting - Allocation');

  return (
    <Flex vertical>
      <TimeReportingRightHeader title={t('estimatedVsActual')} />

      <Card
        style={{ borderRadius: '4px' }}
        title={
          <div style={{ padding: '16px 0' }}>
            <TimeReportPageHeader />
          </div>
        }
        styles={{
          body: {
            maxHeight: 'calc(100vh - 300px)',
            overflowY: 'auto',
            padding: '16px',
          },
        }}
      >
        <EstimatedVsActualTimeSheet />
      </Card>
    </Flex>
  );
};

export default EstimatedVsActualTimeReports;
