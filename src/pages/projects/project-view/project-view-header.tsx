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
import { useState } from 'react';
import ProjectMemberInviteButton from '@features/projects/singleProject/members/ProjectMemberInviteButton';
import { useNavigate } from 'react-router-dom';
import { colors } from '@/styles/colors';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { toggleTaskDrawer } from '@features/tasks/tasks.slice';
import { useAppSelector } from '@/hooks/useAppSelector';
import { getStatusIcon } from '@/utils/projectUtils';
import { useAuthService } from '@/hooks/useAuth';
import { useSocket } from '@/socket/socketContext';
import { SocketEvents } from '@/shared/socket-events';

const ProjectViewHeader = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const selectedProject = useAppSelector(state => state.projectReducer.project);
  const currentSession = useAuthService().getCurrentSession();
  const { socket, connected } = useSocket();

  // function for handle refresh
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const navigateBack = () => {
    navigate('/worklenz/projects');
  };

  const handleSubscribe = () => {
    console.log(selectedProject?.id);
    if (!selectedProject?.id) return;

    selectedProject.subscribed = !selectedProject.subscribed;
    const body = {
      project_id: selectedProject.id,
      user_id: currentSession?.id,
      team_member_id: currentSession?.team_member_id,
      mode: selectedProject.subscribed ? 0 : 1,
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
          <ArrowLeftOutlined style={{ fontSize: 16 }} onClick={() => navigateBack()} />
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
              {selectedProject?.category_name?.toString()}
            </Tag>
          )}

          {selectedProject?.status && (
            <Tooltip title={selectedProject?.status}>
              {selectedProject.status_icon &&
                selectedProject.status_color &&
                getStatusIcon(selectedProject.status_icon, selectedProject.status_color)}
            </Tooltip>
          )}

          {(selectedProject?.start_date || selectedProject?.end_date) && (
            <Tooltip
              title={
                <Typography.Text style={{ color: colors.white }}>
                  {selectedProject?.start_date && `Start date: ${selectedProject?.start_date}`}
                  <br />
                  {selectedProject?.end_date && `End date: ${selectedProject?.end_date}`}
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
            <Typography.Text style={{ color: colors.lightGray }}>
              {selectedProject.notes}
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
            onClick={() => dispatch(toggleTaskDrawer())}
          >
            <EditOutlined /> Create Task
          </Dropdown.Button>
        </Flex>
      }
    />
  );
};

export default ProjectViewHeader;
