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
import { Button, Col, Dropdown, Flex, Tag, Tooltip, Typography } from 'antd';
import React, { useState } from 'react';
import ProjectMemberInviteButton from '../../../features/projects/singleProject/members/ProjectMemberInviteButton';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../../styles/colors';
import dayjs from 'dayjs';
import { statusData } from '../../../lib/project/projectConstants';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { toggleCreateTaskDrawer } from '../../../features/tasks/taskSlice';
import { useResponsive } from '../../../hooks/useResponsive';
import { useAppSelector } from '@/hooks/useAppSelector';
import { SocketEvents } from '@/shared/socket-events';
import { useAuthService } from '@/hooks/useAuth';
import { useSocket } from '@/socket/socketContext';
import { setProject } from '@/features/project/project.slice';

const ProjectViewHeader = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const currentSession = useAuthService().getCurrentSession();
  const { socket } = useSocket();

  // useResponsive for media queries
  const { isDesktop } = useResponsive();

  const dispatch = useAppDispatch();

  const selectedProject = useAppSelector(state => state.projectReducer.project);

  // get start and end dates
  const startDate = dayjs(selectedProject?.start_date).format('MMM DD, YYYY');
  const endDate = dayjs(selectedProject?.end_date).format('MMM DD, YYYY');

  // get selected project status data
  const selectedProjectStatus = statusData.find(status => status.value === selectedProject?.status);

  // function for handle refresh
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleSubscribe = () => {
    if (!selectedProject?.id) return;

    dispatch(setProject({ ...selectedProject, subscribed: !selectedProject.subscribed }));

    const body = {
      project_id: selectedProject.id,
      user_id: currentSession?.id,
      team_member_id: currentSession?.team_member_id,
      mode: selectedProject.subscribed ? 1 : 0,
    };

    socket?.emit(SocketEvents.PROJECT_SUBSCRIBERS_CHANGE.toString(), body);
  };

  // create task button items
  const items = [
    {
      key: '1',
      label: (
        <div style={{ width: '100%', margin: 0, padding: 0 }}>
          <ImportOutlined /> Import task
        </div>
      ),
    },
  ];

  return (
    <PageHeader
      className="site-page-header"
      title={
        <Flex gap={8} align="center">
          <ArrowLeftOutlined style={{ fontSize: 16 }} onClick={() => navigate(-1)} />
          <Typography.Title level={4} style={{ marginBlockEnd: 0, marginInlineStart: 12 }}>
            {selectedProject?.name}
          </Typography.Title>

          {/* attributes thats appear only if available  */}
          {selectedProject?.category_id && (
            <Tag
              color={colors.vibrantOrange}
              style={{
                borderRadius: 24,
                paddingInline: 8,
                margin: 0,
              }}
            >
              {selectedProject?.category_name}
            </Tag>
          )}

          {selectedProject?.status && (
            <Tooltip title={selectedProjectStatus?.label}>{selectedProjectStatus?.icon}</Tooltip>
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

          {selectedProject?.notes && (
            <Typography.Text type="secondary">{selectedProject.notes}</Typography.Text>
          )}
        </Flex>
      }
      style={{ paddingInline: 0, marginBlockEnd: 12 }}
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

          <Tooltip title={'Receive a project summary every evening.'} trigger={'hover'}>
            <Button
              shape="round"
              icon={selectedProject?.subscribed ? <BellFilled /> : <BellOutlined />}
              onClick={handleSubscribe}
            >
              {selectedProject?.subscribed ? 'Unsubscribe' : 'Subscribe'}
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
