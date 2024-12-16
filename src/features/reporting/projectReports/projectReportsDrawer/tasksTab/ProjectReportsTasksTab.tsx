import { Flex } from 'antd';
import React, { useMemo, useState } from 'react';
import CustomSearchbar from '../../../../../components/CustomSearchbar';
import GroupByFilter from './GroupByFilter';
import ProjectReportsTasksTable from './ProjectReportsTaskTable';
import UpdateTaskDrawer from '../../../../tasks/taskCreationAndUpdate/updateTaskDrawer/UpdateTaskDrawer';
import { fetchData } from '../../../../../utils/fetchData';
import { useTranslation } from 'react-i18next';

type ProjectReportsTasksTabProps = {
  projectId?: string | null;
};

const ProjectReportsTasksTab = ({
  projectId = null,
}: ProjectReportsTasksTabProps) => {
  const [searchQuery, setSearhQuery] = useState<string>('');
  const [activeGroup, setActiveGroup] = useState<
    'status' | 'priority' | 'phase'
  >('status');

  // save each tasks list according to the groups
  const [statusTasks, setStatusTasks] = useState<any[]>([]);
  const [priorityTasks, setPriorityTasks] = useState<any[]>([]);
  const [phaseTasks, setPhaseTasks] = useState<any[]>([]);

  const [activeTasksList, setActiveTasksList] = useState<any[]>(statusTasks);

  // this state for open task drawer
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // localization
  const { t } = useTranslation('reporting-projects-drawer');

  // useMemo for memoizing the fetch functions
  useMemo(() => {
    fetchData(
      '/reportingMockData/projectReports/tasksStatus.json',
      setStatusTasks
    );
  }, []);

  useMemo(() => {
    fetchData(
      '/reportingMockData/projectReports/tasksPriority.json',
      setPriorityTasks
    );
  }, []);

  useMemo(() => {
    fetchData(
      '/reportingMockData/projectReports/tasksPhase.json',
      setPhaseTasks
    );
  }, []);

  // update activeTasksList based on activeGroup
  useMemo(() => {
    if (activeGroup === 'status') {
      setActiveTasksList(statusTasks);
    } else if (activeGroup === 'priority') {
      setActiveTasksList(priorityTasks);
    } else {
      setActiveTasksList(phaseTasks);
    }
  }, [activeGroup, statusTasks, priorityTasks, phaseTasks]);

  console.log(activeGroup);

  return (
    <Flex vertical gap={24}>
      <Flex gap={24} align="center" justify="space-between">
        <CustomSearchbar
          placeholderText={t('searchByNameInputPlaceholder')}
          searchQuery={searchQuery}
          setSearchQuery={setSearhQuery}
        />
        <GroupByFilter setActiveGroup={setActiveGroup} />
      </Flex>

      <Flex vertical gap={12}>
        {activeTasksList &&
          activeTasksList.map((item) => (
            <ProjectReportsTasksTable
              tasksData={item.tasks}
              title={item.name}
              color={item.color_code}
              type={activeGroup}
              setSeletedTaskId={setSelectedTaskId}
            />
          ))}
      </Flex>

      {/* update task drawer  */}
      <UpdateTaskDrawer taskId={selectedTaskId || ''} />
    </Flex>
  );
};

export default ProjectReportsTasksTab;
