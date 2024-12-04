import {
  ArrowLeftOutlined,
  BellFilled,
  BellOutlined,
  CalendarOutlined,
  DownOutlined,
  EditOutlined,
  ImportOutlined,
  SaveOutlined,
  SettingOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-components';
import { Button, Dropdown, Flex, Tag, Tooltip, Typography } from 'antd';
import React, { useState } from 'react';
import ProjectMemberInviteButton from '../../../features/projects/singleProject/members/ProjectMemberInviteButton';
import { useNavigate } from 'react-router-dom';
import { useSelectedProject } from '../../../hooks/useSelectedProject';
import { colors } from '../../../styles/colors';
import dayjs from 'dayjs';
import { statusData } from '../../../lib/project/projectConstants';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { toggleCreateTaskDrawer } from '../../../features/tasks/taskSlice';

const ProjectViewHeader = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const [isSubcribe, setIsSubcribe] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  // useSelectedProject custom hook returns currently selected project
  const selectedProject = useSelectedProject();

  // get start and end dates
  const startDate = dayjs(selectedProject?.projectStartDate).format(
    'MMM DD, YYYY'
  );
  const endDate = dayjs(selectedProject?.projectEndDate).format('MMM DD, YYYY');

  // get selected project status data
  const selectedProjectStatus = statusData.find(
    (status) => status.value === selectedProject?.projectStatus
  );

  // function for handle refresh
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  // create task button items
  const items = [
    {
      key: '1',
      label: (
        <div style={{ width: '100%', margin: 0, padding: 0 }}><ImportOutlined/> Import task</div>
      ),
    },
  ];

  return (
    <PageHeader
      className="site-page-header"
      title={
        <Flex gap={8} align="center">
          <ArrowLeftOutlined
            style={{ fontSize: 16 }}
            onClick={() => navigate(-1)}
          />
          <Typography.Title
            level={4}
            style={{ marginBlockEnd: 0, marginInlineStart: 12 }}
          >
            {selectedProject?.projectName}
          </Typography.Title>

          {/* attributes thats appear only if available  */}
          {selectedProject?.projectCategory && (
            <Tag
              color={colors.vibrantOrange}
              style={{
                borderRadius: 24,
                paddingInline: 8,
                margin: 0,
              }}
            >
              {selectedProject?.projectCategory.toString()}
            </Tag>
          )}

          {selectedProject?.projectStatus && (
            <Tooltip title={selectedProjectStatus?.label}>
              {selectedProjectStatus?.icon}
            </Tooltip>
          )}

          {(startDate || endDate) && (
            <Tooltip
              title={
                <Typography.Text style={{ color: colors.white }}>
                  {startDate && `Start date: ${startDate}`}
                  <br />
                  {endDate && `End date: ${endDate}`}
                </Typography.Text>
              }
            >
              <CalendarOutlined
                style={{
                  fontSize: 16,
                }}
              />
            </Tooltip>
          )}

          {selectedProject?.projectNotes && (
            <Typography.Text type="secondary">
              {selectedProject.projectNotes}
            </Typography.Text>
          )}
        </Flex>
      }
      style={{ padding: 0, marginBlockEnd: 24 }}
      extra={
        <Flex gap={8} align="center">
          <Tooltip title={'Refresh project'} trigger={'hover'}>
            <Button
              shape="circle"
              icon={<SyncOutlined spin={isLoading} />}
              onClick={() => handleRefresh()}
            />
          </Tooltip>

          <Tooltip title={'Save as template'} trigger={'hover'}>
            <Button shape="circle" icon={<SaveOutlined />} />
          </Tooltip>

          <Tooltip title={'Project settings'} trigger={'hover'}>
            <Button shape="circle" icon={<SettingOutlined />} />
          </Tooltip>

          <Tooltip
            title={'Receive a project summary every evening.'}
            trigger={'hover'}
          >
            <Button shape="round" icon={isSubcribe ? <BellFilled /> : <BellOutlined />} onClick={() => setIsSubcribe(!isSubcribe)}>
              {isSubcribe ? 'Unsubscribe' : 'Subscribe'}
            </Button>
          </Tooltip>

          <ProjectMemberInviteButton />

          <Dropdown.Button
            type="primary"
            icon={<DownOutlined />}
            menu={{ items }}
            onClick={() => dispatch(toggleCreateTaskDrawer())}
          >
            <EditOutlined /> Create Task
          </Dropdown.Button>
        </Flex>
      }
    />
  );
};

export default ProjectViewHeader;
