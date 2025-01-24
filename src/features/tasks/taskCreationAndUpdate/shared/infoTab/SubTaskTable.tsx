import {
  Button,
  Flex,
  Input,
  Popconfirm,
  Progress,
  Table,
  TableProps,
  Tag,
  Tooltip,
} from 'antd';
import React, { useState } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  UserOutlined,
} from '@ant-design/icons';
import { nanoid } from '@reduxjs/toolkit';
import {
  TaskPriorityType,
  TaskStatusType,
  TaskType,
} from '../../../../../types/task.types';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { getPriorityColor } from '../../../../../utils/getPriorityColors';
import { getStatusColor } from '../../../../../utils/getStatusColor';
import { colors } from '../../../../../styles/colors';

type SubTaskTableProps = {
  datasource: TaskType[] | null;
};

const SubTaskTable = ({ datasource }: SubTaskTableProps) => {
  const [hoverRow, setHoverRow] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // get theme details from theme slice
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  // initialize subTaskList state
  const [subTaskList, setSubTaskList] = useState(datasource || []);

  // function to handle adding a new subtask
  const handleAddSubTask = (taskName: string) => {
    const newSubTask: TaskType = {
      taskId: nanoid(),
      task: taskName,
      description: null,
      status: 'todo' as TaskStatusType,
      priority: 'medium' as TaskPriorityType,
    };

    setSubTaskList([...subTaskList, newSubTask]);
    setIsEdit(false);
  };

  // function to handle deleting a subtask
  const handleDeleteSubTask = (taskId: string) => {
    const updatedList = subTaskList.filter((task) => task.taskId !== taskId);
    setSubTaskList(updatedList);
  };

  // table columns
  const columns: TableProps<TaskType>['columns'] = [
    {
      key: 'name',
      dataIndex: 'task',
    },
    {
      key: 'priority',
      render: (record) => (
        <Tag
          color={getPriorityColor(record.priority, themeMode)}
          style={{ textTransform: 'capitalize' }}
        >
          {record.priority}
        </Tag>
      ),
    },
    {
      key: 'status',
      render: (record) => (
        <Tag
          color={getStatusColor(record.status, themeMode)}
          style={{ textTransform: 'capitalize' }}
        >
          {record.status}
        </Tag>
      ),
    },
    {
      key: 'assignee',
      render: () => (
        <Tooltip title={'No member assigned to this task'}>
          <Button
            type="dashed"
            shape="circle"
            size="small"
            icon={<UserOutlined />}
          />
        </Tooltip>
      ),
    },
    {
      key: 'actionBtns',
      width: 80,
      render: (record: TaskType) =>
        hoverRow === record.taskId && (
          <Flex gap={8} align="center">
            <Tooltip title={'Edit'} trigger={'hover'}>
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => console.log(record.taskId)}
              />
            </Tooltip>

            <Popconfirm
              title={'Are you sure?'}
              icon={
                <ExclamationCircleFilled
                  style={{ color: colors.vibrantOrange }}
                />
              }
              okText={'Yes'}
              cancelText={'No'}
              onConfirm={() => handleDeleteSubTask(record.taskId)}
            >
              <Tooltip title="Delete">
                <Button
                  shape="default"
                  icon={<DeleteOutlined />}
                  size="small"
                />
              </Tooltip>
            </Popconfirm>
          </Flex>
        ),
    },
  ];

  return (
    <Flex vertical gap={12}>
      <Progress />

      <Flex vertical gap={6}>
        {subTaskList.length > 0 && (
          <Table
            className="custom-two-colors-row-table"
            showHeader={false}
            dataSource={subTaskList}
            columns={columns}
            rowKey={(record) => record.taskId}
            pagination={{ hideOnSinglePage: true }}
            onRow={(record) => ({
              onMouseEnter: () => setHoverRow(record.taskId),
              onMouseLeave: () => setHoverRow(null),
              style: {
                cursor: 'pointer',
                height: 36,
              },
            })}
          />
        )}
        <div>
          {isEdit ? (
            <Input
              style={{
                border: 'none',
                boxShadow: 'none',
                height: 48,
              }}
              placeholder="Type your task and hit enter"
              onBlur={(e) =>
                e.currentTarget.value.length > 0
                  ? handleAddSubTask(e.currentTarget.value)
                  : setIsEdit(false)
              }
              onPressEnter={(e) =>
                e.currentTarget.value.length > 0
                  ? handleAddSubTask(e.currentTarget.value)
                  : setIsEdit(false)
              }
            />
          ) : (
            <Input
              onFocus={() => setIsEdit(true)}
              value="+ Add Subtask"
              className={`${themeMode === 'default' && 'border-none hover:bg-[#edebf0]'} ${themeMode === 'dark' && 'border-[1px] border-[#424242] hover:border-[#1890ff]'} hover:text-[#1890ff]`}
            />
          )}
        </div>
      </Flex>
    </Flex>
  );
};

export default SubTaskTable;
