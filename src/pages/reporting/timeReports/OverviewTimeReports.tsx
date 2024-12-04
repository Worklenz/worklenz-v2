import React from 'react';
import TimeReportPageHeader from './pageHeader/TimeReportPageHeader';
import { Flex } from 'antd';
import TimeSheetTable from './timeSheetTable/TimeSheetTable';
import TimeReportingRightHeader from './timeReportingRightHeader/TimeReportingRightHeader';
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '../../../hooks/useDoumentTItle';

const OverviewTimeReports: React.FC = () => {

  const {t} = useTranslation('timeReport')

  useDocumentTitle('Reporting - Allocation')

  return (
    <Flex vertical>
      <TimeReportingRightHeader title={t('timeSheet')}/>

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
