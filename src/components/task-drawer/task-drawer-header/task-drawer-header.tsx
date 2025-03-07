import { Button, Dropdown, Flex, Input, InputRef, MenuProps } from 'antd';
import React, { ChangeEvent, useEffect, useState, useTransition } from 'react';
import { EllipsisOutlined } from '@ant-design/icons';
import { TFunction } from 'i18next';

import './task-drawer-header.css';

import { useAppSelector } from '@/hooks/useAppSelector';
import { useAuthService } from '@/hooks/useAuth';
import TaskDrawerStatusDropdown from '../task-drawer-status-dropdown/task-drawer-status-dropdown';
import { tasksApiService } from '@/api/tasks/tasks.api.service';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setSelectedTaskId, setShowTaskDrawer } from '@/features/task-drawer/task-drawer.slice';
import { useSocket } from '@/socket/socketContext';
import { SocketEvents } from '@/shared/socket-events';

type TaskDrawerHeaderProps = {
  inputRef: React.RefObject<InputRef | null>;
  t: TFunction;
};

const TaskDrawerHeader = ({ inputRef, t }: TaskDrawerHeaderProps) => {
  const dispatch = useAppDispatch();
  const { socket, connected } = useSocket();

  const { taskFormViewModel, selectedTaskId } = useAppSelector(state => state.taskDrawerReducer);
  const [taskName, setTaskName] = useState<string>(taskFormViewModel?.task?.name ?? '');
  const currentSession = useAuthService().getCurrentSession();

  useEffect(() => {
    setTaskName(taskFormViewModel?.task?.name ?? '');
  }, [taskFormViewModel?.task?.name]);

  const onTaskNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTaskName(e.currentTarget.value);
  };

  const handleDeleteTask = async () => {
    if (!selectedTaskId) return;
    const res = await tasksApiService.deleteTask(selectedTaskId);
    if (res.done) {
      dispatch(setShowTaskDrawer(false));
      dispatch(setSelectedTaskId(null));
    }
  };

  const deletTaskDropdownItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Flex gap={8} align="center">
          <Button type="text" danger onClick={handleDeleteTask}>
            {t('taskHeader.deleteTask')}
          </Button>
        </Flex>
      ),
    },
  ];

  const handleInputBlur = () => {
    if (
      !selectedTaskId ||
      !connected ||
      taskName === taskFormViewModel?.task?.name ||
      taskName === undefined ||
      taskName === null ||
      taskName === ''
    )
      return;
    socket?.emit(
      SocketEvents.TASK_NAME_CHANGE.toString(),
      JSON.stringify({
        task_id: selectedTaskId,
        name: taskName,
        parent_task: taskFormViewModel?.task?.parent_task_id,
      })
    );
  };

  return (
    <Flex gap={12} align="center" style={{ marginBlockEnd: 6 }}>
      <Flex style={{ position: 'relative', width: '100%' }}>
        <Input
          ref={inputRef}
          size="large"
          value={taskName}
          onChange={e => onTaskNameChange(e)}
          onBlur={handleInputBlur}
          placeholder={t('taskHeader.taskNamePlaceholder')}
          className="task-name-input"
          style={{ 
            width: '100%', 
            border: 'none',
          }}
          showCount={false}
          maxLength={250}
        />
      </Flex>

      <TaskDrawerStatusDropdown
        statuses={taskFormViewModel?.statuses ?? []}
        task={taskFormViewModel?.task ?? {}}
        teamId={currentSession?.team_id ?? ''}
      />

      <Dropdown overlayClassName={'delete-task-dropdown'} menu={{ items: deletTaskDropdownItems }}>
        <Button type="text" icon={<EllipsisOutlined />} />
      </Dropdown>
    </Flex>
  );
};

export default TaskDrawerHeader;
