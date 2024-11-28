import { PushpinFilled, PushpinOutlined } from '@ant-design/icons';

import { Button, ConfigProvider, Flex, Tabs, TabsProps } from 'antd';
import { useEffect, useState } from 'react';

import { colors } from '@/styles/colors';
import { tabItems } from '../../../lib/project/projectViewConstants';
import { getFromLocalStorage, saveToLocalStorage } from '@utils/localStorageFunctions';
import ProjectMemberDrawer from '@features/projects/singleProject/members/ProjectMemberDrawer';
import { useDocumentTitle } from '@/hooks/useDoumentTItle';
import ProjectViewHeader from './ProjectViewHeader';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import PhaseDrawer from '@features/projects/singleProject/phase/PhaseDrawer';
import StatusDrawer from '@features/projects/status/StatusDrawer';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { getProject, setProject, setProjectId } from '@/features/project/project.slice';
import CreateTaskDrawer from '@/features/tasks/taskCreationAndUpdate/createTaskDrawer/CreateTaskDrawer';

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
    if (projectId)
      dispatch(getProject(projectId)).then(res => res.payload && dispatch(setProject(res.payload)));
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
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={tabMenuItems}
        animated={false}
        defaultActiveKey={tabItems[0].key}
        destroyInactiveTabPane={true}
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
      {/* <UpdateTaskDrawer taskId={'SP-1'} /> */}
    </div>
  );
};

export default ProjectView;
