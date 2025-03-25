import { Card, Flex, Segmented } from 'antd';
import TimeReportPageHeader from '@/pages/reporting/timeReports/page-header/time-report-page-header';
import EstimatedVsActualTimeSheet from '@/pages/reporting/time-reports/estimated-vs-actual-time-sheet/estimated-vs-actual-time-sheet';
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '@/hooks/useDoumentTItle';
import TimeReportingRightHeader from './timeReportingRightHeader/TimeReportingRightHeader';
import { useState } from 'react';

const EstimatedVsActualTimeReports = () => {
  const { t } = useTranslation('time-report');
  const [type, setType] = useState<'workingDays' | 'manDays'>('workingDays');

  useDocumentTitle('Reporting - Allocation');

  return (
    <Flex vertical>
      <TimeReportingRightHeader title={t('estimatedVsActual')} export={() => {}} />

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
              onChange={value => setType(value as 'workingDays' | 'manDays')}
            />
          </div>
        }
        styles={{
          body: {
            maxWidth: 'calc(100vw - 220px)',
            overflowX: 'auto',
            padding: '16px',
          },
        }}
      >
        <EstimatedVsActualTimeSheet type={type} />
      </Card>
    </Flex>
  );
};

export default EstimatedVsActualTimeReports;
