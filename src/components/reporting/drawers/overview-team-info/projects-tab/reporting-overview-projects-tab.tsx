import { Flex, PaginationProps, Skeleton } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import CustomSearchbar from '@components/CustomSearchbar';
import { useTranslation } from 'react-i18next';
import ProjectsReportsTable from '@/pages/reporting/projectsReports/projectsReportsTable/projects-reports-table';
import { IRPTProject } from '@/types/reporting/reporting.types';
import logger from '@/utils/errorLogger';
import { reportingApiService } from '@/api/reporting/reporting.api.service';
import { DEFAULT_PAGE_SIZE } from '@/shared/constants';
import { useAppSelector } from '@/hooks/useAppSelector';

interface OverviewReportsProjectsTabProps {
  teamsId?: string | null;
}

const OverviewReportsProjectsTab = ({
  teamsId = null,
}: OverviewReportsProjectsTabProps) => {
  const { t } = useTranslation('reporting-projects-drawer');
  const { includeArchivedProjects } = useAppSelector((state) => state.reportingReducer);
  const [searchQuery, setSearchQuery] = useState('');
  const [projectList, setProjectList] = useState<IRPTProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  });

  const fetchOverviewProjects = async () => {
    setIsLoading(true);
    try {
      const params = {
        team_id: teamsId,
        index: pagination.current,
        size: pagination.pageSize,
        field: 'name',
        order: 'asc',
        search: searchQuery,
        filter: 0,
        archived: includeArchivedProjects,
      };
      const response = await reportingApiService.getOverviewProjects(params);
      if (response.done) {
        setProjectList(response.body.projects || []);
        setPagination({ ...pagination, total: response.body.total });
      }
    } catch (error) {
      logger.error('fetchOverviewProjects', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewProjects();
  }, [
    searchQuery,
    includeArchivedProjects,
  ]);

  return (
    <Flex vertical gap={24}>
      <CustomSearchbar
        placeholderText={t('searchByNameInputPlaceholder')}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* <ProjectsReportsTable
        projectList={projectList}
        loading={isLoading}
        pagination={pagination}
        setPagination={setPagination}
      /> */}
    </Flex>
  );
};

export default OverviewReportsProjectsTab;
