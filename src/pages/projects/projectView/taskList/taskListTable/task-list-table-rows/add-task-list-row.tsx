import { Input, InputRef, theme } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { useAppSelector } from '../../../../../../hooks/useAppSelector';
import { colors } from '../../../../../../styles/colors';
import { useTranslation } from 'react-i18next';
import { addTask } from '@/features/project/project.slice';
import { SocketEvents } from '@/shared/socket-events';
import { IProjectTask } from '@/types/project/projectTasksViewModel.types';
import { reset } from 'mixpanel-browser';
import { DRAWER_ANIMATION_INTERVAL } from '@/shared/constants';
import { getCurrentGroup, GROUP_BY_STATUS_VALUE, GROUP_BY_PRIORITY_VALUE, GROUP_BY_PHASE_VALUE } from '@/features/tasks/tasks.slice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useSocket } from '@/socket/socketContext';
import { ITaskCreateRequest } from '@/types/tasks/task-create-request.types';
import { ILocalSession } from '@/types/auth/local-session.types';
import { useAuthService } from '@/hooks/useAuth';

interface IAddTaskListRowProps {
  groupId?: string | null;
  parentTask?: string | null;
}

interface IAddNewTask extends IProjectTask {
  groupId: string;
}

const AddTaskListRow = ({
  groupId = null,
  parentTask = null,
}: IAddTaskListRowProps) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [taskName, setTaskName] = useState<string>('');
  const [creatingTask, setCreatingTask] = useState<boolean>(false);
  const taskInputRef = useRef<InputRef>(null);
  const dispatch = useAppDispatch();
  const currentSession = useAuthService().getCurrentSession();

  const { socket } = useSocket();
  const { token } = theme.useToken();

  const { t } = useTranslation('task-list-table');

  const themeMode = useAppSelector(state => state.themeReducer.mode);
  const customBorderColor = useMemo(() => themeMode === 'dark' && ' border-[#303030]', [themeMode]);
  const projectId = useAppSelector(state => state.projectReducer.projectId);

  const createRequestBody = (): ITaskCreateRequest | null => {
    if (!projectId || !currentSession) return null;
    const body: ITaskCreateRequest = {
      project_id: projectId,
      name: taskName,
      reporter_id: currentSession.id,
      team_id: currentSession.team_id,
    };

    const groupBy = getCurrentGroup();
    if (groupBy.value === GROUP_BY_STATUS_VALUE) {
      body.status_id = groupId || undefined;
    } else if (groupBy.value === GROUP_BY_PRIORITY_VALUE) {
      body.priority_id = groupId || undefined;
    } else if (groupBy.value === GROUP_BY_PHASE_VALUE) {
      body.phase_id = groupId || undefined;
    }

    if (parentTask) {
      body.parent_task_id = parentTask;
    }
    console.log('createRequestBody', body);

    return body;
  };

  const reset = (scroll = true) => {
    setIsEdit(false);

    setCreatingTask(false);

    setTaskName('');
    setIsEdit(true);

    setTimeout(() => {
      taskInputRef.current?.focus();
      if (scroll) window.scrollTo(0, document.body.scrollHeight);
    }, DRAWER_ANIMATION_INTERVAL); // wait for the animation end
  };
  
  const onNewTaskReceived = (task: IAddNewTask) => {
    if (!groupId) return;
    console.log('onNewTaskReceived', task);
    task.groupId = groupId;
    if (groupId && task.id) {
      dispatch(addTask(task));
      reset(false);
      // if (this.map.has(task.id)) return;

      // this.service.addTask(task, this.groupId);
      // this.reset(false);
    }
  };
  
  const addInstantTask = () => {
    if (creatingTask) return;
    console.log('addInstantTask', projectId, taskName.trim());
    if (!projectId || !currentSession || taskName.trim() === '') return;

    try {
      setCreatingTask(true);
      const body = createRequestBody();
      if (!body) return;
      socket?.emit(SocketEvents.QUICK_TASK.toString(), JSON.stringify(body));
      socket?.once(SocketEvents.QUICK_TASK.toString(), (task: IProjectTask) => {
        setCreatingTask(false);
        if (task.parent_task_id) {
        }
        onNewTaskReceived(task as IAddNewTask);
      });
    } catch (error) {
      console.error(error);
    } finally {
      setCreatingTask(false);
    }
  };

  const handleAddTask = () => {
    setIsEdit(false);
    addInstantTask();
  };

  return (
    <div className={`border-t ${customBorderColor}`}>
      {isEdit ? (
        <Input
          className="h-12 w-full rounded-none"
          style={{ borderColor: colors.skyBlue }}
          placeholder={t('addTaskInputPlaceholder')}
          onChange={e => setTaskName(e.target.value)}
          onBlur={handleAddTask}
          onPressEnter={handleAddTask}
          ref={taskInputRef}
        />
      ) : (
        <Input
          onFocus={() => setIsEdit(true)}
          className="w-[300px] border-none"
          value={t('addTaskText')}
          ref={taskInputRef}
        />
      )}
    </div>
  );
};

export default AddTaskListRow;
