import React, { useEffect, useState } from 'react';
import { PushpinFilled, PushpinOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Badge, Button, ConfigProvider, Flex, Tabs, TabsProps, Tooltip } from 'antd';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { getProject, setProjectId } from '@/features/project/project.slice';
import { fetchStatuses } from '@/features/taskAttributes/taskStatusSlice';
import { projectsApiService } from '@/api/projects/projects.api.service';
import { colors } from '@/styles/colors';
import { tabItems } from '@/lib/project/projectViewConstants';
import { useDocumentTitle } from '@/hooks/useDoumentTItle';
import ProjectViewHeader from './project-view-header';
import './project-view.css';

const PhaseDrawer = React.lazy(() => import('@features/projects/singleProject/phase/PhaseDrawer'));
const StatusDrawer = React.lazy(
  () => import('@/components/project-task-filters/create-status-drawer/create-status-drawer')
);
const ProjectMemberDrawer = React.lazy(
  () => import('@features/projects/singleProject/members/ProjectMemberDrawer')
);
const TaskDrawer = React.lazy(() => import('@components/task-drawer/task-drawer'));

const ProjectView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { projectId } = useParams();

  const selectedProject = useAppSelector(state => state.projectReducer.project);
  useDocumentTitle(selectedProject?.name || 'Project View');

  const [activeTab, setActiveTab] = useState<string>(searchParams.get('tab') || tabItems[0].key);
  const [pinnedTab, setPinnedTab] = useState<string>(searchParams.get('pinned_tab') || '');

  useEffect(() => {
    if (projectId) {
      dispatch(setProjectId(projectId));
      dispatch(getProject(projectId)).then((res: any) => {
        if (!res.payload) {
          navigate('/worklenz/projects');
          return;
        }
        dispatch(fetchStatuses(projectId));
      });
    }
  }, [dispatch, navigate, projectId]);

  const pinToDefaultTab = async (itemKey: string) => {
    if (!itemKey || !projectId) return;

    const defaultView = itemKey === 'tasks-list' ? 'TASK_LIST' : 'BOARD';
    const res = await projectsApiService.updateDefaultTab({
      project_id: projectId,
      default_view: defaultView,
    });

    if (res.done) {
      setPinnedTab(itemKey);
      tabItems.forEach(item => {
        item.isPinned = item.key === itemKey;
      });

      navigate({
        pathname: `/worklenz/projects/${projectId}`,
        search: new URLSearchParams({ pinned_tab: itemKey }).toString()
      });
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    navigate({
      pathname: location.pathname,
      search: new URLSearchParams({ 
        tab: key,
        pinned_tab: pinnedTab 
      }).toString()
    });
  };

  const tabMenuItems = tabItems.map(item => ({
    key: item.key,
    label: (
      <Flex align="center" style={{ color: colors.skyBlue }}>
        {item.label}
        {item.isPinned && (
          <ConfigProvider wave={{ disabled: true }}>
            <Button
              className="borderless-icon-btn"
              style={{
                backgroundColor: colors.transparent,
                boxShadow: 'none',
              }}
              icon={
                pinnedTab === item.key ? (
                  <PushpinFilled
                    size={20}
                    style={{
                      color: colors.skyBlue,
                      rotate: '-45deg',
                      transition: 'transform ease-in 300ms',
                    }}
                  />
                ) : (
                  <PushpinOutlined
                    size={20}
                    style={{
                      color: colors.skyBlue,
                    }}
                  />
                )
              }
              onClick={() => pinToDefaultTab(item.key)}
            />
          </ConfigProvider>
        )}
      </Flex>
    ),
    children: item.element,
  }));

  return (
    <div style={{ marginBlockStart: 80, marginBlockEnd: 24, minHeight: '80vh' }}>
      <ProjectViewHeader />

      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={tabMenuItems}
        tabBarStyle={{ paddingInline: 0 }}
        tabBarExtraContent={
          <div>
            <span style={{ position: 'relative', top: '-10px' }}>
              <Tooltip title="Members who are active on this project will be displayed here.">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
            <span
              style={{
                position: 'relative',
                right: '20px',
                top: '10px',
              }}
            >
              <Badge status="success" dot className="profile-badge" />
            </span>
          </div>
        }
      />

      <ProjectMemberDrawer />
      <PhaseDrawer />
      <StatusDrawer />
      <TaskDrawer />
    </div>
  );
};

export default ProjectView;
