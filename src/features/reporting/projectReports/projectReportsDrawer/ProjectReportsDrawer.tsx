import { Drawer, Typography, Flex, Button, Dropdown } from 'antd';
import React from 'react';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { toggleProjectReportsDrawer } from '../projectReportsSlice';
import { BankOutlined, DownOutlined } from '@ant-design/icons';
import ProjectReportsDrawerTabs from './ProjectReportsDrawerTabs';
import { colors } from '../../../../styles/colors';
import { useTranslation } from 'react-i18next';

type ProjectReportsDrawerProps = {
  projectId: string | null;
};

const ProjectReportsDrawer = ({ projectId }: ProjectReportsDrawerProps) => {
  // localization
  const { t } = useTranslation('reporting-projects-drawer');

  const dispatch = useAppDispatch();

  // get drawer open state and project list from the reducer
  const isDrawerOpen = useAppSelector(
    (state) => state.projectReportsReducer.isProjectReportsDrawerOpen
  );
  const { projectList } = useAppSelector(
    (state) => state.projectReportsReducer
  );

  // find the selected project based on projectId
  const selectedProject = projectList.find(
    (project) => project.id === projectId
  );

  // function to handle drawer close
  const handleClose = () => {
    dispatch(toggleProjectReportsDrawer());
  };

  return (
    <Drawer
      open={isDrawerOpen}
      onClose={handleClose}
      width={900}
      title={
        selectedProject && (
          <Flex align="center" justify="space-between">
            <Flex gap={8} align="center" style={{ fontWeight: 500 }}>
              <BankOutlined style={{ color: colors.lightGray }} />
              <Typography.Text>/</Typography.Text>
              <Typography.Text>{selectedProject.name}</Typography.Text>
            </Flex>

            <Dropdown
              menu={{
                items: [
                  { key: '1', label: t('membersButton') },
                  { key: '2', label: t('tasksButton') },
                ],
              }}
            >
              <Button type="primary" icon={<DownOutlined />} iconPosition="end">
                {t('exportButton')}
              </Button>
            </Dropdown>
          </Flex>
        )
      }
    >
      {selectedProject && (
        <ProjectReportsDrawerTabs projectId={selectedProject.id} />
      )}
    </Drawer>
  );
};

export default ProjectReportsDrawer;
