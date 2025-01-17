import { Badge, Button, Flex, Tooltip } from 'antd';
import React from 'react';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { useDispatch } from 'react-redux';
import CustomAvatar from '../../../CustomAvatar';
import { toggleScheduleDrawer } from '../../../../features/schedule/scheduleSlice';
import { CaretDownOutlined, CaretRightFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Member } from '../../../../types/schedule/schedule.types';

type GranttChartMembersTabelProps = {
  members: Member[];
  showProjects: string | null;
  handleShowProject: (memberId: string | null) => void;
  timelineStart: Date;
  timelineEnd: Date;
  memberScrollRef: any;
  syncVerticalScroll: (source: 'timeline' | 'members') => void;
};

const GranttMembersTable = ({
  members,
  showProjects,
  handleShowProject,
  timelineStart,
  timelineEnd,
  memberScrollRef,
  syncVerticalScroll,
}: GranttChartMembersTabelProps) => {
  // localization
  const { t } = useTranslation('schedule');

  // get theme details
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  const dispatch = useDispatch();

  const getDaysBetween = (start: Date, end: Date): number => {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.round((end.getTime() - start.getTime()) / msPerDay);
  };

  return (
    <Flex
      vertical
      style={{
        width: 370,
        marginBlockStart: 60,
        borderTop:
          themeMode === 'dark' ? '1px solid #303030' : '1px solid #e5e7eb',
      }}
    >
      {/* right side of the table */}
      <div
        id="members-header"
        style={{
          position: 'fixed',
          top: 0,
          zIndex: 100,
          width: 370,
          height: '60px',
          backgroundColor: themeMode === 'dark' ? '#141414' : '#fff',
        }}
      ></div>

      <Flex
        vertical
        ref={memberScrollRef}
        onScroll={() => syncVerticalScroll('members')}
        style={{
          maxHeight: 'calc(100vh - 278px)',
          overflow: 'auto',
        }}
      >
        {members.map((member) => (
          <Flex vertical key={member.memberId}>
            <Flex
              gap={8}
              align="center"
              justify="space-between"
              style={{
                paddingInline: 12,
                height: 92,
              }}
            >
              <Flex gap={8} align="center">
                <CustomAvatar avatarName={member.memberName} size={32} />
                <Button
                  type="text"
                  size="small"
                  style={{ padding: 0 }}
                  onClick={() => dispatch(toggleScheduleDrawer())}
                >
                  {member.memberName}
                </Button>
              </Flex>
              <Button
                size="small"
                type="text"
                onClick={() => handleShowProject(member.memberId)}
              >
                {showProjects === member.memberId ? (
                  <CaretDownOutlined />
                ) : (
                  <CaretRightFilled />
                )}
              </Button>
            </Flex>

            {showProjects === member.memberId &&
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
                      paddingInline: 12,
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
    </Flex>
  );
};

export default GranttMembersTable;
