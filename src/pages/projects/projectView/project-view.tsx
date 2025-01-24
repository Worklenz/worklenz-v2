import { PushpinFilled, PushpinOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import { Badge, Button, ConfigProvider, Flex, Tabs, TabsProps, Tooltip } from 'antd';
import { useEffect, useState } from 'react';

import { colors } from '@/styles/colors';
import { tabItems } from '@/lib/project/projectViewConstants';
import { getFromLocalStorage, saveToLocalStorage } from '@/utils/localStorageFunctions';
import ProjectMemberDrawer from '@/features/projects/singleProject/members/ProjectMemberDrawer';
import { useDocumentTitle } from '@/hooks/useDoumentTItle';
import ProjectViewHeader from './project-view-header';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import CreateTaskDrawer from '@/features/tasks/taskCreationAndUpdate/createTaskDrawer/CreateTaskDrawer';
import PhaseDrawer from '@/features/projects/singleProject/phase/PhaseDrawer';
import StatusDrawer from '@/features/projects/status/StatusDrawer';
import UpdateTaskDrawer from '@/features/tasks/taskCreationAndUpdate/updateTaskDrawer/UpdateTaskDrawer';
import './project-view.css';
import CustomAvatar from '@/components/CustomAvatar';
import { useResponsive } from '@/hooks/useResponsive';
import { getProject, setProjectId } from '@/features/project/project.slice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchStatuses } from '@/features/taskAttributes/taskStatusSlice';
import { useAppSelector } from '@/hooks/useAppSelector';

const ProjectView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [searchParams] = useSearchParams();
  const { projectId } = useParams();
  if (projectId) dispatch(setProjectId(projectId));
  
  // useResponsive custom hook
  const { isDesktop } = useResponsive();

  const selectedProject = useAppSelector(state => state.projectReducer.project);
  useDocumentTitle(`${selectedProject?.name}`);

  const [activeTab, setActiveTab] = useState<string>(searchParams.get('tab') || tabItems[0].key);
  const [pinnedTab, setPinnedTab] = useState<string>(searchParams.get('pinned_tab') || '');

  // set query params
  useEffect(() => {
    if (activeTab) setActiveTab(activeTab);
    if (pinnedTab) setPinnedTab(pinnedTab);
    if (projectId) {
      dispatch(getProject(projectId)).then((res: any) => {
        if (!res.payload) navigate('/worklenz/projects');

        dispatch(fetchStatuses(projectId));
      });
    }
  }, [activeTab, pinnedTab, location.search, projectId]);

  // function for pin a tab and update url
  const pinToDefaultTab = (itemKey: string) => {
    setPinnedTab(itemKey);

    saveToLocalStorage('pinnedTab', itemKey);
    navigate(`${location.pathname}?tab=${activeTab}&pinned_tab=${itemKey}`);
  };

  // function to handle tab change
  const handleTabChange = (key: string) => {
    setActiveTab(key);

    navigate(`${location.pathname}?tab=${key}&pinned_tab=${pinnedTab}`);
  };

  type TabItem = Required<TabsProps>['items'][number];

  const tabMenuItems: TabItem[] = [
    ...tabItems.map(item => ({
      key: item.key,
      label: (
        <Flex align="center" style={{ color: colors.skyBlue }}>
          {item.label}{' '}
          {item.isPinned && (
            <ConfigProvider wave={{ disabled: true }}>
              <Button
                className="borderless-icon-btn"
                style={{
                  backgroundColor: colors.transparent,
                  boxShadow: 'none',
                }}
                icon={
                  getFromLocalStorage('pinnedTab') === item.key ? (
                    <PushpinFilled
                      style={{
                        color: colors.skyBlue,
                        rotate: '-45deg',
                        transition: 'transform ease-in 300ms',
                      }}
                    />
                  ) : (
                    <PushpinOutlined
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
    })),
  ];

  return (
    <div style={{ marginBlockStart: 80, marginBlockEnd: 24, minHeight: '80vh' }}>
      {/* page header for the project view  */}
      <ProjectViewHeader />

      {/* tabs for the project view  */}
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={tabMenuItems}
        tabBarStyle={{ paddingInline: 0 }}
        tabBarExtraContent={
          <div>
            <CustomAvatar avatarName={'Raveesha dilanka'} size={26} />
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

      {/* drawers  */}
      {/* add project members drawer */}
      <ProjectMemberDrawer />
      {/* create task drawer  */}
      <CreateTaskDrawer />
      {/* phase drawer  */}
      <PhaseDrawer />
      {/* status drawer  */}
      <StatusDrawer />
      {/* update task drawer  */}
      <UpdateTaskDrawer taskId={'SP-1'} />
    </div>
  );
};

export default ProjectView;
