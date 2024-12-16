import { Card, Flex, Segmented } from 'antd';
import TimeReportPageHeader from '@/pages/reporting/timeReports/page-header/time-report-page-header';
import EstimatedVsActualTimeSheet from '@/pages/reporting/timeReports/estimated-vs-actual-time-sheet/estimated-vs-actual-time-sheet';
import TimeReportingRightHeader from './timeReportingRightHeader/TimeReportingRightHeader';
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '@/hooks/useDoumentTItle';

const EstimatedVsActualTimeReports = () => {
  const { t } = useTranslation('time-report');

  useDocumentTitle('Reporting - Allocation');

  return (
    <Flex vertical>
      <TimeReportingRightHeader title={t('estimatedVsActual')} />

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
            <Segmented style={{ fontWeight: 500 }} options={[t('workingDays'), t('manDays')]} />
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
        <EstimatedVsActualTimeSheet />
      </Card>
    </Flex>
  );
};

export default EstimatedVsActualTimeReports;
