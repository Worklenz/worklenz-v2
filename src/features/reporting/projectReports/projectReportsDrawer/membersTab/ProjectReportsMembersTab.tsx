import { Flex } from 'antd';
import React, { useMemo, useState } from 'react';
import CustomSearchbar from '../../../../../components/CustomSearchbar';
import ProjectReportsMembersTable from './ProjectReportsMembersTable';
import ProjectReportsMembersTaskDrawer from './projectReportsMembersTaskDrawer/ProjectReportsMembersTaskDrawer';
import { useTranslation } from 'react-i18next';

type ProjectReportsMembersTabProps = {
  projectId?: string | null;
};

const ProjectReportsMembersTab = ({
  projectId = null,
}: ProjectReportsMembersTabProps) => {
  const [searchQuery, setSearhQuery] = useState<string>('');

  // localization
  const { t } = useTranslation('reporting-projects-drawer');

  // mock data from the original site payload
  type TeamMemberTaskStats = {
    id: string;
    team_member_id: string;
    name: string;
    tasks_count: number;
    completed: number;
    incompleted: number;
    overdue: number;
    time_logged: string;
    contribution: number;
    progress: number;
  };

  const teamMembersData: TeamMemberTaskStats[] = useMemo(
    () => [
      {
        id: 'f1c692f9-1358-4b27-b662-5bbbf3bfe1d3',
        team_member_id: '4001900e-817f-46a3-a620-f9a7a0b68ffe',
        name: 'gafefal534',
        tasks_count: 1,
        completed: 1,
        incompleted: 0,
        overdue: 0,
        time_logged: '0h 0m',
        contribution: 17,
        progress: 100,
      },
      {
        id: 'e338c638-164a-4f1e-a6fa-6031912a0be8',
        team_member_id: '494afd53-79e6-4d06-ac42-5a4afcc78661',
        name: 'Kavindu Mihiranga',
        tasks_count: 5,
        completed: 2,
        incompleted: 3,
        overdue: 0,
        time_logged: '0h 0m',
        contribution: 83,
        progress: 40,
      },
    ],
    []
  );

  // used useMemo hook for re render the list when searching
  const filteredMembersData = useMemo(() => {
    return teamMembersData.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, teamMembersData]);

  return (
    <Flex vertical gap={24}>
      <CustomSearchbar
        placeholderText={t('searchByNameInputPlaceholder')}
        searchQuery={searchQuery}
        setSearchQuery={setSearhQuery}
      />

      <ProjectReportsMembersTable membersData={filteredMembersData} />

      {/* member task drawer  */}
      <ProjectReportsMembersTaskDrawer />
    </Flex>
  );
};

export default ProjectReportsMembersTab;
