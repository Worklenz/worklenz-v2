import React, { useEffect, useState } from 'react';
import {
  DatePicker,
  Tooltip,
  Tag,
  Avatar,
  Progress,
  Typography,
  Divider,
  Dropdown,
  MenuProps,
  Button,
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
} from '@ant-design/icons';
import './TaskCard.css';
import dayjs, { Dayjs } from 'dayjs';
import { AvatarNamesMap } from '../../../shared/constants';
import AddMembersDropdown from '../../addMembersDropdown/AddMembersDropdown';
import StatusDropdown from '@components/task-list-common/statusDropdown/StatusDropdown';
import { TaskType } from '../../../types/task.types';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { deleteTask } from '../../../features/tasks/taskSlice';
import SubTaskCard from '../subTaskCard/SubTaskCard';
import { useAppSelector } from '../../../hooks/useAppSelector';

interface taskProps {
  task: TaskType;
}

const TaskCard: React.FC<taskProps> = ({ task }) => {
  const [isSubTaskShow, setIsSubTaskShow] = useState(false);
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);
  const [isToday, setIsToday] = useState(false);
  const [isTomorrow, setIsTomorrow] = useState(false);
  const [isItPrevDate, setIsItPrevDate] = useState(false);
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  const dispatch = useAppDispatch();

  const handleDateChange = (date: Dayjs | null) => {
    setDueDate(date);
  };

  const formatDate = (date: Dayjs | null) => {
    if (!date) return '';

    const today = dayjs();
    const tomorrow = today.add(1, 'day');

    if (date.isSame(today, 'day')) {
      return 'Today';
    } else if (date.isSame(tomorrow, 'day')) {
      return 'Tomorrow';
    } else {
      return date.isSame(today, 'year')
        ? date.format('MMM DD')
        : date.format('MMM DD, YYYY');
    }
  };

  useEffect(() => {
    if (dueDate) {
      setIsToday(dueDate.isSame(dayjs(), 'day'));
      setIsTomorrow(dueDate.isSame(dayjs().add(1, 'day'), 'day'));
      setIsItPrevDate(dueDate.isBefore(dayjs()));
    } else {
      setIsToday(false);
      setIsTomorrow(false);
      setIsItPrevDate(false);
    }
  }, [dueDate]);

  const handleDelete = () => {
    dispatch(deleteTask(task.taskId)); // Call delete function with taskId
  };

  const items: MenuProps['items'] = [
    {
      label: (
        <span>
          <UserAddOutlined /> <Typography.Text>Assign to me</Typography.Text>
        </span>
      ),
      key: '1',
    },
    {
      label: (
        <span>
          <InboxOutlined /> <Typography.Text>Archive</Typography.Text>
        </span>
      ),
      key: '2',
    },
    {
      label: (
        <span onClick={handleDelete}>
          <DeleteOutlined /> <Typography.Text>Delete</Typography.Text>
        </span>
      ),
      key: '3',
    },
  ];

  // const progress = (task.subTasks?.length || 0 + 1 )/ (task.subTasks?.length || 0 + 1)

  return (
    <Dropdown menu={{ items }} trigger={['contextMenu']}>
      <div
        className={`task-card ${themeMode === 'dark' ? 'dark-mode' : ''}`}
        style={{
          zIndex: 99,
          padding: '12px',
          backgroundColor: themeMode === 'dark' ? '#383838' : 'white',
          borderRadius: '4px',
          marginBottom: '12px',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {/* Labels and Progress */}
        <div style={{ display: 'flex' }}>
          <div>
            {task.labels?.length ? (
              <>
                {task.labels.slice(0, 2).map((label, index) => (
                  <Tag
                    key={index}
                    style={{ marginRight: '4px' }}
                    color={label.labelColor}
                  >
                    <span
                      style={{ color: themeMode === 'dark' ? '#383838' : '' }}
                    >
                      {label.labelName}
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
          </div>
          <div
            style={{
              maxWidth: '30px',
              height: '30px',
              marginLeft: 'auto',
            }}
          >
            <Tooltip title="1/1">
              <Progress type="circle" percent={task.progress} size={26} />
            </Tooltip>
          </div>
        </div>

        {/* Action Icons */}
        <div style={{ display: 'flex' }}>
          {task.priority === 'low' ? (
            <MinusOutlined
              style={{
                color: '#52c41a',
                marginRight: '0.25rem',
              }}
            />
          ) : task.priority === 'medium' ? (
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
          <Typography.Text
            style={{ fontWeight: 500 }}
          >
            {task.task}
          </Typography.Text>
        </div>

        {/* Subtask Section */}

        <div>
          <div
            style={{
              marginTop: '0.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                opacity: 1,
                borderRadius: '4px',
                cursor: 'pointer',
                alignItems: 'center',
                display: 'flex',
                gap: '3px',
              }}
            >
              <Avatar.Group>
                {task.members?.map((member) => (
                  <Avatar
                    style={{
                      backgroundColor:
                        AvatarNamesMap[member.memberName.charAt(0)],
                      verticalAlign: 'middle',
                      fontSize: '12px',
                    }}
                    size="small"
                  >
                    {member.memberName.charAt(0)}
                  </Avatar>
                ))}
              </Avatar.Group>
              <Avatar
                size="small"
                className={
                  task.members?.length
                    ? 'add-member-avatar'
                    : 'hide-add-member-avatar'
                }
                style={{
                  backgroundColor: '#fff',
                  border: '1px dashed #c4c4c4',
                  color: '#000000d9',
                  fontSize: '12px',
                }}
              >
                <AddMembersDropdown />
              </Avatar>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'right',
                alignItems: 'center',
              }}
            >
              <div>
                <DatePicker
                  className={`custom-placeholder ${
                    !dueDate
                      ? 'empty-date'
                      : isToday
                        ? 'selected-date'
                        : isTomorrow
                          ? 'selected-date'
                          : isItPrevDate
                            ? 'red-colored'
                            : ''
                  }`}
                  placeholder="Due date"
                  style={{
                    fontSize: '12px',
                    opacity: dueDate ? 1 : 0,
                    width: dueDate ? 'auto' : '100%',
                    maxWidth: '100px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  onChange={handleDateChange}
                  variant="borderless"
                  size="small"
                  suffixIcon={false}
                  format={(value) => formatDate(value)}
                />
              </div>
              {task.subTasks && task.subTasks.length > 0 && (
                <Button
                  onClick={() => setIsSubTaskShow(!isSubTaskShow)}
                  size="small"
                  style={{ padding: 0 }}
                  type='text'
                >
                  <Tag
                    bordered={false}
                    style={{ display: 'flex', alignItems: 'center', margin: 0 }}
                  >
                    <ForkOutlined rotate={90} />
                    <span>{task.subTasks?.length}</span>
                    {isSubTaskShow ? <CaretDownFilled /> : <CaretRightFilled />}
                  </Tag>
                </Button>
              )}
            </div>
          </div>

          {isSubTaskShow &&
            task.subTasks?.length &&
            task.subTasks?.map((subtask) => <SubTaskCard subtask={subtask} />)}
        </div>
      </div>
    </Dropdown>
  );
};

export default TaskCard;
