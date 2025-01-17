import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Member } from '../../../../types/schedule/schedule.types';
import { Col, Flex, Row, Typography } from 'antd';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import './grantt-chart.css';
import { useDispatch } from 'react-redux';
import { toggleScheduleDrawer } from '../../../../features/schedule/scheduleSlice';
import { useTranslation } from 'react-i18next';
import DayAllocationCell from './day-allocation-cell';
import ProjectTimelineBar from './project-timeline-bar';
import dayjs from 'dayjs';
import ScheduleDrawer from '../../../../features/schedule/ScheduleDrawer';
import GranttMembersTable from './grantt-members-table';
import { themeWiseColor } from '../../../../utils/themeWiseColor';

type GanttChartProps = {
  members: Member[];
  date: Date | null;
};

const getDaysBetween = (start: Date, end: Date): number => {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((end.getTime() - start.getTime()) / msPerDay);
};

const GanttChart: React.FC<GanttChartProps> = ({ members, date }) => {
  const [weekends, setWeekends] = useState<boolean[]>([]);
  const [today, setToday] = useState(new Date());
  const [showProject, setShowProject] = useState<string | null>(null);
  const { workingDays } = useAppSelector((state) => state.scheduleReducer);
  const workingHours = useAppSelector(
    (state) => state.scheduleReducer.workingHours
  );

  const timelineScrollRef = useRef<HTMLDivElement>(null);
  const timelineHeaderScrollRef = useRef<HTMLDivElement>(null);
  const membersScrollRef = useRef<HTMLDivElement>(null);

  // localization
  const { t } = useTranslation('schedule');

  // get theme data
  const themeMode = useAppSelector((state) => state.themeReducer.mode);
  const dispatch = useDispatch();

  const timelineStart = useMemo(() => (date ? date : new Date()), [date]);
  const timelineEnd = useMemo(() => {
    const endDate = new Date(timelineStart);
    endDate.setDate(timelineStart.getDate() + 90);
    return endDate;
  }, [timelineStart]);

  const totalDays = getDaysBetween(timelineStart, timelineEnd);

  useEffect(() => {
    const weekendsArray = Array.from({ length: totalDays }, (_, i) => {
      const date = new Date(timelineStart);
      date.setDate(timelineStart.getDate() + i);

      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      return !workingDays.includes(dayName);
    });

    setWeekends(weekendsArray);
  }, [timelineStart, totalDays, workingDays]);

  const handleShowProject = useCallback((memberId: string | null) => {
    setShowProject((prevMemberId: string | null) =>
      prevMemberId === memberId ? null : memberId
    );
  }, []);

  // function to sync scroll
  const syncVerticalScroll = (source: 'timeline' | 'members') => {
    if (source === 'timeline') {
      if (membersScrollRef.current && timelineScrollRef.current) {
        membersScrollRef.current.scrollTop =
          timelineScrollRef.current.scrollTop;
      }
    } else {
      if (timelineScrollRef.current && membersScrollRef.current) {
        timelineScrollRef.current.scrollTop =
          membersScrollRef.current.scrollTop;
      }
    }
  };

  // function to sync scroll
  const syncHorizontalScroll = (source: 'timeline' | 'header') => {
    if (source === 'timeline') {
      if (timelineHeaderScrollRef.current && timelineScrollRef.current) {
        timelineHeaderScrollRef.current.scrollLeft =
          timelineScrollRef.current.scrollLeft;
      }
    } else {
      if (timelineScrollRef.current && timelineHeaderScrollRef.current) {
        timelineScrollRef.current.scrollLeft =
          timelineHeaderScrollRef.current.scrollLeft;
      }
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '375px 1fr',
        overflow: 'hidden',
        height: 'calc(100vh - 206px)',
        border:
          themeMode === 'dark' ? '1px solid #303030' : '1px solid #e5e7eb',
        borderRadius: '4px',
        backgroundColor: themeMode === 'dark' ? '#141414' : '',
      }}
    >
      {/* ============================================================================================================================== */}
      {/* table */}
      <div
        style={{
          background: themeWiseColor('#fff', '#141414', themeMode),
        }}
        className={`after:content relative z-10 after:absolute after:-right-1 after:top-0 after:-z-10 after:h-full after:w-1.5 after:bg-transparent after:bg-gradient-to-r after:from-[rgba(0,0,0,0.12)] after:to-transparent`}
      >
        <GranttMembersTable
          members={members}
          showProjects={showProject}
          handleShowProject={handleShowProject}
          timelineStart={timelineStart}
          timelineEnd={timelineEnd}
          memberScrollRef={membersScrollRef}
          syncVerticalScroll={syncVerticalScroll}
        />
      </div>

      {/* ============================================================================================================================== */}
      {/* left side of the table */}
      <div style={{ overflow: 'auto' }}>
        <div
          ref={timelineHeaderScrollRef}
          style={{
            position: 'sticky',
            overflow: 'auto',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            backgroundColor: themeWiseColor('#fff', '#141414', themeMode),
            scrollbarWidth: 'none',
            borderBottom:
              themeMode === 'dark' ? '1px solid #303030' : '1px solid #e5e7eb',
          }}
          onScroll={() => syncHorizontalScroll('header')}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${totalDays}, 75px)`,
              gap: 2,
              height: 60,
            }}
          >
            {Array.from({ length: totalDays }, (_, i) => {
              const date = new Date(timelineStart);
              date.setDate(timelineStart.getDate() + i);
              const formattedDateDay = dayjs(date).format(`ddd,`);
              const formattedDateMonth = dayjs(date).format(`MMM DD`);
              return (
                <Flex
                  vertical
                  align="center"
                  justify="center"
                  key={i}
                  style={{
                    textAlign: 'center',
                    fontSize: '12px',
                    width: '77px',
                    padding: '8px',
                    borderBottom:
                      themeMode === 'dark'
                        ? '1px solid #303030'
                        : '1px solid #e5e7eb',
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
                        : weekends[i]
                          ? themeMode === 'dark'
                            ? 'rgba(200, 200, 200, 0.6)'
                            : 'rgba(217, 217, 217, 0.4)'
                          : '',
                    borderRadius:
                      today &&
                      date &&
                      today.toDateString() === date.toDateString()
                        ? 0
                        : 0,
                  }}
                >
                  <Typography.Text>{formattedDateDay}</Typography.Text>
                  <Typography.Text>{formattedDateMonth}</Typography.Text>
                </Flex>
              );
            })}
          </div>
        </div>

        <Flex
          vertical
          ref={timelineScrollRef}
          onScroll={() => {
            syncVerticalScroll('timeline');
            syncHorizontalScroll('timeline');
          }}
          style={{
            height: 'calc(100vh - 270px)',
            overflow: 'auto',
          }}
        >
          {members.map((member) => (
            <Flex
              vertical
              key={member.memberId}
              style={{
                width: '100%',
              }}
            >
              <Row>
                <Col span={24} style={{ display: 'flex', width: '100%' }}>
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
                        }}
                      >
                        {Array.from({ length: totalDays }, (_, i) => (
                          <Flex
                            align="center"
                            justify="center"
                            className={
                              i >= startOffset &&
                              i < startOffset + projectDuration
                                ? 'empty-cell-hide'
                                : `empty-cell rounded-sm outline-1 hover:outline ${themeMode === 'dark' ? 'outline-white/10' : 'outline-black/10'}`
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
                                projectDuration={3}
                              />
                            )}
                          </Flex>
                        ))}
                      </Col>
                    </Row>
                  );
                })}
            </Flex>
          ))}
        </Flex>
      </div>

      <ScheduleDrawer />
    </div>
  );
};

export default React.memo(GanttChart);
