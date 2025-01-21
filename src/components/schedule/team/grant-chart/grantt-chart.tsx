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
import { useDispatch } from 'react-redux';
import { toggleScheduleDrawer } from '../../../../features/schedule/scheduleSlice';
import { useTranslation } from 'react-i18next';
import DayAllocationCell from './day-allocation-cell';
import ProjectTimelineBar from './project-timeline-bar';
import ScheduleDrawer from '../../../../features/schedule/ScheduleDrawer';
import GranttMembersTable from './grantt-members-table';
import { themeWiseColor } from '../../../../utils/themeWiseColor';
import Timeline from './timeline';

export const CELL_WIDTH = 77;

type GanttChartProps = {
  members: Member[];
  date: Date | null;
};

type DatesType = {
  date_data: {
    month: string;
    weeks: any[];
    days: {
      day: number;
      name: string;
      isWeekend: boolean;
      isToday: boolean;
    }[];
  }[];
  chart_start: Date | null;
  chart_end: Date | null;
};

const getDaysBetween = (start: Date, end: Date): number => {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((end.getTime() - start.getTime()) / msPerDay);
};

const GanttChart: React.FC<GanttChartProps> = ({ members, date }) => {
  const [today, setToday] = useState(new Date());
  const [showProject, setShowProject] = useState<string | null>(null);
  const { workingDays } = useAppSelector((state) => state.scheduleReducer);
  const workingHours = useAppSelector(
    (state) => state.scheduleReducer.workingHours
  );
  const [dates, setDates] = useState<DatesType | null>(null);

  const timelineScrollRef = useRef<HTMLDivElement>(null);
  const timelineHeaderScrollRef = useRef<HTMLDivElement>(null);
  const membersScrollRef = useRef<HTMLDivElement>(null);

  // localization
  const { t } = useTranslation('schedule');

  // get theme data
  const themeMode = useAppSelector((state) => state.themeReducer.mode);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch dates from API or file
    const fetchDates = async () => {
      try {
        const response = await fetch(
          '/scheduler-data/scheduler-timeline-dates.json'
        );
        const data = await response.json();
        setDates(data);
      } catch (error) {
        console.error('Error fetching dates:', error);
      }
    };

    fetchDates();
  }, []);

  const timelineStart = useMemo(() => {
    return dates?.chart_start ? new Date(dates.chart_start) : new Date();
  }, [dates]);

  const timelineEnd = useMemo(() => {
    return dates?.chart_end ? new Date(dates.chart_end) : new Date();
  }, [dates]);

  const totalDays = useMemo(() => {
    if (timelineStart && timelineEnd) {
      const msPerDay = 1000 * 60 * 60 * 24;
      return Math.round(
        (timelineEnd.getTime() - timelineStart.getTime()) / msPerDay
      );
    }
    return 0;
  }, [timelineStart, timelineEnd]);

  const handleShowProject = useCallback((memberId: string | null) => {
    setShowProject((prevMemberId: string | null) =>
      prevMemberId === memberId ? null : memberId
    );
  }, []);

  // Syncing scroll vertically between timeline and members
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

  // Syncing scroll horizontally between timeline and header
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
      {/* Table Section */}
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

      {/* Timeline Section */}
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
          <Timeline />
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
              {/* member row  ================================================================= */}
              <Row>
                <Col span={24} style={{ display: 'flex', width: '100%' }}>
                  {dates?.date_data?.map((month, monthIndex) =>
                    month.days.map((day, dayIndex) => (
                      <div
                        key={`${monthIndex}-${dayIndex}`}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: 90,
                          background: day.isWeekend
                            ? 'rgba(217, 217, 217, 0.4)'
                            : '',
                        }}
                      >
                        <DayAllocationCell
                          totalPerDayHours={8}
                          loggedHours={0}
                          workingHours={8}
                          isWeekend={day.isWeekend}
                        />
                      </div>
                    ))
                  )}
                </Col>
              </Row>

              {/* row for Each Project Timeline ======================================================*/}
              {showProject === member.memberId &&
                member.projects.map((project) => {
                  const projectStart = new Date(project.startDate);
                  const projectEnd = new Date(project.endDate);

                  // Calculate grid-column-start and grid-column-end
                  const startOffset = Math.max(
                    0, // Ensure the startOffset is not negative
                    Math.floor(
                      (projectStart.getTime() - timelineStart.getTime()) /
                        (1000 * 60 * 60 * 24)
                    ) - 4
                  );

                  const projectDuration =
                    Math.floor(
                      (projectEnd.getTime() - projectStart.getTime()) /
                        (1000 * 60 * 60 * 24)
                    ) + 2;

                  return (
                    <Row
                      key={project.projectId}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${totalDays}, ${CELL_WIDTH}px)`,
                        position: 'relative',
                        height: 65,
                      }}
                    >
                      <div
                        style={{
                          gridColumnStart: startOffset,
                          gridColumnEnd: startOffset + projectDuration,
                        }}
                      >
                        <ProjectTimelineBar
                          project={project}
                          startOffset={startOffset}
                          projectDuration={projectDuration}
                        />
                      </div>
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
