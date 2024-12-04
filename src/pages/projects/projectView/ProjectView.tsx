import {
  PushpinFilled,
  PushpinOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';

import {
  Avatar,
  Badge,
  Button,
  ConfigProvider,
  Flex,
  Tabs,
  TabsProps,
  Tooltip,
} from 'antd';
import React, { useEffect, useState } from 'react';

import { colors } from '../../../styles/colors';
import { tabItems } from '../../../lib/project/projectViewConstants';
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from '../../../utils/localStorageFunctions';
import { useSelectedProject } from '../../../hooks/useSelectedProject';
import ProjectMemberDrawer from '../../../features/projects/singleProject/members/ProjectMemberDrawer';
import { useDocumentTitle } from '../../../hooks/useDoumentTItle';
import ProjectViewHeader from './ProjectViewHeader';
import { useLocation, useNavigate } from 'react-router-dom';
import CreateTaskDrawer from '../../../features/tasks/taskCreationAndUpdate/createTaskDrawer/CreateTaskDrawer';
import PhaseDrawer from '../../../features/projects/singleProject/phase/PhaseDrawer';
import StatusDrawer from '../../../features/projects/status/StatusDrawer';
import UpdateTaskDrawer from '../../../features/tasks/taskCreationAndUpdate/updateTaskDrawer/UpdateTaskDrawer';
import { avatarNamesMap } from '../../../shared/constants';
import './ProjectView.css';
import CustomAvatar from '../../../components/CustomAvatar';
import { PageHeader } from '@ant-design/pro-components';

const ProjectView = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // useSelectedProject custom hook returns currently selected project
  const selectedProject = useSelectedProject();

  // document title with useDocument title custom hook
  useDocumentTitle(`${selectedProject?.projectName}`);

  // state to track the active and pinned tab
  const [activeTab, setActiveTab] = useState<string>(
    getFromLocalStorage('pinnedTab') || 'taskList'
  );

  const [pinnedTab, setPinnedTab] = useState<string>(
    getFromLocalStorage('pinnedTab') || ''
  );

  // set query params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tabFromUrl = queryParams.get('tab');
    const pinnedTabFromUrl = queryParams.get('pinned_tab');

    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }

    if (pinnedTabFromUrl && pinnedTabFromUrl !== activeTab) {
      setPinnedTab(pinnedTabFromUrl);
    }
  }, [activeTab, pinnedTab, location.search]);

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
    ...tabItems.map((item) => ({
      key: item.key,
      label: (
        <Flex align="center" style={{ color: colors.skyBlue }}>
          {item.name}{' '}
          {item.isPinShow && (
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
          />
        </div>

        {/* Right-side content */}
        <div>
          <Avatar size="small" style={{ backgroundColor: avatarNamesMap['R'] }}>
            R
          </Avatar>
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
      <UpdateTaskDrawer taskId={'SP-1'} />
    </div>
  );
};

export default ProjectView;
