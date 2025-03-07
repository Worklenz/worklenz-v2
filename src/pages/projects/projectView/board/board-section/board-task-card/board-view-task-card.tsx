import { useState } from 'react';
import {
  Tooltip,
  Tag,
  Progress,
  Typography,
  Dropdown,
  MenuProps,
  Button,
  Flex,
  List,
  Divider,
  Popconfirm,
} from 'antd';
import {
  DoubleRightOutlined,
  PauseOutlined,
  UserAddOutlined,
  InboxOutlined,
  DeleteOutlined,
  MinusOutlined,
  ForkOutlined,
  CaretRightFilled,
  CaretDownFilled,
  ExclamationCircleFilled,
  PlusOutlined,
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { themeWiseColor } from '@/utils/themeWiseColor';
import BoardSubTaskCard from '../board-sub-task-card/board-sub-task-card';
import CustomAvatarGroup from '@/components/board/custom-avatar-group';
import CustomDueDatePicker from '@/components/board/custom-due-date-picker';
import { colors } from '@/styles/colors';
import { deleteBoardTask, updateBoardTaskAssignee } from '@features/board/board-slice';
import BoardCreateSubtaskCard from '../board-sub-task-card/board-create-sub-task-card';
import { setShowTaskDrawer, setSelectedTaskId } from '@/features/task-drawer/task-drawer.slice';
import { IProjectTask } from '@/types/project/projectTasksViewModel.types';
import { IBulkAssignRequest } from '@/types/tasks/bulk-action-bar.types';
import { taskListBulkActionsApiService } from '@/api/tasks/task-list-bulk-actions.api.service';
import { useMixpanelTracking } from '@/hooks/useMixpanelTracking';
import {
  evt_project_task_list_context_menu_archive,
  evt_project_task_list_context_menu_assign_me,
  evt_project_task_list_context_menu_delete,
} from '@/shared/worklenz-analytics-events';

const BoardViewTaskCard = ({ task, sectionId }: { task: IProjectTask; sectionId: string }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('kanban-board');
  const { trackMixpanelEvent } = useMixpanelTracking();

  const themeMode = useAppSelector(state => state.themeReducer.mode);
  const projectId = useAppSelector(state => state.projectReducer.projectId);
  const [isSubTaskShow, setIsSubTaskShow] = useState(false);
  const [showNewSubtaskCard, setShowNewSubtaskCard] = useState(false);
  const [dueDate, setDueDate] = useState<Dayjs | null>(
    task?.end_date ? dayjs(task?.end_date) : null
  );
  const [updatingAssignToMe, setUpdatingAssignToMe] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id || '',
    data: {
      type: 'task',
      task,
      sectionId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleCardClick = (e: React.MouseEvent, id: string) => {
    // Prevent the event from propagating to parent elements
    e.stopPropagation();

    // Don't handle click if we're dragging
    if (isDragging) return;

    // Add a small delay to ensure it's a click and not the start of a drag
    const clickTimeout = setTimeout(() => {
      dispatch(setSelectedTaskId(id));
      dispatch(setShowTaskDrawer(true));
    }, 50);

    return () => clearTimeout(clickTimeout);
  };

  const handleAssignToMe = async (task: IProjectTask) => {
    if (!projectId || !task.id) return;

    try {
      setUpdatingAssignToMe(true);
      const body: IBulkAssignRequest = {
        tasks: [task.id],
        project_id: projectId,
      };
      const res = await taskListBulkActionsApiService.assignToMe(body);
      if (res.done) {
        trackMixpanelEvent(evt_project_task_list_context_menu_assign_me);
        dispatch(
          updateBoardTaskAssignee({
            body: res.body,
            sectionId,
            taskId: task.id,
          })
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingAssignToMe(false);
    }
  };

  const handleArchive = async (task: IProjectTask) => {
    if (!projectId || !task.id) return;

    try {
      const res = await taskListBulkActionsApiService.archiveTasks(
        {
          tasks: [task.id],
          project_id: projectId,
        },
        false
      );

      if (res.done) {
        trackMixpanelEvent(evt_project_task_list_context_menu_archive);
        dispatch(deleteBoardTask({ sectionId, taskId: task.id }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (task: IProjectTask) => {
    if (!projectId || !task.id) return;

    try {
      const res = await taskListBulkActionsApiService.deleteTasks({ tasks: [task.id] }, projectId);

      if (res.done) {
        trackMixpanelEvent(evt_project_task_list_context_menu_delete);
        dispatch(deleteBoardTask({ sectionId, taskId: task.id }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const items: MenuProps['items'] = [
    {
      label: (
        <span>
          <UserAddOutlined />
          &nbsp;
          <Typography.Text>{t('assignToMe')}</Typography.Text>
        </span>
      ),
      key: '1',
      onClick: () => {
        handleAssignToMe(task);
      },
    },
    {
      label: (
        <span>
          <InboxOutlined />
          &nbsp;
          <Typography.Text>{t('archive')}</Typography.Text>
        </span>
      ),
      key: '2',
      onClick: () => {
        handleArchive(task);
      },
    },
    {
      label: (
        <Popconfirm
          title={t('deleteConfirmationTitle')}
          icon={<ExclamationCircleFilled style={{ color: colors.vibrantOrange }} />}
          okText={t('deleteConfirmationOk')}
          cancelText={t('deleteConfirmationCancel')}
          onConfirm={() => handleDelete(task)}
        >
          <DeleteOutlined />
          &nbsp;
          {t('delete')}
        </Popconfirm>
      ),
      key: '3',
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={['contextMenu']}>
      <Flex
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        vertical
        gap={12}
        style={{
          ...style,
          width: '100%',
          padding: 12,
          backgroundColor: themeMode === 'dark' ? '#292929' : '#fafafa',
          borderRadius: 6,
          cursor: 'pointer',
          overflow: 'hidden',
        }}
        className={`group outline-1 ${themeWiseColor('outline-[#edeae9]', 'outline-[#6a696a]', themeMode)} hover:outline`}
        onClick={e => handleCardClick(e, task.id || '')}
      >
        {/* Labels and Progress */}
        <Flex align="center" justify="space-between">
          <Flex>
            {task?.labels?.length ? (
              <>
                {task?.labels.slice(0, 2).map((label: any) => (
                  <Tag key={label.id} style={{ marginRight: '4px' }} color={label?.color_code}>
                    <span style={{ color: themeMode === 'dark' ? '#383838' : '' }}>
                      {label.name}
                    </span>
                  </Tag>
                ))}
                {task.labels?.length > 2 && <Tag>+ {task.labels.length - 2}</Tag>}
              </>
            ) : (
              ''
            )}
          </Flex>

          <Tooltip title={` ${task?.completed_count} / ${task?.sub_tasks_count ?? 0 + 1}`}>
            <Progress type="circle" percent={task?.progress} size={26} />
          </Tooltip>
        </Flex>

        {/* Action Icons */}
        <Flex gap={4}>
          {task.priority_value === 0 ? (
            <MinusOutlined
              style={{
                color: '#52c41a',
                marginRight: '0.25rem',
              }}
            />
          ) : task.priority_value === 1 ? (
            <PauseOutlined
              style={{
                color: '#faad14',
                transform: 'rotate(90deg)',
                marginRight: '0.25rem',
              }}
            />
          ) : (
            <DoubleRightOutlined
              style={{
                color: '#f5222d',
                transform: 'rotate(-90deg)',
                marginRight: '0.25rem',
              }}
            />
          )}
          <Typography.Text style={{ fontWeight: 500 }}>{task.name}</Typography.Text>
        </Flex>

        <Flex vertical gap={8}>
          <Flex
            align="center"
            justify="space-between"
            style={{
              marginBlock: 8,
            }}
          >
            <CustomAvatarGroup task={task} sectionId={sectionId} />

            <Flex gap={4} align="center">
              <CustomDueDatePicker dueDate={dueDate} onDateChange={setDueDate} />

              {/* Subtask Section */}

              <Button
                onClick={e => {
                  e.stopPropagation();
                  setIsSubTaskShow(prev => !prev);
                }}
                size="small"
                style={{
                  padding: 0,
                }}
                type="text"
              >
                <Tag
                  bordered={false}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    margin: 0,
                    backgroundColor: themeWiseColor('white', '#1e1e1e', themeMode),
                  }}
                >
                  <ForkOutlined rotate={90} />
                  <span>{task.sub_tasks_count}</span>
                  {isSubTaskShow ? <CaretDownFilled /> : <CaretRightFilled />}
                </Tag>
              </Button>
            </Flex>
          </Flex>

          {isSubTaskShow && (
            <Flex vertical>
              <Divider style={{ marginBlock: 0 }} />
              <List>
                {task?.sub_tasks &&
                  task?.sub_tasks.map((subtask: any) => <BoardSubTaskCard subtask={subtask} />)}

                {showNewSubtaskCard && (
                  <BoardCreateSubtaskCard
                    sectionId={sectionId}
                    taskId={task.id || ''}
                    setShowNewSubtaskCard={setShowNewSubtaskCard}
                  />
                )}
              </List>
              <Button
                type="text"
                style={{
                  width: 'fit-content',
                  borderRadius: 6,
                  boxShadow: 'none',
                }}
                icon={<PlusOutlined />}
                onClick={e => {
                  e.stopPropagation();
                  setShowNewSubtaskCard(true);
                }}
              >
                Add Subtask
              </Button>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Dropdown>
  );
};

export default BoardViewTaskCard;
