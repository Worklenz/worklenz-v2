import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchDateList, fetchTeamData } from '../../../features/schedule/scheduleSlice';
import { themeWiseColor } from '../../../utils/themeWiseColor';
import GranttMembersTable from './grantt-members-table';
import { CELL_WIDTH } from '../../../shared/constants';
import { Flex, Popover, Row, Col, Typography } from 'antd';
import DayAllocationCell from './day-allocation-cell';
import ProjectTimelineBar from './project-timeline-bar';
import ProjectTimelineModal from '@/features/schedule/ProjectTimelineModal';

const { Text } = Typography;

// Date format helper function
const formatDateLabel = (date: any, day: any) => {
  return (
    <>
      <div>{day.name},</div>
      <div>
        {date?.month.substring(0, 4)} {day.day}
      </div>
    </>
  );
};

const GranttChart = React.forwardRef(({ type, date }: { type: string; date: Date }, ref) => {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string|undefined>(undefined);

  const { teamData } = useAppSelector(state => state.scheduleReducer);
  const { dateList, loading, dayCount } = useAppSelector(state => state.scheduleReducer);

  // get theme details from theme reducer
  const themeMode = useAppSelector(state => state.themeReducer.mode);
  
  // Use refs to track previous values for comparison
  const prevDateRef = useRef<string>('');
  const prevTypeRef = useRef<string>('');

  const dispatch = useAppDispatch();

  // Properly handle data fetching with refs to prevent infinite loops
  useEffect(() => {
    // Convert date to a comparable string value
    const dateStr = date ? date.toISOString() : '';
    
    // Only fetch if date or type has actually changed
    if (dateStr !== prevDateRef.current || type !== prevTypeRef.current) {
      const fetchData = async () => {
        try {
          if (date && type) {
            await dispatch(fetchDateList({ date, type }));
          }
        } catch (error) {
          console.error('Error fetching date list:', error);
        }
      };
      
      // Update refs to current values
      prevDateRef.current = dateStr;
      prevTypeRef.current = type;
      
      fetchData();
    }
  }, [date, type, dispatch]);

  // refs
  const timelineScrollRef = useRef<HTMLDivElement>(null);
  const timelineHeaderScrollRef = useRef<HTMLDivElement>(null);
  const membersScrollRef = useRef<HTMLDivElement>(null);

  // Syncing scroll vertically between timeline and members
  const syncVerticalScroll = (source: 'timeline' | 'members') => {
    if (source === 'timeline') {
      if (membersScrollRef.current && timelineScrollRef.current) {
        membersScrollRef.current.scrollTop = timelineScrollRef.current.scrollTop;
      }
    } else {
      if (timelineScrollRef.current && membersScrollRef.current) {
        timelineScrollRef.current.scrollTop = membersScrollRef.current.scrollTop;
      }
    }
  };

  // syncing scroll horizontally between timeline and header
  const syncHorizontalScroll = (source: 'timeline' | 'header') => {
    if (source === 'timeline') {
      if (timelineHeaderScrollRef.current && timelineScrollRef.current) {
        timelineHeaderScrollRef.current.scrollLeft = timelineScrollRef.current.scrollLeft;
      }
    } else {
      if (timelineScrollRef.current && timelineHeaderScrollRef.current) {
        timelineScrollRef.current.scrollLeft = timelineHeaderScrollRef.current.scrollLeft;
      }
    }
  };

  const scrollToToday = () => {
    if (!timelineScrollRef.current || !dateList?.date_data) return;

    // Find the index of the "Today" date
    let todayIndex = 0;
    dateList.date_data.some((date: any) => {
      const dayIndex = date.days.findIndex((day: any) => day.isToday);
      if (dayIndex !== -1) {
        todayIndex += dayIndex; // Add the index of today within the current month's days
        return true;
      }
      todayIndex += date.days.length; // Increment by the number of days in the current month
      return false;
    });

    // Calculate the scroll position
    const scrollPosition = todayIndex * CELL_WIDTH;

    // Scroll the timeline
    timelineScrollRef.current.scrollTo({
      left: scrollPosition,
    });
  };

  React.useImperativeHandle(ref, () => ({
    scrollToToday,
  }));

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '370px 1fr',
        overflow: 'hidden',
        height: 'calc(100vh - 206px)',
        border: themeMode === 'dark' ? '1px solid #303030' : '1px solid #e5e7eb',
        borderRadius: '4px',
        backgroundColor: themeMode === 'dark' ? '#141414' : '',
      }}
    >
      {/* Team members table */}
      <div
        style={{
          background: themeWiseColor('#fff', '#141414', themeMode),
          borderRight: themeMode === 'dark' ? '1px solid #303030' : '1px solid #e5e7eb',
          height: '100%',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <GranttMembersTable
          members={teamData}
          expandedProject={expandedProject}
          setExpandedProject={setExpandedProject}
          membersScrollRef={membersScrollRef}
          syncVerticalScroll={syncVerticalScroll}
        />
      </div>

      {/* Timeline section */}
      <div style={{ overflow: 'hidden', position: 'relative' }}>
        {/* Date header row - Fixed at the top */}
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
            borderBottom: themeMode === 'dark' ? '1px solid #303030' : '1px solid #e5e7eb',
            height: '60px', // Fixed height to match team header
            msOverflowStyle: 'none', // Hide scrollbar in IE and Edge
          }}
          onScroll={() => syncHorizontalScroll('header')}
          className="hide-scrollbar"
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${dayCount}, ${CELL_WIDTH}px)`,
              height: '100%',
            }}
          >
            {dateList?.date_data?.map((date: any, index: number) =>
              date.days.map((day: any) => (
                <div
                  key={index + day.day}
                  style={{
                    background: day.isWeekend
                      ? 'rgba(217, 217, 217, 0.4)'
                      : day.isToday
                        ? '#69b6fb'
                        : '',
                    color: day.isToday ? '#fff' : '',
                    padding: '8px 0',
                    textAlign: 'center',
                    height: '60px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '13px',
                    borderRight: themeMode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                  }}
                >
                  {formatDateLabel(date, day)}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Scrollable timeline content */}
        <Flex
          vertical
          ref={timelineScrollRef}
          onScroll={() => {
            syncVerticalScroll('timeline');
            syncHorizontalScroll('timeline');
          }}
          style={{
            height: 'calc(100vh - 266px)',
            overflow: 'auto',
          }}
          className="hide-scrollbar"
        >
          {teamData.map((member: any) => (
            <div
              key={member.id}
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${dayCount}, ${CELL_WIDTH}px)`,
                borderBottom: themeMode === 'dark' ? '1px solid #303030' : '1px solid #f0f0f0',
              }}
            >
              {dateList?.date_data?.map((date: any) =>
                date.days.map((day: any) => (
                  <div
                    key={`${date.month}-${day.day}`}
                    style={{
                      background: day.isWeekend ? 'rgba(217, 217, 217, 0.4)' : '',
                      color: day.isToday ? '#fff' : '',
                      height: 90,
                      borderRight: themeMode === 'dark' ? '1px solid rgba(255,255,255,0.03)' : '1px solid rgba(0,0,0,0.03)',
                    }}
                  >
                    <DayAllocationCell
                      workingHours={8}
                      loggedHours={0}
                      totalPerDayHours={0}
                      isWeekend={day.isWeekend}
                    />
                  </div>
                ))
              )}

              {expandedProject === member.id && (
                <div>
                  <Popover
                    content={<ProjectTimelineModal memberId={member?.team_member_id} projectId={selectedProjectId} setIsModalOpen={setIsModalOpen} />}
                    trigger={'click'}
                    open={isModalOpen}
                  ></Popover>
                  {member.projects && Array.isArray(member.projects) && member.projects.map((project: any) => (
                    <div
                      key={project.id}
                      onClick={() => {
                        if (!(project?.date_union?.start && project?.date_union?.end)) {
                          setSelectedProjectId(project?.id);
                          setIsModalOpen(true);
                        }
                      }}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${dayCount}, ${CELL_WIDTH}px)`,
                        position: 'relative',
                      }}
                    >
                      <Flex
                        align="center"
                        style={{
                          position: 'absolute',
                          left: 0,
                          zIndex: 50,
                          height: 65,
                        }}
                      >
                        {project?.date_union?.start && project?.date_union?.end && (
                          <ProjectTimelineBar
                            defaultData={project?.default_values}
                            project={project}
                            indicatorWidth={project?.indicator_width}
                            indicatorOffset={project?.indicator_offset}
                          />
                        )}
                      </Flex>

                      {dateList?.date_data?.map((date: any) =>
                        date.days.map((day: any) => (
                          <div
                            key={`${date.month}-${day.day}`}
                            style={{
                              background: day.isWeekend ? 'rgba(217, 217, 217, 0.4)' : '',
                              height: 65,
                              borderRight: themeMode === 'dark' ? '1px solid rgba(255,255,255,0.03)' : '1px solid rgba(0,0,0,0.03)',
                            }}
                          >
                            <div
                              style={{ width: '100%', height: '100%' }}
                              className={`rounded-sm outline-1 hover:outline ${themeMode === 'dark' ? 'outline-white/10' : 'outline-black/10'}`}
                            ></div>
                          </div>
                        ))
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </Flex>
      </div>
    </div>
  );
});

// Add CSS to hide scrollbars but maintain functionality
const style = document.createElement('style');
style.innerHTML = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
document.head.appendChild(style);

export default GranttChart;
