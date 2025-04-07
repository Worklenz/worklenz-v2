import { Badge, Button, Flex, Tooltip, Tag, Typography, Spin, Empty } from 'antd';
import React, { useCallback, useMemo, CSSProperties } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import CustomAvatar from '../../CustomAvatar';
import { fetchMemberProjects, toggleScheduleDrawer } from '../../../features/schedule/scheduleSlice';
import { CaretDownOutlined, CaretRightFilled, CalendarOutlined, UserOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/hooks/useAppDispatch';

const { Text, Title } = Typography;

// Project colors for better visual distinction
const PROJECT_COLORS = [
  'magenta', 'red', 'volcano', 'orange', 'gold', 
  'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'
];

type GranttChartMembersTabelProps = {
  members: any[];
  expandedProject: string | null;
  setExpandedProject: (id: string | null) => void;
  membersScrollRef: any;
  syncVerticalScroll: (source: 'timeline' | 'members') => void;
};

const GranttMembersTable = React.memo(
  ({
    members,
    expandedProject,
    setExpandedProject,
    membersScrollRef,
    syncVerticalScroll,
  }: GranttChartMembersTabelProps) => {
    // localization
    const { t } = useTranslation('schedule');

    // get theme details
    const themeMode = useAppSelector(state => state.themeReducer.mode);
    const { loading } = useAppSelector(state => state.scheduleReducer);

    const dispatch = useAppDispatch();

    const handleToggleDrawer = useCallback(() => {
      dispatch(toggleScheduleDrawer());
    }, [dispatch]);

    const handleToggleProject = useCallback(
      (id: string) => {
        // Only fetch projects when expanding a row
        if (expandedProject !== id) {
          dispatch(fetchMemberProjects({ id }));
        }
        setExpandedProject(expandedProject === id ? null : id);
      },
      [expandedProject, setExpandedProject, dispatch]
    );

    // Get a random color for a project based on project id
    const getProjectColor = useCallback((id: string) => {
      const sum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return PROJECT_COLORS[sum % PROJECT_COLORS.length];
    }, []);

    // Check if member has active projects
    const getMemberProjectsCount = useCallback((member: any) => {
      if (!member.projects || !Array.isArray(member.projects)) return 0;
      return member.projects.length;
    }, []);

    // Fixed header styles
    const tableHeaderStyles: CSSProperties = {
      position: 'sticky',
      top: 0,
      left: 0,
      zIndex: 100,
      padding: '12px 16px',
      height: 60, 
      fontWeight: 'bold',
      backgroundColor: themeMode === 'dark' ? '#1f1f1f' : '#f5f5f5',
      borderBottom: themeMode === 'dark' ? '1px solid #303030' : '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    };

    return (
      <Flex
        vertical
        style={{
          width: 370,
          marginBlockStart: 0, // Remove top margin
          borderTop: themeMode === 'dark' ? '1px solid #303030' : '1px solid #e5e7eb',
          borderRight: themeMode === 'dark' ? '1px solid #303030' : '1px solid #e5e7eb',
          backgroundColor: themeMode === 'dark' ? '#141414' : '#fff',
        }}
      >
        {/* Team Members Header */}
        <div style={tableHeaderStyles}>
          <Text strong style={{ fontSize: '14px' }}>
            <UserOutlined style={{ marginRight: 8 }} />
            {t('teamMembers')}
          </Text>
          <Text type="secondary">{members?.length || 0} {t('members')}</Text>
        </div>

        <Flex
          vertical
          ref={membersScrollRef}
          onScroll={() => syncVerticalScroll('members')}
          style={{
            maxHeight: 'calc(100vh - 278px)',
            overflow: 'auto',
          }}
        >
          {members.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={t('noTeamMembers')}
              style={{ margin: '40px 0' }}
            />
          ) : (
            members.map(member => (
              <Flex 
                vertical 
                key={member.id}
                style={{
                  borderBottom: themeMode === 'dark' ? '1px solid #303030' : '1px solid #f0f0f0',
                }}
              >
                <Flex
                  gap={8}
                  align="center"
                  justify="space-between"
                  style={{
                    paddingInline: 16,
                    height: 90, // Ensure each member row is exactly 90px high to match the Gantt chart rows
                    backgroundColor: expandedProject === member.id 
                      ? (themeMode === 'dark' ? '#1f1f1f' : '#f5f5f5')
                      : 'transparent',
                    transition: 'background-color 0.2s ease',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleToggleProject(member.id)}
                >
                  <Flex gap={12} align="center" style={{ flex: 1 }}>
                    <CustomAvatar 
                      avatarName={member?.name} 
                      size={40}
                    />
                    <Flex vertical>
                      <Text 
                        strong 
                        style={{ 
                          fontSize: '14px',
                          marginBottom: 2 
                        }}
                      >
                        {member.name}
                      </Text>
                      <Flex align="center" gap={4}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {member.role || t('teamMember')}
                        </Text>
                        {getMemberProjectsCount(member) > 0 && (
                          <Tag 
                            color="blue" 
                            style={{ 
                              marginLeft: 4, 
                              fontSize: '10px', 
                              lineHeight: '16px', 
                              height: '16px',
                              padding: '0 4px',
                            }}
                          >
                            {getMemberProjectsCount(member)} {t('projects')}
                          </Tag>
                        )}
                      </Flex>
                    </Flex>
                  </Flex>
                  
                  <Button 
                    type="text" 
                    size="small"
                    icon={expandedProject === member.id ? <CaretDownOutlined /> : <CaretRightFilled />}
                    style={{ color: themeMode === 'dark' ? '#bfbfbf' : '#8c8c8c' }}
                  />
                </Flex>

                {expandedProject === member.id && (
                  <Flex vertical style={{ backgroundColor: themeMode === 'dark' ? '#141414' : '#fafafa' }}>
                    {loading && member.id === expandedProject ? (
                      <Flex justify="center" align="center" style={{ padding: '16px 0' }}>
                        <Spin size="small" />
                      </Flex>
                    ) : !member.projects || !Array.isArray(member.projects) || member.projects.length === 0 ? (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={t('noProjects')}
                        style={{ margin: '16px 0', fontSize: '12px' }}
                      />
                    ) : (
                      <Flex 
                        vertical 
                        style={{ 
                          padding: '8px 0 8px 40px',
                          borderTop: themeMode === 'dark' ? '1px solid #303030' : '1px solid #f0f0f0',
                        }}
                      >
                        <Text 
                          type="secondary" 
                          style={{ 
                            fontSize: '12px', 
                            padding: '4px 16px',
                            marginBottom: 4,
                          }}
                        >
                          <CalendarOutlined style={{ marginRight: 4 }} />
                          {t('assignedProjects')}
                        </Text>
                        
                        {member.projects.map((project: any, index: any) => {
                          const projectColor = getProjectColor(project.id || index.toString());
                          const hasDateRange = project?.date_union?.start && project?.date_union?.end;
                          
                          return (
                            <Flex
                              gap={8}
                              align="center"
                              key={index}
                              style={{
                                padding: '8px 16px',
                                borderBottom: index !== member.projects.length - 1 
                                  ? (themeMode === 'dark' ? '1px solid #202020' : '1px solid #f5f5f5')
                                  : 'none',
                                transition: 'background-color 0.2s ease',
                              }}
                              className="project-row-hover"
                            >
                              <Badge 
                                color={projectColor} 
                                style={{ 
                                  height: '8px', 
                                  width: '8px',
                                  borderRadius: '50%',
                                }}
                              />
                              <Tooltip
                                title={
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <Text strong style={{ fontSize: '14px', color: 'white' }}>{project.name}</Text>
                                    {hasDateRange ? (
                                      <>
                                        <Text style={{ fontSize: '12px', color: 'white' }}>
                                          {t('startDate')}: {project?.date_union?.start}
                                        </Text>
                                        <Text style={{ fontSize: '12px', color: 'white' }}>
                                          {t('endDate')}: {project?.date_union?.end}
                                        </Text>
                                      </>
                                    ) : (
                                      <Text type="warning" style={{ fontSize: '12px' }}>
                                        {t('noDateRange')}
                                      </Text>
                                    )}
                                  </div>
                                }
                                color={themeMode === 'dark' ? '#141414' : undefined}
                              >
                                <Text 
                                  ellipsis
                                  style={{ 
                                    maxWidth: '260px',
                                    fontSize: '13px',
                                    fontWeight: hasDateRange ? 'normal' : 'bold',
                                    color: !hasDateRange 
                                      ? (themeMode === 'dark' ? '#ff7875' : '#f5222d') 
                                      : undefined
                                  }}
                                >
                                  {project.name}
                                  {!hasDateRange && (
                                    <InfoCircleOutlined 
                                      style={{ 
                                        marginLeft: 6, 
                                        fontSize: '12px',
                                        color: themeMode === 'dark' ? '#ff7875' : '#f5222d',
                                      }} 
                                    />
                                  )}
                                </Text>
                              </Tooltip>
                            </Flex>
                          );
                        })}
                      </Flex>
                    )}
                  </Flex>
                )}
              </Flex>
            ))
          )}
        </Flex>
      </Flex>
    );
  }
);

// Add CSS for the project row hover effect
const style = document.createElement('style');
style.innerHTML = `
  .project-row-hover:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  .dark-theme .project-row-hover:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;
document.head.appendChild(style);

export default GranttMembersTable;
