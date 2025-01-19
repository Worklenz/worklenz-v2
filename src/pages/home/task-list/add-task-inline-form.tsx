import { Alert, Flex, Form, Input, InputRef, Select, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { nanoid } from '@reduxjs/toolkit';
import { TaskType } from '@/types/task.types';
import { addTask } from '@features/tasks/tasks.slice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { TFunction } from 'i18next';
import {
  useGetMyTasksQuery,
  useGetProjectsByTeamQuery,
} from '@/api/home-page/home-page.api.service';
import { IProject } from '@/types/project/project.types';
import { IHomeTaskCreateRequest } from '@/types/tasks/task-create-request.types';
import { useAuthService } from '@/hooks/useAuth';
import { useSocketService } from '@/hooks/useSocketService';
import { SocketEvents } from '@/shared/socket-events';
import { IMyTask } from '@/types/home/my-tasks.types';
import { useSocket } from '@/socket/socketContext';
import { ITaskAssigneesUpdateResponse } from '@/types/tasks/task-assignee-update-response';

interface AddTaskInlineFormProps {
  t: TFunction;
}

const AddTaskInlineForm = ({ t }: AddTaskInlineFormProps) => {
  const [isAlertShowing, setIsAlertShowing] = useState(false);
  const [isDueDateFieldShowing, setIsDueDateFieldShowing] = useState(false);
  const [isProjectFieldShowing, setIsProjectFieldShowing] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const currentSession = useAuthService().getCurrentSession();
  const { socket } = useSocket();

  const { data: projectListData, isFetching: projectListFetching } = useGetProjectsByTeamQuery();
  const { homeTasksConfig } = useAppSelector(state => state.homePageReducer);
  const { refetch } = useGetMyTasksQuery(homeTasksConfig);

  const taskInputRef = useRef<InputRef | null>(null);

  const dueDateOptions = [
    {
      value: 'Today',
      label: t('home:tasks.today'),
    },
    {
      value: 'Tomorrow',
      label: t('home:tasks.tomorrow'),
    },
    {
      value: 'Next Week',
      label: t('home:tasks.nextWeek'),
    },
    {
      value: 'Next Month',
      label: t('home:tasks.nextMonth'),
    },
    {
      value: 'No Due Date',
      label: t('home:tasks.noDueDate'),
    },
  ];

  const calculateEndDate = (dueDate: string): Date | undefined => {
    const today = new Date();
    switch (dueDate) {
      case 'Today':
        return today;
      case 'Tomorrow':
        return new Date(today.setDate(today.getDate() + 1));
      case 'Next Week':
        return new Date(today.setDate(today.getDate() + 7));
      case 'Next Month':
        return new Date(today.setMonth(today.getMonth() + 1));
      default:
        return undefined;
    }
  };

  const projectOptions = [
    ...(projectListData?.body?.map((project: IProject) => ({
      key: project.id,
      value: project.id,
      label: project.name,
    })) || []),
  ];

  const handleTaskSubmit = (values: { name: string; project: string; dueDate: string }) => {
    const newTask: IHomeTaskCreateRequest = {
      id: nanoid(),
      name: values.name,
      project_id: values.project,
      reporter_id: currentSession?.id,
      team_id: currentSession?.team_id,
      end_date: calculateEndDate(values.dueDate),
    };

    socket?.emit(SocketEvents.QUICK_TASK.toString(), JSON.stringify(newTask));
    socket?.on(SocketEvents.QUICK_TASK.toString(), (task: IMyTask) => {
      const taskBody = {
        team_member_id: currentSession?.team_member_id,
        project_id: task.project_id,
        task_id: task.id,
        reporter_id: currentSession?.id,
        mode: 0,
      };
      socket?.emit(SocketEvents.QUICK_ASSIGNEES_UPDATE.toString(), JSON.stringify(taskBody));
      socket?.once(
        SocketEvents.QUICK_ASSIGNEES_UPDATE.toString(),
        (response: ITaskAssigneesUpdateResponse) => {
          refetch();
        }
      );
    });

    setTimeout(() => {
      if (taskInputRef.current) {
        taskInputRef.current.focus({
          cursor: 'start',
        });
      }

      setIsDueDateFieldShowing(false);
      setIsProjectFieldShowing(false);
    }, 100);
  };

  useEffect(() => {
    return () => {
      socket?.off(SocketEvents.QUICK_TASK.toString());
      socket?.off(SocketEvents.QUICK_ASSIGNEES_UPDATE.toString());
    };
  }, []);

  return (
    <Form
      form={form}
      onFinish={handleTaskSubmit}
      style={{ display: 'flex', gap: 8 }}
      initialValues={{
        dueDate: 'No Due Date',
        project: projectOptions[0]?.value,
      }}
    >
      <Form.Item
        name="name"
        style={{ width: '100%', maxWidth: 400 }}
        rules={[
          {
            required: true,
            message: 'Please add a task',
          },
        ]}
      >
        <Flex vertical gap={4}>
          <Input
            ref={taskInputRef}
            placeholder={t('home:tasks.addTask')}
            style={{ width: '100%' }}
            onChange={e => {
              const inputValue = e.currentTarget.value;
              if (inputValue.length >= 1) setIsAlertShowing(true);
              else if (inputValue === '') setIsAlertShowing(false);
            }}
            onKeyDown={e => {
              const inputValue = e.currentTarget.value;
              if (inputValue.trim() === '') return;
              if (e.key === 'Tab' || e.key === 'Enter') {
                setIsAlertShowing(false);
                setIsDueDateFieldShowing(true);
              }
            }}
          />
          {isAlertShowing && (
            <Alert
              message={
                <Typography.Text style={{ fontSize: 11 }}>
                  {t('home:tasks.pressTabToSelectDueDateAndProject')}
                </Typography.Text>
              }
              type="info"
              style={{
                width: 'fit-content',
                borderRadius: 2,
                padding: '0 6px',
              }}
            />
          )}
        </Flex>
      </Form.Item>

      <Form.Item name="dueDate" style={{ width: '100%', maxWidth: 200 }}>
        {isDueDateFieldShowing && (
          <Select
            suffixIcon={null}
            options={dueDateOptions}
            defaultOpen
            onKeyDown={e => {
              if (e.key === 'Tab' || 'Enter') {
                setIsProjectFieldShowing(true);
              }
            }}
          />
        )}
      </Form.Item>

      <Form.Item
        name="project"
        style={{ width: '100%', maxWidth: 200 }}
        rules={[
          {
            required: true,
            message: t('home:tasks.projectRequired'),
          },
        ]}
      >
        {isProjectFieldShowing && (
          <Select
            suffixIcon={null}
            placeholder={'Project'}
            options={projectOptions}
            defaultOpen
            autoFocus
            showSearch
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '')
                .toLowerCase()
                .localeCompare((optionB?.label ?? '').toLowerCase())
            }
            onKeyDown={e => {
              if (e.key === 'Enter') {
                form.submit();
              }
            }}
          />
        )}
      </Form.Item>
    </Form>
  );
};

export default AddTaskInlineForm;
