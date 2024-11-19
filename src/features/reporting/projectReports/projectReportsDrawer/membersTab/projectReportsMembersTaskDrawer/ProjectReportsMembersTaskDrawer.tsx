import { Drawer, Typography, Flex, Button } from 'antd';
import React, { useMemo, useState } from 'react';
import { BankOutlined, DownOutlined } from '@ant-design/icons';
import { useAppDispatch } from '../../../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../../../hooks/useAppSelector';
import { toggleProjectReportsMembersTaskDrawer } from '../../../projectReportsSlice';
import { colors } from '../../../../../../styles/colors';
import ProjectReportsMembersTasksTable from './ProjectReportsMembersTaskTable';
import CustomSearchbar from '../../../../../../components/CustomSearchbar';
import UpdateTaskDrawer from '../../../../../tasks/taskCreationAndUpdate/updateTaskDrawer/UpdateTaskDrawer';
import { fetchData } from '../../../../../../utils/fetchData';

const ProjectReportsMembersTaskDrawer = () => {
  const [taskData, setTaskData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // this state for open task drawer
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

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
            <BankOutlined style={{ color: colors.lightGray }} />
            <Typography.Text>/</Typography.Text>
            <Typography.Text>Kavindu Mihiranga</Typography.Text>
          </Flex>

          <Button type="primary" icon={<DownOutlined />} iconPosition="end">
            Export
          </Button>
        </Flex>
      }
    >
      <Flex vertical gap={24}>
        <CustomSearchbar
          placeholderText="Search by name"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <ProjectReportsMembersTasksTable
          tasksData={filteredTaskData}
          setSeletedTaskId={setSelectedTaskId}
        />
      </Flex>

      {/* update task drawer  */}
      <UpdateTaskDrawer taskId={selectedTaskId || ''} />
    </Drawer>
  );
};

export default ProjectReportsMembersTaskDrawer;
