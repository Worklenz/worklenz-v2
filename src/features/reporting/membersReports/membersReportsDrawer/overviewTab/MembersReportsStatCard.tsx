import {
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';
import { Button, Card, Flex } from 'antd';
import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import {
  setMemberReportingDrawerActiveTab,
  toggleMembersOverviewTasksStatsDrawer,
  toggleMembersOverviewProjectsStatsDrawer,
} from '../../membersReportsSlice';
import { useAppSelector } from '../../../../../hooks/useAppSelector';

const MembersReportsStatCard = () => {
  // localization
  const { t } = useTranslation('reporting-members-drawer');

  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(state => state.themeReducer.mode);

  // function to handle members overview tasks stat drawer open
  const handleMembersOverviewTasksStatsDrawerToggle = () => {
    dispatch(toggleMembersOverviewTasksStatsDrawer());
  };

  // function to handle members overview projects stat drawer open
  const handleMembersOverviewProjectsStatsDrawerToggle = () => {
    dispatch(toggleMembersOverviewProjectsStatsDrawer());
  };

  // fuction to handle tab change
  const handleNavigateTimeLogsTab = () => {
    dispatch(setMemberReportingDrawerActiveTab('timeLogs'));
  };

  type StatItemsType = {
    name: string;
    icon: ReactNode;
    value: string;
    onClick: () => void;
  };

  // stat items array
  const statItems: StatItemsType[] = [
    {
      name: 'projects',
      icon: <FileExcelOutlined style={{ fontSize: 24, color: '#f6ce69' }} />,
      value: '4',
      onClick: handleMembersOverviewProjectsStatsDrawerToggle,
    },
    {
      name: 'totalTasks',
      icon: <ExclamationCircleOutlined style={{ fontSize: 24, color: '#70eded' }} />,
      value: '20',
      onClick: handleMembersOverviewTasksStatsDrawerToggle,
    },
    {
      name: 'assignedTasks',
      icon: <ExclamationCircleOutlined style={{ fontSize: 24, color: '#7590c9' }} />,
      value: '0',
      onClick: handleMembersOverviewTasksStatsDrawerToggle,
    },
    {
      name: 'completedTasks',
      icon: <ExclamationCircleOutlined style={{ fontSize: 24, color: '#75c997' }} />,
      value: '0',
      onClick: handleMembersOverviewTasksStatsDrawerToggle,
    },
    {
      name: 'ongoingTasks',
      icon: <ExclamationCircleOutlined style={{ fontSize: 24, color: '#7cb5ec' }} />,
      value: '0',
      onClick: handleMembersOverviewTasksStatsDrawerToggle,
    },
    {
      name: 'overdueTasks',
      icon: <ExclamationCircleOutlined style={{ fontSize: 24, color: '#eb6363' }} />,
      value: '4',
      onClick: handleMembersOverviewTasksStatsDrawerToggle,
    },
    {
      name: 'loggedHours',
      icon: <ClockCircleOutlined style={{ fontSize: 24, color: '#75c997' }} />,
      value: '0h 0m',
      onClick: handleNavigateTimeLogsTab,
    },
  ];

  return (
    <Card style={{ width: '100%' }}>
      <Flex vertical gap={16} style={{ padding: '12px 24px' }}>
        {statItems.map(item => (
          <Flex gap={12} align="center">
            {item.icon}
            <Button
              type="link"
              onClick={item.onClick}
              className={
                themeMode === 'dark'
                  ? 'text-[#ffffffd9] hover:text-[#1890FF]'
                  : 'text-[#181818] hover:text-[#1890ff]'
              }
            >
              {item.value} {t(`${item.name}Text`)}
            </Button>
          </Flex>
        ))}
      </Flex>
    </Card>
  );
};

export default MembersReportsStatCard;
