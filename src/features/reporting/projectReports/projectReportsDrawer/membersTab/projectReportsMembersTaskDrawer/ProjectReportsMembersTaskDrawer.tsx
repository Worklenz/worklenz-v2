import { Drawer, Typography, Flex, Button } from 'antd';
import React, { useMemo, useState } from 'react';
import { FileOutlined } from '@ant-design/icons';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { toggleProjectReportsMembersTaskDrawer } from '../../../projectReportsSlice';
import { colors } from '@/styles/colors';
import ProjectReportsMembersTasksTable from './ProjectReportsMembersTaskTable';
import CustomSearchbar from '@/components/CustomSearchbar';
import { fetchData } from '@/utils/fetchData';
import { useTranslation } from 'react-i18next';
import TaskDrawer from '@/components/task-drawer/task-drawer';

const ProjectReportsMembersTaskDrawer = () => {
  const [taskData, setTaskData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // this state for open task drawer
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // localization
  const { t } = useTranslation('reporting-projects-drawer');

  const dispatch = useAppDispatch();

  // get drawer open state and project list from the reducer
  const isDrawerOpen = useAppSelector(
    (state) => state.projectReportsReducer.isProjectReportsMembersTaskDrawerOpen
  );

  // function to handle drawer close
  const handleClose = () => {
    dispatch(toggleProjectReportsMembersTaskDrawer());
  };

  //   get task data from mock json file in public/reporingMockData/projectRepoting
  useMemo(() => {
    fetchData(
      '/reportingMockData/projectReports/memberTasks.json',
      setTaskData
    );
  }, []);

  // used useMemo hook for re render the list when searching
  const filteredTaskData = useMemo(() => {
    return taskData.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, taskData]);

  return (
    <Drawer
      open={isDrawerOpen}
      onClose={handleClose}
      width={900}
      title={
        <Flex align="center" justify="space-between">
          <Flex gap={8} align="center" style={{ fontWeight: 500 }}>
            <FileOutlined style={{ color: colors.lightGray }} />
            <Typography.Text>/</Typography.Text>
            <Typography.Text>Kavindu Mihiranga</Typography.Text>
          </Flex>

          <Button type="primary">{t('exportButton')}</Button>
        </Flex>
      }
    >
      <Flex vertical gap={24}>
        <CustomSearchbar
          placeholderText={t('searchByNameInputPlaceholder')}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <ProjectReportsMembersTasksTable
          tasksData={filteredTaskData}
          setSeletedTaskId={setSelectedTaskId}
        />
      </Flex>

      {/* update task drawer  */}
      <TaskDrawer />
    </Drawer>
  );
};

export default ProjectReportsMembersTaskDrawer;
