import { SyncOutlined } from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Flex,
  Form,
  Input,
  InputRef,
  Skeleton,
  Table,
  TableProps,
  Tooltip,
  Typography,
} from 'antd';
import React, { useRef, useState } from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { TodoType } from '../../../types/todo.types';
import { useAppDispatch } from '../../../hooks/useAppDispatch';

import { addTodo } from '../../../features/todo/todoSlice';
import EmptyListPlaceholder from '../../../components/EmptyListPlaceholder';
import { nanoid } from '@reduxjs/toolkit';
import TodoDoneButton from './TodoDoneButton';

const TodoList = () => {
  const todoList = useAppSelector((state) => state.todoReducer.todoList);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertShowing, setIsAlertShowing] = useState(false);
  const [form] = Form.useForm();

  // ref for todo input field
  const todoInputRef = useRef<InputRef | null>(null);

  // function for handle refresh
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  // function to handle todo submit
  const handleTodoSubmit = (values: any) => {
    const newTodo: TodoType = {
      todoId: nanoid(),
      todoName: values.name,
      isCompleted: false,
    };
    setIsAlertShowing(false);
    dispatch(addTodo(newTodo));
    form.resetFields();

    //? there is an issue (input field focused but can't type) occurs when immediately focus the input, so this timeout fuction held to create a small delay
    setTimeout(() => {
      if (todoInputRef.current) {
        todoInputRef.current.focus({
          cursor: 'start',
        });
      }
    }, 100);
  };

  // table columns
  const columns: TableProps<TodoType>['columns'] = [
    {
      key: 'completeBtn',
      width: 32,
      render: (record: TodoType) => <TodoDoneButton record={record} />,
    },
    {
      key: 'name',
      render: (record: TodoType) => (
        <Typography.Paragraph style={{ margin: 0, paddingInlineEnd: 6 }}>
          <Tooltip title={record.todoName}>
            {record.todoName}
          </Tooltip>
          </Typography.Paragraph>
      ),
    },
  ];

  return (
    <Card
      title={
        <Typography.Title level={5} style={{ marginBlockEnd: 0 }}>
          To do list ({todoList.length})
        </Typography.Title>
      }
      extra={
        <Tooltip title='Refresh tasks'>
          <Button
            shape="circle"
            icon={<SyncOutlined spin={isLoading} />}
            onClick={() => handleRefresh()}
          />
        </Tooltip>
      }
      style={{ width: '100%' }}
    >
      {isLoading ? (
        <Skeleton />
      ) : (
        <div>
          <Form form={form} onFinish={handleTodoSubmit}>
            <Form.Item name="name">
              <Flex vertical gap={4}>
                <Input
                  ref={todoInputRef}
                  placeholder="+ Add Task"
                  onChange={(e) => {
                    const inputValue = e.currentTarget.value;

                    if (inputValue.length >= 1) setIsAlertShowing(true);
                    else if (inputValue === '') setIsAlertShowing(false);
                  }}
                />
                {isAlertShowing && (
                  <Alert
                    message={
                      <Typography.Text style={{ fontSize: 11 }}>
                        Press <strong>Enter</strong> to create.
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
          </Form>

          {todoList.length === 0 ? (
            <EmptyListPlaceholder
              imageSrc="https://app.worklenz.com/assets/images/empty-box.webp"
              text=" No tasks to show."
            />
          ) : (
            <Table
              className="custom-two-colors-row-table"
              rowKey={(record) => record.todoId}
              dataSource={todoList}
              columns={columns}
              showHeader={false}
              pagination={false}
              // scroll={{
              //     y: 55 * 5,
              // }}
            />
          )}
        </div>
      )}
    </Card>
  );
};

export default TodoList;
