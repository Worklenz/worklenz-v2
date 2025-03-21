import React, { useEffect, useState } from 'react';
import { MemberLoggedTimeType } from '@/types/timeSheet/project.types';
import { ClockCircleOutlined } from '@ant-design/icons';
import { Progress } from 'antd';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslation } from 'react-i18next';
import { reportingTimesheetApiService } from '@/api/reporting/reporting.timesheet.api.service';
import { IAllocationProject } from '@/types/reporting/reporting-allocation.types';

const TimeSheetTable: React.FC = () => {
  const [projects, setProjects] = useState<IAllocationProject[]>([]);
  const [members, setMembers] = useState<MemberLoggedTimeType[]>([]);

  const themeMode = useAppSelector(state => state.themeReducer.mode);
  const { teams } = useAppSelector(state => state.timeReportsOverviewReducer);
  const { duration, dateRange } = useAppSelector(state => state.reportingReducer);

  const { t } = useTranslation('time-report');

  const fetchTimeSheetData = async () => {
    const selectedTeams = teams.map(team => team.selected && team.id);

    const body = {
      teams: selectedTeams || [],
      projects: projects.map(project => project.id) || [],
      duration,
      date_range: dateRange,
      archived: false,
      billable: false,
    };
    const response = await reportingTimesheetApiService.getTimeSheetData(body, false);
    setProjects(response.data);
  };

  useEffect(() => {
    const selectedTeams = teams.filter(team => team.selected);

    const fetchProjectsData = async () => {
      try {
        const response = await fetch('/TimeSheet.json');
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    const fetchMembersData = async () => {
      try {
        const response = await fetch('/TimeSheetMember.json');
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error('Error fetching member data:', error);
      }
    };

    fetchProjectsData();
    fetchMembersData();
  }, []);

  return (
    <div
      style={{
        overflow: 'auto',
        width: 'max-content',
        maxWidth: 'calc(100vw - 225px)',
      }}
    >
      {/* Header Row for Member Names */}
      <div style={{ display: 'flex', height: '77.6px' }}>
        <div
          style={{
            minWidth: '200px',
            borderRight: themeMode === 'dark' ? '1px solid #2c2f38' : '1px solid #f5f5f5',
            borderBottom: themeMode === 'dark' ? '1px solid #2c2f38' : '1px solid #f5f5f5',
            position: 'sticky',
            left: 0,
            backgroundColor: themeMode === 'dark' ? 'rgb(24 24 24)' : 'white',
          }}
        ></div>
        {members.map(member => (
          <div
            key={member.id}
            style={{
              minWidth: '100px',
              padding: '16px 6px',
              borderRight: themeMode === 'dark' ? '1px solid #2c2f38' : '1px solid #f5f5f5',
              borderTop: themeMode === 'dark' ? '1px solid #2c2f38' : '1px solid #f5f5f5',
              borderBottom: themeMode === 'dark' ? '1px solid #2c2f38' : '1px solid #f5f5f5',
              fontWeight: '500',
            }}
          >
            {member.name}
          </div>
        ))}
        <div
          style={{
            minWidth: '120px',
            border: themeMode === 'dark' ? '1px solid #2c2f38' : '1px solid #f5f5f5',
            position: 'sticky',
            backgroundColor: themeMode === 'dark' ? '#2c2f38' : '#f8f7f9',
            fontWeight: '500',
            padding: '16px 12px',
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            right: 0,
          }}
        >
          {t('total')}
        </div>
      </div>

      {/* Rows for Each Project */}
      {projects.map((project, index) => (
        <div key={index} style={{ display: 'flex', height: '77.6px' }}>
          <div
            style={{
              minWidth: '200px',
              padding: '16px 8px 16px 12px',
              position: 'sticky',
              borderRight: themeMode === 'dark' ? '1px solid #2c2f38' : '1px solid #f5f5f5',
              borderBottom: themeMode === 'dark' ? '1px solid #2c2f38' : '1px solid #f5f5f5',
              borderLeft: themeMode === 'dark' ? '1px solid #2c2f38' : '1px solid #f5f5f5',
              left: 0,
              zIndex: 999,
              backgroundColor: themeMode === 'dark' ? 'rgb(24 24 24)' : 'white',
            }}
          >
            <span>
              <ClockCircleOutlined style={{ color: 'rgb(203, 200, 161)' }} /> {project.projectName}
            </span>
            <Progress percent={30} size="small" />
          </div>

          {/* Render Logged Time for Each Member */}
          {members.map(member => {


            return (
              <div
                key={member.id}
                style={{
                  minWidth: '100px',
                  padding: '16px 6px',
                  borderRight: themeMode === 'dark' ? '1px solid #2c2f38' : '1px solid #f5f5f5',
                  borderBottom: themeMode === 'dark' ? '1px solid #2c2f38' : '1px solid #f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {member.total_time || '-'}
              </div>
            );
          })}
          <div
            style={{
              minWidth: '120px',
              borderBottom: themeMode === 'dark' ? '1px solid #2c2f38' : '1px solid #f5f5f5',
              position: 'sticky',
              backgroundColor: themeMode === 'dark' ? '#2c2f38' : '#f8f7f9',
              fontWeight: '500',
              padding: '16px 12px',
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
              right: 0,
              borderLeft: themeMode === 'dark' ? '1px solid #2c2f38' : '1px solid #f5f5f5',
              borderRight: themeMode === 'dark' ? '1px solid #2c2f38' : '1px solid #f5f5f5',
            }}
          ></div>
        </div>
      ))}

      {/* Footer row */}
      <div style={{ display: 'flex', height: '54.8px' }}>
        <div
          style={{
            minWidth: '200px',
            padding: '16px 8px 16px 12px',
            backgroundColor: themeMode === 'dark' ? '#2c2f38' : '#f8f7f9',
            left: 0,
            position: 'sticky',
            borderLeft: themeMode === 'dark' ? '1px solid #2c2f38' : '1px solid #f5f5f5',
            borderRight: themeMode === 'dark' ? '1px solid #2c2f38' : '1px solid #f5f5f5',
          }}
        >
          {t('total')}
        </div>
        {members.map(member => (
          <div
            key={member.id}
            style={{
              minWidth: '100px',
              padding: '16px 6px',
              borderRight: themeMode === 'dark' ? '1px solid #2c2f38' : '1px solid #f5f5f5',
              borderTop: themeMode === 'dark' ? '1px solid #2c2f38' : '1px solid #f5f5f5',
              borderBottom: themeMode === 'dark' ? '1px solid #2c2f38' : '1px solid #f5f5f5',
              fontWeight: '500',
              backgroundColor: themeMode === 'dark' ? '#2c2f38' : '#f8f7f9',
            }}
          ></div>
        ))}
        <div
          style={{
            minWidth: '120px',
            padding: '16px 6px',
            border: themeMode === 'dark' ? '1px solid #2c2f38' : '1px solid #f5f5f5',
            fontWeight: '500',
            backgroundColor: themeMode === 'dark' ? '#2c2f38' : '#f8f7f9',
            position: 'sticky',
            right: 0,
          }}
        ></div>
      </div>
    </div>
  );
};

export default TimeSheetTable;
