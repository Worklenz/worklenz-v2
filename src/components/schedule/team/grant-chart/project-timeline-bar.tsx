import React, { useState } from 'react';
import { Flex, Popover, Typography } from 'antd';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { Project } from '../../../../types/schedule/schedule.types';
import { toggleScheduleDrawer } from '../../../../features/schedule/scheduleSlice';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import ProjectTimelineModal from '../../../../features/schedule/ProjectTimelineModal';

type ProjectTimelineBarProps = {
  project: Project;
  startOffset: number;
  projectDuration: number;
};

const ProjectTimelineBar = ({
  project,
  startOffset,
  projectDuration,
}: ProjectTimelineBarProps) => {
  const unitWidth = 77;

  // state to track the width of the timeline bar
  const [width, setWidth] = useState(unitWidth * projectDuration);
  const [currentDuration, setCurrentDuration] = useState(projectDuration);
  const [totalHours, setTotalHours] = useState(project.totalHours);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // localization
  const { t } = useTranslation('schedule');

  // get theme mode details from theme reducer
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  const dispatch = useAppDispatch();

  // handle resizing, ensuring only width changes and left side stays fixed
  const onResize = (e: any, { size, handle }: any) => {
    const newWidth = size.width;

    // calculate the new project duration based on the width
    const newDuration = Math.round(newWidth / unitWidth);

    // update the state with new duration and new width
    setWidth(newWidth);
    setCurrentDuration(newDuration);

    // adjust total hours based on the new duration (assuming 'perDayHours' is constant)
    const newTotalHours = newDuration * project.perDayHours;
    setTotalHours(newTotalHours);
  };

  return (
    <Popover
      content={<ProjectTimelineModal setIsModalOpen={setIsModalOpen} />}
      trigger={'click'}
      open={isModalOpen}
    >
      <ResizableBox
        width={width}
        height={63}
        axis="x"
        minConstraints={[unitWidth * 1, 65]}
        onResize={onResize}
        handleSize={[24, 24]}
        resizeHandles={['e', 'w', 'sw', 'ne', 'nw', 'se']}
        style={{
          position: 'absolute',
          left: 0,
          marginInlineStart: startOffset * unitWidth,
          gridColumnStart: startOffset + 1,
          gridColumnEnd: startOffset + currentDuration + 1,
          backgroundColor:
            themeMode === 'dark'
              ? 'rgba(0, 142, 204, 0.5)'
              : 'rgba(240, 248, 255, 1)',
          borderRadius: '5px',
          border:
            themeMode === 'dark'
              ? '1px solid rgba(24, 144, 255, 1)'
              : '1px solid rgba(149, 197, 248, 1)',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '4px 10px',
          zIndex: 99,
          cursor: 'pointer',
        }}
      >
        <Flex
          vertical
          align="center"
          justify="center"
          style={{ width: '100%' }}
          onClick={() => setIsModalOpen(true)}
        >
          <Typography.Text
            style={{
              fontSize: '12px',
              fontWeight: 'bold',
            }}
            ellipsis={{ expanded: false }}
          >
            {t('total')} {totalHours}h
          </Typography.Text>
          {currentDuration > 1 && (
            <Typography.Text
              style={{ fontSize: '10px' }}
              ellipsis={{ expanded: false }}
            >
              {t('perDay')} {project.perDayHours}h
            </Typography.Text>
          )}
          <Typography.Text
            style={{
              fontSize: '10px',
              textDecoration: 'underline',
              width: 'fit-content',
            }}
            ellipsis={{ expanded: false }}
            onClick={(e) => {
              e.stopPropagation();
              dispatch(toggleScheduleDrawer());
            }}
          >
            20 {t('tasks')}
          </Typography.Text>
        </Flex>
      </ResizableBox>
    </Popover>
  );
};

export default React.memo(ProjectTimelineBar);
