import React, { useEffect, useState } from 'react';
import { Member } from '../../../types/schedule/schedule.types';
import { Avatar, Badge, Button, Col, Flex, Popover, Row, Tooltip } from 'antd';
import { avatarNamesMap } from '../../../shared/constants';
import { CaretDownOutlined, CaretRightFilled } from '@ant-design/icons';
import { useAppSelector } from '../../../hooks/useAppSelector';
import './Team.css'
import { useDispatch } from 'react-redux';
import { toggleScheduleDrawer } from '../../../features/schedule/scheduleSlice';
import ProjectTimelineModal from '../../../features/schedule/ProjectTimelineModal';
import ScheduleDrawer from '../../../features/schedule/ScheduleDrawer';

interface GanttChartProps {
  members: Member[];
  date: Date | null;
}

interface teamProps {
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
  const workingDays = useAppSelector((state) => state.scheduleReducer.workingDays)
  const workingHours = useAppSelector((state) => state.scheduleReducer.workingHours)
  const dispatch = useDispatch()

  const timelineStart = date ? date : new Date();
  const timelineEnd = new Date(timelineStart);
  timelineEnd.setDate(timelineStart.getDate() + 15);

  const totalDays = getDaysBetween(timelineStart, timelineEnd);

  useEffect(() => {
    const weekendsArray = Array.from({ length: totalDays }, (_, i) => {
      const date = new Date(timelineStart);
      date.setDate(timelineStart.getDate() + i);

      // Check if the day is Saturday or Sunday
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      return !workingDays.includes(dayName)
      
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
      vertical
      style={{
        border: '1px solid rgba(0, 0, 0, 0.2)',
        padding: '0 0 10px 0px',
        overflow: 'auto'
      }}
    >
      {/* Header Row for Dates */}
      <Row style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.2)' }}>
        <Col span={4} style={{position: 'sticky'}}></Col>
        <Col span={20}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${totalDays}, 75px)`,
              gap: '2px',
              height: '60px',
            }}
          >
            {Array.from({ length: totalDays }, (_, i) => {
              const date = new Date(timelineStart);
              date.setDate(timelineStart.getDate() + i);
              const formattedDate = date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={i}
                  style={{
                    textAlign: 'center',
                    fontSize: '14px',
                    width: '83px',
                    padding: '8px 16px 0px 16px',
                    fontWeight: 'bold',
                    color: today && date && today.toDateString() === date.toDateString() ? 'white': weekends[i] ? 'rgba(0, 0, 0, 0.27)' : '',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
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
                </div>
              );
            })}
          </div>
        </Col>
      </Row>

      {members.map((member) => (
        <React.Fragment key={member.memberId}>
          <Row>
            <Col
              span={4}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                paddingLeft: '20px',
                whiteSpace: 'nowrap',
                position: 'sticky'
              }}
            >
              <Avatar
                style={{
                  backgroundColor: avatarNamesMap[member.memberName.charAt(0)],
                }}
              >
                {member.memberName.charAt(0)}
              </Avatar>
              <Button type='text' size='small' onClick={() => dispatch(toggleScheduleDrawer())}>{member.memberName}</Button>
              <ScheduleDrawer />
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
            </Col>
            <Col
              span={20}
              style={{ display: 'flex', width: '100%', paddingLeft: '3px',}}
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
                  <div
                    key={i}
                    style={{
                      fontSize: '14px',
                      backgroundColor: weekends[i]
                        ? 'rgba(217, 217, 217, 0.4)'
                        : '',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '10px 7px 10px 7px',
                      height: '92px',
                      flexDirection: 'column',
                    }}
                  >
                    <Tooltip
                      title={
                        <div
                          style={{ display: 'flex', flexDirection: 'column' }}
                        >
                          <span>
                            Totol Allocation - {totalPerDayHours + loggedHours}
                          </span>
                          <span>Time logged - {loggedHours}</span>
                          <span>Remaining time - {totalPerDayHours}</span>
                        </div>
                      }
                    >
                      <div
                        style={{
                          width: '63px',
                          background: `linear-gradient(to top, ${totalPerDayHours <= 0 ? 'rgba(200, 200, 200, 0.35)' : totalPerDayHours <= workingHours ? 'rgba(6, 126, 252, 0.4)' : 'rgba(255, 0, 0, 0.4)'} ${(totalPerDayHours * 100) / workingHours}%, rgba(190, 190, 190, 0.25) ${(totalPerDayHours * 100) / workingHours}%)`,
                          justifyContent:
                            loggedHours > 0 ? 'flex-end' : 'center',
                          display: 'flex',
                          alignItems: 'center',
                          height: '100%',
                          borderRadius: '5px',
                          flexDirection: 'column',
                        }}
                      >
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: `${(totalPerDayHours * 100) / workingHours}%`,
                          }}
                        >
                          {totalPerDayHours}h
                        </span>
                        {loggedHours > 0 && (
                          <span
                            style={{
                              height: `${(loggedHours * 100) / workingHours}%`,
                              backgroundColor: 'rgba(98, 210, 130, 1)',
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderBottomLeftRadius: '5px',
                              borderBottomRightRadius: '5px',
                            }}
                          >
                            {loggedHours}h
                          </span>
                        )}
                      </div>
                    </Tooltip>
                  </div>
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
                  projectDuration =  getDaysBetween(projectStart, timelineEnd)
                }

              if (startOffset < 0) {
                projectDuration += startOffset;
                startOffset = 0;
              }

              return (
                <Row key={project.projectId} >
                  <Col
                    span={4}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      paddingLeft: '20px',
                    }}
                  >
                    <Badge color="red" />
                    <Tooltip
                      title={
                        <div
                          style={{ display: 'flex', flexDirection: 'column' }}
                        >
                          <span>Start Date: {project.startDate}</span>
                          <span>End Date: {project.endDate}</span>
                        </div>
                      }
                    >
                      {project.projectName}
                    </Tooltip>
                  </Col>
                  <Col
                    span={20}
                    style={{
                      display: 'flex',
                      position: 'relative',
                      paddingLeft: '3px',
                    }}
                  >
                    {Array.from({ length: totalDays }, (_, i) => (
                      <Popover content={<ProjectTimelineModal />} trigger="click" >
                      <div
                      className={i >= startOffset && i < startOffset + projectDuration ? 'empty-cell-hide' : 'empty-cell'}
                        key={i}
                        style={{
                          fontSize: '14px',
                          backgroundColor: weekends[i]
                            ? 'rgba(217, 217, 217, 0.4)'
                            : '',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: '10px 7px',
                          height: '65px',
                          flexDirection: 'column',
                          position: 'relative',
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
                          <div
                          className='project-timeline-bar'
                            style={{
                              gridColumnStart: startOffset + 1,
                              gridColumnEnd: startOffset + projectDuration + 1,
                              backgroundColor: 'rgba(240, 248, 255, 1)',
                              height: '60px',
                              width: `${77 * projectDuration}px`,
                              borderRadius: '5px',
                              border: '1px solid rgba(149, 197, 248, 1)',
                              position: 'absolute',
                              left: 0,
                              right: 0,
                              top: '0',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              padding: '0 10px',
                              zIndex: 99,
                              cursor: 'pointer',
                            }}
                          >
                            <span
                              style={{ fontSize: '12px', fontWeight: 'bold' }}
                            >
                              Total {project.totalHours}h
                            </span>
                            <span style={{ fontSize: '10px' }}>
                              Per Day {project.perDayHours}h
                            </span>
                          </div>
                        )}
                      </div>
                      </Popover>
                    ))}
                  </Col>
                </Row>
              );
            })}
        </React.Fragment>
      ))}
    </Flex>
  );
};

const Team: React.FC<teamProps> = ({ date }) => {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/TeamData.json');
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return <GanttChart members={members} date={date} />;
};

export default Team;
