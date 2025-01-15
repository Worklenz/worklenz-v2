import React, { useState } from 'react';
import { Tooltip, Typography } from 'antd';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { Project } from '../../../../types/schedule/schedule.types';
import { toggleScheduleDrawer } from '../../../../features/schedule/scheduleSlice';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

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
  // Define a unit width for 1 day (in pixels)
  const unitWidth = 80; // 1 day duration = 80 pixels, you can adjust this based on your layout

  // state to track the width of the timeline bar
  const [width, setWidth] = useState(unitWidth * projectDuration);
  const [currentDuration, setCurrentDuration] = useState(projectDuration);
  const [totalHours, setTotalHours] = useState(project.totalHours);

  // localization
  const { t } = useTranslation('schedule');

  // get theme mode details from theme reducer
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  const dispatch = useAppDispatch();

  // Handle resizing, ensuring only width changes and left side stays fixed
  const onResize = (e: any, { size, handle }: any) => {
    const newWidth = size.width;

    // Calculate the new project duration based on the width
    const newDuration = Math.round(newWidth / unitWidth);

    // Update the state with new duration and new width
    setWidth(newWidth);
    setCurrentDuration(newDuration);

    // Adjust total hours based on the new duration (assuming 'perDayHours' is constant)
    const newTotalHours = newDuration * project.perDayHours;
    setTotalHours(newTotalHours);
  };

  return (
    <Tooltip
      title={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div>
            {t('total')} {totalHours}h
          </div>
          <div>
            {t('perDay')} {project.perDayHours}h
          </div>
          <div>20 {t('tasks')}</div>
        </div>
      }
    >
      <ResizableBox
        width={width}
        height={63}
        axis="x"
        minConstraints={[unitWidth * 1, 65]} // min width: 1 day duration
        maxConstraints={[unitWidth * 30, 65]} // max width: 30 day duration
        onResize={onResize}
        handleSize={[24, 24]}
        resizeHandles={['e', 'w']} // Allow resizing from both sides
        style={{
          position: 'absolute',
          left: 0,
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
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '4px 10px',
          zIndex: 99,
          cursor: 'pointer',
        }}
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
          }}
          ellipsis={{ expanded: false }}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(toggleScheduleDrawer());
          }}
        >
          20 {t('tasks')}
        </Typography.Text>
      </ResizableBox>
    </Tooltip>
  );
};

export default ProjectTimelineBar;
