import { Flex } from 'antd';
import CustomSearchbar from '@/components/CustomSearchbar';
import { useTranslation } from 'react-i18next';
import ProjectsReportsTable from '@/pages/reporting/projects-reports/projects-reports-table/projects-reports-table';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setSearchQuery } from '@/features/reporting/projectReports/project-reports-slice';

interface OverviewReportsProjectsTabProps {
  teamsId?: string | null;
}

const OverviewReportsProjectsTab = ({ teamsId = null }: OverviewReportsProjectsTabProps) => {
  const { t } = useTranslation('reporting-projects-drawer');
  const dispatch = useAppDispatch();

  const { searchQuery } = useAppSelector(state => state.projectReportsReducer);

  return (
    <Flex vertical gap={24}>
      <CustomSearchbar
        placeholderText={t('searchByNameInputPlaceholder')}
        searchQuery={searchQuery}
        setSearchQuery={text => dispatch(setSearchQuery(text))}
      />

      <ProjectsReportsTable />
    </Flex>
  );
};

export default OverviewReportsProjectsTab;
