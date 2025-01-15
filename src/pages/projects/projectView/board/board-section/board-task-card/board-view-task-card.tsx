import React, { useEffect, useState } from 'react';
import {
  DatePicker,
  Tooltip,
  Tag,
  Avatar,
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
import { useAppSelector } from '../../../../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../../../../hooks/useAppDispatch';
import { themeWiseColor } from '../../../../../../utils/themeWiseColor';
import BoardSubTaskCard from '../board-sub-task-card/board-sub-task-card';
import CustomAvatarGroup from '../../../../../../components/board/custom-avatar-group';
import CustomDueDatePicker from '../../../../../../components/board/custom-due-date-picker';
import { colors } from '../../../../../../styles/colors';
import {
  deleteBoardTask,
  setSelectedTaskId,
} from '../../../../../../features/board/board-slice';
import { toggleUpdateTaskDrawer } from '../../../../../../features/tasks/taskSlice';
import BoardCreateSubtaskCard from '../board-sub-task-card/board-create-sub-task-card';

const BoardViewTaskCard = ({
  task,
  sectionId,
}: {
  task: any;
  sectionId: string;
}) => {
  const [isSubTaskShow, setIsSubTaskShow] = useState(false);
  const [showNewSubtaskCard, setShowNewSubtaskCard] = useState(false);
  const [dueDate, setDueDate] = useState<Dayjs | null>(
    task?.end_date ? dayjs(task?.end_date) : null
  );

  // localization
  const { t } = useTranslation('kanbanBoard');

  //   get theme details from theme reducer
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  const dispatch = useAppDispatch();

  // function to onClick card
  const handleCardClick = (id: string) => {
    dispatch(setSelectedTaskId(id));
    dispatch(toggleUpdateTaskDrawer());
  };

  const items: MenuProps['items'] = [
    {
      label: (
        <span>
          <UserAddOutlined />{' '}
          <Typography.Text>{t('assignToMe')}</Typography.Text>
        </span>
      ),
      key: '1',
    },
    {
      label: (
        <span>
          <InboxOutlined /> <Typography.Text>{t('archive')}</Typography.Text>
        </span>
      ),
      key: '2',
    },
    {
      label: (
        <Popconfirm
          title={t('deleteConfirmationTitle')}
          icon={
            <ExclamationCircleFilled style={{ color: colors.vibrantOrange }} />
          }
          okText={t('deleteConfirmationOk')}
          cancelText={t('deleteConfirmationCancel')}
          onConfirm={() =>
            dispatch(deleteBoardTask({ sectionId: sectionId, taskId: task.id }))
          }
        >
          <Flex gap={8} align="center">
            <DeleteOutlined />
            {t('delete')}
          </Flex>
        </Popconfirm>
      ),
      key: '3',
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={['contextMenu']}>
      <Flex
        vertical
        gap={12}
        style={{
          width: '100%',
          padding: 12,
          backgroundColor: themeMode === 'dark' ? '#292929' : '#fafafa',
          borderRadius: 6,
          cursor: 'pointer',
          overflow: 'hidden',
        }}
        className={`group outline-1 ${themeWiseColor('outline-[#edeae9]', 'outline-[#6a696a]', themeMode)} hover:outline`}
        onClick={() => handleCardClick(task.id)}
      >
        {/* Labels and Progress */}
        <Flex align="center" justify="space-between">
          <Flex>
            {task?.labels?.length ? (
              <>
                {task?.labels.slice(0, 2).map((label: any) => (
                  <Tag
                    key={label.id}
                    style={{ marginRight: '4px' }}
                    color={label?.color_code}
                  >
                    <span
                      style={{ color: themeMode === 'dark' ? '#383838' : '' }}
                    >
                      {label.name}
                    </span>
                  </Tag>
                ))}
                {task.labels?.length > 2 && (
                  <Tag>+ {task.labels.length - 2}</Tag>
                )}
              </>
            ) : (
              ''
            )}
          </Flex>

          <Tooltip
            title={` ${task?.completed_sub_tasks} / ${task?.sub_tasks_count + 1}`}
          >
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
          <Typography.Text style={{ fontWeight: 500 }}>
            {task.name}
          </Typography.Text>
        </Flex>

        <Flex vertical gap={8}>
          <Flex
            align="center"
            justify="space-between"
            style={{
              marginBlock: 8,
            }}
          >
            {/* assignees from custom compnent */}
            <CustomAvatarGroup assignees={task?.assignees} />

            <Flex gap={4} align="center">
              <CustomDueDatePicker
                dueDate={dueDate}
                onDateChange={setDueDate}
              />

              {/* Subtask Section */}

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSubTaskShow((prev) => !prev);
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
                    backgroundColor: themeWiseColor(
                      'white',
                      '#1e1e1e',
                      themeMode
                    ),
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
                  task?.sub_tasks.map((subtask: any) => (
                    <BoardSubTaskCard subtask={subtask} />
                  ))}

                {showNewSubtaskCard && (
                  <BoardCreateSubtaskCard
                    sectionId={sectionId}
                    taskId={task.id}
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
                onClick={(e) => {
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
