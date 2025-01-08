import { Badge, Flex, Select } from 'antd';
import './statusDropdown.css';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useTranslation } from 'react-i18next';
import { ITaskStatus } from '@/types/status.types';
import { useState, useEffect, useMemo } from 'react';
import { ALPHA_CHANNEL } from '@/shared/constants';
import { useSocket } from '@/socket/socketContext';
import { SocketEvents } from '@/shared/socket-events';
import { ITaskListStatusChangeResponse } from '@/types/tasks/task-list-status.component';
import { IProjectTask } from '@/types/project/projectTasksViewModel.types';
import { getCurrentGroup, GROUP_BY_STATUS_VALUE } from '@/features/tasks/taskSlice';

type StatusDropdownProps = {
  statusList: ITaskStatus[];
  task: IProjectTask;
  teamId: string;
  onChange: (value: string) => void;
};

const StatusDropdown = ({ statusList, task, teamId, onChange }: StatusDropdownProps) => {
  const { t } = useTranslation('task-list-table');
  const { socket, connected } = useSocket();

  const [selectedStatus, setSelectedStatus] = useState<ITaskStatus | undefined>(undefined);

  const themeMode = useAppSelector(state => state.themeReducer.mode);

  const handleStatusChange = (statusId: string) => {
    if (!task.id || !statusId) return;

    socket?.emit(SocketEvents.TASK_STATUS_CHANGE.toString(), JSON.stringify({
      task_id: task.id,
      status_id: statusId,
      parent_task: task.parent_task_id || null,
      team_id: teamId
    }));

    getTaskProgress(task.id);
  };

  const handleTaskStatusChange = (response: ITaskListStatusChangeResponse) => {
    if (response && response.id === task.id) {

      task.status_color = response.color_code;
      task.complete_ratio = +response.complete_ratio || 0;
      task.status = response.status_id;
      task.status_category = response.statusCategory;

      // if (isGroupByStatus()) {
      //   if (!task.is_sub_task) {
      //     this.service.updateTaskGroup(task, false);
      //   }
      //   if (this.service.isSubtasksIncluded) {
      //     this.service.emitRefreshSubtasksIncluded();
      //   }
      // }

      // this.service.emitUpdateGroupProgress(this.task.id);
      // this.kanbanService.emitRefreshGroups();
    }
  }

  const isGroupByStatus = () => {
    return getCurrentGroup().value === GROUP_BY_STATUS_VALUE;
  }

  const getTaskProgress = (taskId: string) => {
    socket?.emit(SocketEvents.GET_TASK_PROGRESS.toString(), taskId);
  }

  useEffect(() => {
    const foundStatus = statusList.find(status => status.id === task.status);
    setSelectedStatus(foundStatus);
  }, [task.status, statusList]);

  useEffect(() => {
    socket?.on(SocketEvents.TASK_STATUS_CHANGE.toString(), handleTaskStatusChange);

    return () => {
      socket?.removeListener(SocketEvents.TASK_STATUS_CHANGE.toString(), handleTaskStatusChange);
    };
  }, [task.status, connected]);

  const options = useMemo(() => statusList.map(status => ({
    value: status.id,
    label: (
      <Flex gap={8} align="center">
        <Badge color={status.color_code} text={status.name} />
      </Flex>
    ),
  })), [statusList]);

  return (
    <>
      {task.status && (
        <Select
          variant='borderless'
          value={task.status}
          onChange={handleStatusChange}
          dropdownStyle={{ borderRadius: 8, minWidth: 150, maxWidth: 200 }}
          style={{ backgroundColor: selectedStatus?.color_code + ALPHA_CHANNEL, borderRadius: 16, height: 22 }}
          labelRender={(value) => {
            const status = statusList.find(status => status.id === value.value);
            return status ? <span style={{ fontSize: 13 }}>{status.name}</span> : '';
          }}
          options={options}
        />
      )}
    </>
  );
};

export default StatusDropdown;
