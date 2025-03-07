import { Card, Flex } from 'antd';
import TimeReportPageHeader from '@/pages/reporting/timeReports/page-header/time-report-page-header';
import ProjectTimeSheetChart from '@/pages/reporting/timeReports/project-time-sheet/project-time-sheet-chart';
import TimeReportingRightHeader from './timeReportingRightHeader/TimeReportingRightHeader';
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '@/hooks/useDoumentTItle';

const ProjectsTimeReports = () => {
  const { t } = useTranslation('time-report');

  useDocumentTitle('Reporting - Allocation');

  return (
    <Flex vertical>
      <TimeReportingRightHeader title={t('projectsTimeSheet')} />

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
        <ProjectTimeSheetChart />
      </Card>
    </Flex>
  );
};

export default ProjectsTimeReports;
