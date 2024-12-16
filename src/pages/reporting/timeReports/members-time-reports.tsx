import { Card, Flex } from 'antd';
import TimeReportPageHeader from '@/pages/reporting/timeReports/page-header/time-report-page-header';
import MembersTimeSheet from '@/pages/reporting/timeReports/members-time-sheet/members-time-sheet';
import TimeReportingRightHeader from './timeReportingRightHeader/TimeReportingRightHeader';
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '../../../hooks/useDoumentTItle';

const MembersTimeReports = () => {
  const { t } = useTranslation('time-report');

  useDocumentTitle('Reporting - Allocation');

  return (
    <Flex vertical>
      <TimeReportingRightHeader title={t('Members Time Sheet')} />

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
        <MembersTimeSheet />
      </Card>
    </Flex>
  );
};

export default MembersTimeReports;
