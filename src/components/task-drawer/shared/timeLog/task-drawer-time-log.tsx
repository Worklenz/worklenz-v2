import { DownloadOutlined, PlayCircleFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Flex, Skeleton, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { TFunction } from 'i18next';

import EmptyListPlaceholder from '@/components/EmptyListPlaceholder';
import { themeWiseColor } from '@/utils/themeWiseColor';
import { useAppSelector } from '@/hooks/useAppSelector';
import TimeLogForm from './time-log-form';
import TimeLogList from './time-log-list';
import { taskTimeLogsApiService } from '@/api/tasks/task-time-logs.api.service';
import { ITaskLogViewModel } from '@/types/tasks/task-log-view.types';
import TaskTimer from '@/components/taskListCommon/task-timer/task-timer';
import { useTaskTimer } from '@/hooks/useTaskTimer';

interface TaskDrawerTimeLogProps {
  t: TFunction;
}

const TaskDrawerTimeLog = ({ t }: TaskDrawerTimeLogProps) => {
  const [timeLoggedList, setTimeLoggedList] = useState<ITaskLogViewModel[]>([]);
  const [totalTimeText, setTotalTimeText] = useState<string>('0m 0s');
  const [loading, setLoading] = useState<boolean>(false);
  const [isAddTimelogFormShow, setIsTimeLogFormShow] = useState<boolean>(false);

  const themeMode = useAppSelector(state => state.themeReducer.mode);
  const { selectedTaskId, taskFormViewModel } = useAppSelector(state => state.taskDrawerReducer);

  const { started, timeString, handleStartTimer, handleStopTimer } = useTaskTimer(
    selectedTaskId || '',
    taskFormViewModel?.task?.timer_start_time || null
  );

  const buildTotalTimeText = (timeLoggedList: ITaskLogViewModel[]) => {
    let totalLogged = 0;
    for (const element of timeLoggedList) {
      const timeSpentInSeconds = Number(element.time_spent || '0');
      const minutes = Math.floor(timeSpentInSeconds / 60);
      const seconds = timeSpentInSeconds % 60;
      element.time_spent_text = `${minutes}m ${seconds}s`;
      totalLogged += timeSpentInSeconds;
    }
    const totalMinutes = Math.floor(totalLogged / 60);
    const totalSeconds = totalLogged % 60;
    setTotalTimeText(`${totalMinutes}m ${totalSeconds}s`);
  };

  const fetchTimeLoggedList = async () => {
    if (!selectedTaskId) return;
    try {
      setLoading(true);
      const res = await taskTimeLogsApiService.getByTask(selectedTaskId);
      if (res.done) {
        buildTotalTimeText(res.body);
        setTimeLoggedList(res.body);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimerStop = async () => {
    handleStopTimer();
    await fetchTimeLoggedList();
  };

  useEffect(() => {
    fetchTimeLoggedList();
  }, [selectedTaskId]);

  return (
    <Flex vertical justify="space-between" style={{ width: '100%', height: '78vh' }}>
      <Flex vertical>
        <Flex align="center" justify="space-between" style={{ width: '100%' }}>
          <Typography.Text type="secondary">{t('taskTimeLogTab.totalLogged')}: {totalTimeText}</Typography.Text>
          <Flex gap={8} align="center">
            <TaskTimer
              started={started}
              handleStartTimer={handleStartTimer}
              handleStopTimer={handleTimerStop}
              timeString={timeString}
              timeTrackingLogCard={<div>Time Tracking Log</div>}
            />
            <Button size="small" icon={<DownloadOutlined />}>
              {t('taskTimeLogTab.exportToExcel')}
            </Button>
          </Flex>
        </Flex>
        <Divider style={{ marginBlock: 8 }} />
        {timeLoggedList.length > 0 ? (
          <Skeleton active loading={loading}>
            <TimeLogList timeLoggedList={timeLoggedList} />
          </Skeleton>
        ) : (
          <Flex vertical gap={8} align="center">
            <EmptyListPlaceholder text={t('taskTimeLogTab.noTimeLogsFound')} imageHeight={120} />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ width: 'fit-content' }}
              onClick={() => setIsTimeLogFormShow(true)}
            >
              {t('taskTimeLogTab.addTimeLog')}
            </Button>
          </Flex>
        )}
      </Flex>

      {!isAddTimelogFormShow && timeLoggedList.length > 0 && (
        <Flex
          gap={8}
          vertical
          align="center"
          justify="center"
          style={{
            width: '100%',
            position: 'relative',
            height: 'fit-content',
            justifySelf: 'flex-end',
            paddingBlockStart: 24,
          }}
        >
          <div
            style={{
              marginBlockEnd: 0,
              height: 1,
              position: 'absolute',
              top: 0,
              width: '120%',
              backgroundColor: themeWiseColor('#ebebeb', '#3a3a3a', themeMode),
            }}
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ width: '100%' }}
            onClick={() => setIsTimeLogFormShow(true)}
          >
            Add Timelog
          </Button>
        </Flex>
      )}

      {isAddTimelogFormShow && <TimeLogForm onCancel={() => setIsTimeLogFormShow(false)} />}
    </Flex>
  );
};

export default TaskDrawerTimeLog;
