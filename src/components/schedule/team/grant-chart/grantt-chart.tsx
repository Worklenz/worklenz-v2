import React, { useEffect, useState } from 'react';
import { Member } from '../../../../types/schedule/schedule.types';
import { Badge, Button, Col, Flex, Popover, Row, Tooltip } from 'antd';
import { CaretDownOutlined, CaretRightFilled } from '@ant-design/icons';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import './grantt-chart.css';
import { useDispatch } from 'react-redux';
import { toggleScheduleDrawer } from '../../../../features/schedule/scheduleSlice';
import ProjectTimelineModal from '../../../../features/schedule/ProjectTimelineModal';
import ScheduleDrawer from '../../../../features/schedule/ScheduleDrawer';
import { useTranslation } from 'react-i18next';
import CustomAvatar from '../../../CustomAvatar';
import DayAllocationCell from './day-allocation-cell';
import ProjectTimelineBar from './project-timeline-bar';
import dayjs from 'dayjs';

interface GanttChartProps {
  members: Member[];
  date: Date | null;
}

const getDaysBetween = (start: Date, end: Date): number => {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((end.getTime() - start.getTime()) / msPerDay);
};

const GanttChart: React.FC<GanttChartProps> = ({ members, date }) => {
  const [weekends, setWeekends] = useState<boolean[]>([]);
  const [today, setToday] = useState(new Date());
  const [showProject, setShowProject] = useState<string | null>(null);
  const workingDays = useAppSelector(
    (state) => state.scheduleReducer.workingDays
  );
  const workingHours = useAppSelector(
    (state) => state.scheduleReducer.workingHours
  );
  const themeMode = useAppSelector((state) => state.themeReducer.mode);
  const dispatch = useDispatch();
  const { t } = useTranslation('schedule');

  const timelineStart = date ? date : new Date();
  const timelineEnd = new Date(timelineStart);
  timelineEnd.setDate(timelineStart.getDate() + 30);

  const totalDays = getDaysBetween(timelineStart, timelineEnd);

  useEffect(() => {
    const weekendsArray = Array.from({ length: totalDays }, (_, i) => {
      const date = new Date(timelineStart);
      date.setDate(timelineStart.getDate() + i);

      // Check if the day is Saturday or Sunday
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      return !workingDays.includes(dayName);
    });

    setWeekends(weekendsArray);
  }, [totalDays, timelineStart]);

  const handleShowProject = (memberId: string) => {
    setShowProject((prevMemberId) =>
      prevMemberId === memberId ? null : memberId
    );
  };

  return (
    <Flex
      style={{
        border:
          themeMode === 'dark'
            ? '1px solid #303030'
            : '1px solid rgba(0, 0, 0, 0.2)',
        padding: '0 0 10px 0px',
        borderRadius: '4px',
        backgroundColor: themeMode === 'dark' ? '#141414' : '',
      }}
    >
      {/* ============================================================================================================================== */}
      {/* table */}
      <Flex vertical style={{ width: '230px' }}>
        {/* right side of the table */}
        <div
          style={{
            height: '60px',
            borderBottom:
              themeMode === 'dark'
                ? '1px solid #303030'
                : '1px solid rgba(0, 0, 0, 0.2)',
          }}
        ></div>
        {members.map((member) => (
          <Flex vertical key={member.memberId}>
            <Flex
              gap={8}
              align="center"
              style={{
                paddingLeft: '20px',
                height: '92px',
              }}
            >
              <CustomAvatar avatarName={member.memberName} size={32} />

              <Button
                type="text"
                size="small"
                style={{ padding: 0 }}
                onClick={() => dispatch(toggleScheduleDrawer())}
              >
                {member.memberName}
              </Button>
              <Button
                size="small"
                type="text"
                onClick={() => handleShowProject(member.memberId)}
              >
                {showProject === member.memberId ? (
                  <CaretDownOutlined />
                ) : (
                  <CaretRightFilled />
                )}
              </Button>
              <ScheduleDrawer />
            </Flex>

            {showProject === member.memberId &&
              member.projects.map((project, index) => {
                const projectStart = new Date(project.startDate);
                const projectEnd = new Date(project.endDate);

                let startOffset = getDaysBetween(timelineStart, projectStart);
                let projectDuration =
                  getDaysBetween(projectStart, projectEnd) + 1;

                if (projectEnd > timelineEnd) {
                  projectDuration = getDaysBetween(projectStart, timelineEnd);
                }

                if (startOffset < 0) {
                  projectDuration += startOffset;
                  startOffset = 0;
                }

                return (
                  <Flex
                    gap={8}
                    align="center"
                    key={index}
                    style={{
                      paddingLeft: '20px',
                      position: 'sticky',
                      height: '65px',
                    }}
                  >
                    <Badge color="red" />
                    <Tooltip
                      title={
                        <div
                          style={{ display: 'flex', flexDirection: 'column' }}
                        >
                          <span>
                            {t('startDate')}: {project.startDate}
                          </span>
                          <span>
                            {t('endDate')}: {project.endDate}
                          </span>
                        </div>
                      }
                    >
                      {project.projectName}
                    </Tooltip>
                  </Flex>
                );
              })}
          </Flex>
        ))}
      </Flex>
      {/* ============================================================================================================================== */}
      {/* left side of the table */}
      <div style={{ overflow: 'auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${totalDays}, 75px)`,
            gap: 2,
            height: 60,
            borderBottom:
              themeMode === 'dark'
                ? '1px solid #303030'
                : '1px solid rgba(0, 0, 0, 0.2)',
          }}
        >
          {Array.from({ length: totalDays }, (_, i) => {
            const date = new Date(timelineStart);
            date.setDate(timelineStart.getDate() + i);
            const formattedDate = dayjs(date).format(`ddd,MMM DD`);

            return (
              <Flex
                align="center"
                justify="center"
                key={i}
                style={{
                  textAlign: 'center',
                  fontSize: '14px',
                  width: '83px',
                  padding: '8px 16px',
                  color:
                    today &&
                    date &&
                    today.toDateString() === date.toDateString()
                      ? 'white'
                      : weekends[i]
                        ? themeMode === 'dark'
                          ? 'rgba(200, 200, 200, 0.6)'
                          : 'rgba(0, 0, 0, 0.27)'
                        : '',
                  backgroundColor:
                    today &&
                    date &&
                    today.toDateString() === date.toDateString()
                      ? 'rgba(24, 144, 255, 1)'
                      : '',
                  borderRadius: '5px',
                }}
              >
                {formattedDate}
              </Flex>
            );
          })}
        </div>

        <div>
          {members.map((member) => (
            <div
              key={member.memberId}
              style={{
                display: 'flex',
                width: '100%',
                flexDirection: 'column',
              }}
            >
              <Row>
                <Col
                  span={24}
                  style={{ display: 'flex', width: '100%', paddingLeft: '3px' }}
                >
                  {Array.from({ length: totalDays }, (_, i) => {
                    const currentDay = new Date(timelineStart);
                    currentDay.setDate(timelineStart.getDate() + i);

                    const formattedCurrentDay = currentDay
                      .toISOString()
                      .split('T')[0];
                    const loggedHours =
                      member.timeLogged?.find(
                        (log) => log.date === formattedCurrentDay
                      )?.hours || 0;

                    const totalPerDayHours =
                      member.projects.reduce((total, project) => {
                        const projectStart = new Date(project.startDate);
                        const projectEnd = new Date(project.endDate);
                        if (
                          currentDay >= projectStart &&
                          currentDay <= projectEnd
                        ) {
                          return total + project.perDayHours;
                        }
                        return total;
                      }, 0) - loggedHours;

                    return (
                      <DayAllocationCell
                        key={i}
                        currentDay={currentDay}
                        weekends={weekends}
                        totalPerDayHours={totalPerDayHours}
                        loggedHours={loggedHours}
                        workingHours={workingHours}
                        onClick={() => dispatch(toggleScheduleDrawer())}
                        isWeekend={weekends[i]}
                      />
                    );
                  })}
                </Col>
              </Row>
              {/* Row for Each Project Timeline */}
              {showProject === member.memberId &&
                member.projects.map((project) => {
                  const projectStart = new Date(project.startDate);
                  const projectEnd = new Date(project.endDate);
                  let startOffset = getDaysBetween(timelineStart, projectStart);
                  let projectDuration =
                    getDaysBetween(projectStart, projectEnd) + 1;

                  if (projectEnd > timelineEnd) {
                    projectDuration = getDaysBetween(projectStart, timelineEnd);
                  }

                  if (startOffset < 0) {
                    projectDuration += startOffset;
                    startOffset = 0;
                  }

                  return (
                    <Row key={project.projectId}>
                      <Col
                        span={24}
                        style={{
                          display: 'flex',
                          position: 'relative',
                          paddingLeft: '3px',
                        }}
                      >
                        {Array.from({ length: totalDays }, (_, i) => (
                          <Popover
                            content={<ProjectTimelineModal />}
                            trigger="click"
                          >
                            <Flex
                              align="center"
                              justify="center"
                              className={
                                i >= startOffset &&
                                i < startOffset + projectDuration
                                  ? 'empty-cell-hide'
                                  : `empty-cell rounded-sm outline-1 hover:outline ${themeMode === 'dark' ? 'outline-white/25' : 'outline-black/25'}`
                              }
                              key={i}
                              style={{
                                fontSize: '14px',
                                backgroundColor: weekends[i]
                                  ? 'rgba(217, 217, 217, 0.4)'
                                  : '',
                                padding: '10px 7px',
                                height: '65px',
                                flexDirection: 'column',
                                position: 'relative',
                                cursor: 'pointer',
                              }}
                            >
                              <div
                                style={{
                                  width: '63px',
                                  height: '100%',
                                  zIndex: 1,
                                }}
                              ></div>

                              {/* Project Timeline Bar */}
                              {i === startOffset && (
                                <ProjectTimelineBar
                                  project={project}
                                  startOffset={startOffset}
                                  projectDuration={projectDuration}
                                />
                              )}
                            </Flex>
                          </Popover>
                        ))}
                      </Col>
                    </Row>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </Flex>
  );
};

export default GanttChart;
