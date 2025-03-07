import React from 'react';
import TimeReportPageHeader from '@/pages/reporting/timeReports/page-header/time-report-page-header';
import { Flex } from 'antd';
import TimeSheetTable from '@/pages/reporting/timeReports/time-sheet-table/time-sheet-table';
import TimeReportingRightHeader from './timeReportingRightHeader/TimeReportingRightHeader';
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '@/hooks/useDoumentTItle';

const OverviewTimeReports: React.FC = () => {
  const { t } = useTranslation('time-report');

  useDocumentTitle('Reporting - Allocation');

  return (
    <Flex vertical>
      <TimeReportingRightHeader title={t('timeSheet')} />

      <div>
        <TimeReportPageHeader />
      </div>
      <div style={{ marginTop: '1rem' }}>
        {/* Time Report Table */}
        <TimeSheetTable />
      </div>
    </Flex>
  );
};

export default OverviewTimeReports;
