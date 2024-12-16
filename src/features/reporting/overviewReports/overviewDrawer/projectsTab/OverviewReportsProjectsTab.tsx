import { Flex, Skeleton } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import CustomSearchbar from '@components/CustomSearchbar';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchProjectData } from '../../../projectReports/projectReportsSlice';
import ProjectsReportsTable from '@/pages/reporting/projectsReports/projectsReportsTable/projects-reports-table';

type OverviewReportsProjectsTabProps = { teamsId?: string | null };

const OverviewReportsProjectsTab = ({
  teamsId = null,
}: OverviewReportsProjectsTabProps) => {
  const [searchQuery, setSearhQuery] = useState<string>('');

  // localization
  const { t } = useTranslation('reporting-projects-drawer');

  const dispatch = useAppDispatch();

  // get project list and loading state from project repors reducer
  const { projectList, isLoading } = useAppSelector(
    (state) => state.projectReportsReducer
  );

  // load data from project reports reducer
  useEffect(() => {
    dispatch(fetchProjectData());
  }, [dispatch]);

  // used useMemo hook for re render the list when searching
  const filteredProjectsData = useMemo(() => {
    return projectList.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, projectList]);

  return (
    <Flex vertical gap={24}>
      <CustomSearchbar
        placeholderText={t('searchByNameInputPlaceholder')}
        searchQuery={searchQuery}
        setSearchQuery={setSearhQuery}
      />

      {isLoading ? (
        <Skeleton />
      ) : (
        <ProjectsReportsTable projectList={filteredProjectsData} />
      )}
    </Flex>
  );
};

export default OverviewReportsProjectsTab;
