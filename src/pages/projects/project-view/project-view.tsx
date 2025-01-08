// Ant Design
import { PushpinFilled, PushpinOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Flex, Tabs, TabsProps } from 'antd';

// React & Router
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

// Redux
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { getProject, setProjectId } from '@/features/project/project.slice';


// Components
import ProjectViewHeader from './project-view-header';
import ProjectViewExtra from './project-view-extra';
import ProjectMemberDrawer from '@features/projects/singleProject/members/ProjectMemberDrawer';
import PhaseDrawer from '@features/projects/singleProject/phase/PhaseDrawer';
import StatusDrawer from '@features/projects/status/StatusDrawer';
import CreateTaskDrawer from '@/features/tasks/taskCreationAndUpdate/createTaskDrawer/CreateTaskDrawer';

// Hooks
import { useDocumentTitle } from '@/hooks/useDoumentTItle';

// Constants & Utils
import { colors } from '@/styles/colors';
import { tabItems } from '@/lib/project/projectViewConstants';
import { getFromLocalStorage, saveToLocalStorage } from '@utils/localStorageFunctions';

// Styles
import './project-view.css';
import { fetchStatuses } from '@/features/taskAttributes/taskStatusSlice';

const ProjectView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [searchParams] = useSearchParams(); // Removed unused setSearchParams
  const { projectId } = useParams();
  if (projectId) dispatch(setProjectId(projectId));

  useDocumentTitle('Project View');

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
    <div style={{ marginBlock: 80, minHeight: '80vh' }}>
      {/* page header for the project view  */}
      <ProjectViewHeader />

      {/* tabs  */}
      <div
        style={{
          display: 'flex',
        }}
      >
        {/* Tabs container */}
        <div style={{ flex: 1, overflow: 'auto', minWidth: '0' }}>
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            items={tabMenuItems}
            animated={false}
            defaultActiveKey={tabItems[0].key}
            destroyInactiveTabPane={true}
          />
        </div>

        {/* Right-side content */}
        <ProjectViewExtra />
      </div>
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
      {/* <UpdateTaskDrawer taskId={'SP-1'} /> */}
    </div>
  );
};

export default ProjectView;
