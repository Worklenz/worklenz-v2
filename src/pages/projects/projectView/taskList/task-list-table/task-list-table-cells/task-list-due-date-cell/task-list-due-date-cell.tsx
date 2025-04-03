import { DatePicker } from 'antd';
import { colors } from '@/styles/colors';
import dayjs, { Dayjs } from 'dayjs';
import { useSocket } from '@/socket/socketContext';
import { SocketEvents } from '@/shared/socket-events';
import { IProjectTask } from '@/types/project/projectTasksViewModel.types';
import { getUserSession } from '@/utils/session-helper';
import logger from '@/utils/errorLogger';
import { useMemo, useCallback } from 'react';
import React from 'react';

const TaskListDueDateCell = ({ task }: { task: IProjectTask }) => {
  const { socket } = useSocket();
  
  // Memoize date values to prevent recalculation on every render
  const dueDayjs = useMemo(() => 
    task.end_date ? dayjs(task.end_date) : null
  , [task.end_date]);
  
  const startDayjs = useMemo(() => 
    task.start_date ? dayjs(task.start_date) : null
  , [task.start_date]);

  // Memoize callback functions to prevent new function creation on each render
  const handleEndDateChange = useCallback((date: Dayjs | null) => {
    try {
      socket?.emit(
        SocketEvents.TASK_END_DATE_CHANGE.toString(),
        JSON.stringify({
          task_id: task.id,
          end_date: date?.format('YYYY-MM-DD'),
          parent_task: task.parent_task_id,
          time_zone: getUserSession()?.timezone_name
            ? getUserSession()?.timezone_name
            : Intl.DateTimeFormat().resolvedOptions().timeZone,
        })
      );
    } catch (error) {
      logger.error('Failed to update due date:', error);
    }
  }, [socket, task.id, task.parent_task_id]);

  // Memoize the disabled date function
  const disabledEndDate = useCallback((current: Dayjs) => {
    return current && startDayjs ? current < startDayjs : false;
  }, [startDayjs]);

  return (
    <DatePicker
      placeholder="Set Date"
      value={dueDayjs}
      format={'MMM DD, YYYY'}
      suffixIcon={null}
      onChange={handleEndDateChange}
      disabledDate={disabledEndDate}
      style={{
        backgroundColor: colors.transparent,
        border: 'none',
        boxShadow: 'none',
      }}
    />
  );
};

// Wrap the component with React.memo to prevent rerenders when props don't change
export default React.memo(TaskListDueDateCell);
