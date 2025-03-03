import { SocketEvents } from '@/shared/socket-events';
import { useSocket } from '@/socket/socketContext';
import { colors } from '@/styles/colors';
import { ITaskViewModel } from '@/types/tasks/task.types';
import { Flex, Form, FormInstance, InputNumber, Typography } from 'antd';
import { TFunction } from 'i18next';
import { useState } from 'react';

interface TaskDrawerEstimationProps {
  t: TFunction;
  task: ITaskViewModel;
  form: FormInstance<any>;
}

const TaskDrawerEstimation = ({ t, task, form }: TaskDrawerEstimationProps) => {
  const { socket, connected } = useSocket();
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const handleTimeEstimationBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!connected || !task.id) return;
    socket?.emit(
      SocketEvents.TASK_TIME_ESTIMATION_CHANGE.toString(),
      JSON.stringify({
        task_id: task.id,
        total_hours: hours,
        total_minutes: minutes,
        parent_task: task.parent_task_id,
      })
    );
  };

  return (
    <Form.Item name="timeEstimation" label={t('details.time-estimation')}>
      <Flex gap={8}>
        <Form.Item
          name={'hours'}
          label={
            <Typography.Text style={{ color: colors.lightGray, fontSize: 12 }}>
              {t(`details.hours`)}
            </Typography.Text>
          }
          style={{ marginBottom: 36 }}
          labelCol={{ style: { paddingBlock: 0 } }}
          layout="vertical"
        >
          <InputNumber
            min={0}
            max={24}
            placeholder={t('details.hours')}
            onBlur={handleTimeEstimationBlur}
            onChange={value => setHours(value || 0)}
          />
        </Form.Item>
        <Form.Item
          name={'minutes'}
          label={
            <Typography.Text style={{ color: colors.lightGray, fontSize: 12 }}>
              {t(`details.minutes`)}
            </Typography.Text>
          }
          style={{ marginBottom: 36 }}
          labelCol={{ style: { paddingBlock: 0 } }}
          layout="vertical"
        >
          <InputNumber
            min={0}
            max={60}
            placeholder={t('details.minutes')}
            onBlur={handleTimeEstimationBlur}
            onChange={value => setMinutes(value || 0)}
          />
        </Form.Item>
      </Flex>
    </Form.Item>
  );
};

export default TaskDrawerEstimation;
