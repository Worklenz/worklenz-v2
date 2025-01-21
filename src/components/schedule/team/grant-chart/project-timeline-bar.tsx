import React, { useState } from 'react';
import { Flex, Popover, Typography } from 'antd';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { Project } from '../../../../types/schedule/schedule.types';
import { toggleScheduleDrawer } from '../../../../features/schedule/scheduleSlice';
import ProjectTimelineModal from '../../../../features/schedule/ProjectTimelineModal';
import { Resizable } from 're-resizable';
import { themeWiseColor } from '../../../../utils/themeWiseColor';
import { MoreOutlined } from '@ant-design/icons';
import { CELL_WIDTH } from './grantt-chart';

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
  const [width, setWidth] = useState(CELL_WIDTH * projectDuration);
  const [currentDuration, setCurrentDuration] = useState(projectDuration);
  const [totalHours, setTotalHours] = useState(project.totalHours);
  const [leftOffset, setLeftOffset] = useState(startOffset);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { t } = useTranslation('schedule');
  const themeMode = useAppSelector((state) => state.themeReducer.mode);
  const dispatch = useAppDispatch();

  const handleResizeStop = (
    event: MouseEvent | TouchEvent,
    direction: string,
    ref: HTMLElement,
    delta: { width: number; height: number }
  ) => {
    const newWidth = width + delta.width;

    if (direction === 'right') {
      // Handle resizing from the right
      if (delta.width > 0) {
        // Dragging right handle to the right (increase width)
        const newDuration = Math.round(newWidth / CELL_WIDTH);
        setWidth(newWidth);
        setCurrentDuration(newDuration);
        setTotalHours(newDuration * project.perDayHours);
      } else if (delta.width < 0) {
        // Dragging right handle to the left (decrease width)
        const newDuration = Math.round(newWidth / CELL_WIDTH);
        setWidth(newWidth);
        setCurrentDuration(newDuration);
        setTotalHours(newDuration * project.perDayHours);
      }
    } else if (direction === 'left') {
      // Handle resizing from the left
      if (delta.width < 0) {
        // Dragging left handle to the left (increase width)
        const newLeftOffset = leftOffset + delta.width;
        const newDuration = Math.round(newWidth / CELL_WIDTH);

        setLeftOffset(newLeftOffset);
        setWidth(newWidth);
        setCurrentDuration(newDuration);
        setTotalHours(newDuration * project.perDayHours);
      } else if (delta.width > 0) {
        // Dragging left handle to the right (decrease width)
        const newLeftOffset = leftOffset + delta.width;
        const newDuration = Math.round(newWidth / CELL_WIDTH);

        setLeftOffset(newLeftOffset);
        setWidth(newWidth);
        setCurrentDuration(newDuration);
        setTotalHours(newDuration * project.perDayHours);
      }
    }
  };

  return (
    <Popover
      content={<ProjectTimelineModal setIsModalOpen={setIsModalOpen} />}
      trigger={'click'}
      open={isModalOpen}
    >
      <Resizable
        size={{ width, height: 56 }}
        onResizeStop={handleResizeStop}
        minWidth={CELL_WIDTH}
        maxWidth={CELL_WIDTH * 30}
        grid={[CELL_WIDTH, 1]}
        enable={{
          top: false,
          right: true,
          bottom: false,
          left: true,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
        handleComponent={{
          right: <MoreOutlined style={{ fontSize: 24, color: 'white' }} />,
          left: <MoreOutlined style={{ fontSize: 24, color: 'white' }} />,
        }}
        handleClasses={{
          right:
            'hidden group-hover:flex -translate-x-[5px] bg-[#1890ff] px-1 justify-center rounded-tr rounded-br',
          left: 'hidden group-hover:flex translate-x-[5px] bg-[#1890ff] px-1 justify-center rounded-tl rounded-bl',
        }}
        className="group hover:shadow-md"
        style={{
          position: 'absolute',
          marginInlineStart: leftOffset,
          gridColumnStart: Math.floor(leftOffset / CELL_WIDTH) + 1,
          gridColumnEnd:
            Math.floor(leftOffset / CELL_WIDTH) + currentDuration + 1,
          backgroundColor: themeWiseColor(
            'rgba(240, 248, 255, 1)',
            'rgba(0, 142, 204, 0.5)',
            themeMode
          ),
          borderRadius: '5px',
          border: `1px solid ${themeWiseColor(
            'rgba(149, 197, 248, 1)',
            'rgba(24, 144, 255, 1)',
            themeMode
          )}`,
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
      </Resizable>
    </Popover>
  );
};

export default React.memo(ProjectTimelineBar);
