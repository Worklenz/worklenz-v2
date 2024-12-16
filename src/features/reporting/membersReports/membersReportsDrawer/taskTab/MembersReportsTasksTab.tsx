import { Flex } from 'antd';
import React, { useMemo, useState } from 'react';
import CustomSearchbar from '../../../../../components/CustomSearchbar';
import { fetchData } from '../../../../../utils/fetchData';
import UpdateTaskDrawer from '../../../../tasks/taskCreationAndUpdate/updateTaskDrawer/UpdateTaskDrawer';
import MembersReportsTasksTable from './MembersReportsTasksTable';
import ProjectFilter from './ProjectFilter';
import { useTranslation } from 'react-i18next';

type MembersReportsTasksTabProps = {
  memberId: string | null;
};

const MembersReportsTasksTab = ({ memberId }: MembersReportsTasksTabProps) => {
  const [searchQuery, setSearhQuery] = useState<string>('');

  //   save task list
  const [tasksList, setTasksList] = useState<any[]>([]);

  // this state for open task drawer
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // localization
  const { t } = useTranslation('reporting-members-drawer');

  // useMemo for memoizing the fetch functions
  useMemo(() => {
    fetchData('/reportingMockData/membersReports/tasksList.json', setTasksList);
  }, []);

  // project list
  const projectsList = tasksList.map((task) => ({
    projectId: task.project_id as string,
    project: task.project_name as string,
  }));

  const uniqueProjects = Array.from(
    new Map(
      projectsList.map((project) => [project.projectId, project])
    ).values()
  );

  return (
    <Flex vertical gap={24}>
      <Flex gap={24} align="center" justify="space-between">
        <CustomSearchbar
          placeholderText={t('searchByNameInputPlaceholder')}
          searchQuery={searchQuery}
          setSearchQuery={setSearhQuery}
        />

        <ProjectFilter projectList={uniqueProjects} />
      </Flex>

      <MembersReportsTasksTable
        tasksData={tasksList}
        setSelectedTaskId={setSelectedTaskId}
      />

      {/* update task drawer  */}
      <UpdateTaskDrawer taskId={selectedTaskId || ''} />
    </Flex>
  );
};

export default MembersReportsTasksTab;
