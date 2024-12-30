import { Alert, Button, Flex, Form, Input, InputRef, Select, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { nanoid } from '@reduxjs/toolkit';
import { TaskType } from '../../../types/task.types';
import { addTask } from '../../../features/tasks/taskSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';

const AddTaskInlineForm = () => {
  const [isAlertShowing, setIsAlertShowing] = useState(false);
  const [isDueDateFieldShowing, setIsDueDateFieldShowing] = useState(false);
  const [isProjectFieldShowing, setIsProjectFieldShowing] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const projectList = useAppSelector(
    (state) => state.projectReducer.projectsList
  );
  const [isButtonShowing, setIsButtonShowing] = useState(true);

  // ref for task input field
  const taskInputRef = useRef<InputRef | null>(null);

  // due date select options
  const dueDateOptions = [
    {
      value: 'Today',
      label: 'Today',
    },
    {
      value: 'Tomorrow',
      label: 'Tomorrow',
    },
    {
      value: 'Next Week',
      label: 'Next Week',
    },
    {
      value: 'Next Month',
      label: 'Next Month',
    },
    {
      value: 'No Due Date',
      label: 'No Due Date',
    },
  ];

  // project options
  let projectOptions = [
    ...projectList.map((project) => ({
      key: project.projectId,
      value: project.projectName,
      label: project.projectName,
    })),
  ];

  // function to handle task submit
  const handleTaskSubmit = (values: any) => {
    const newTask: TaskType = {
      taskId: nanoid(),
      task: values.name,
      dueDate: values.dueDate,
      status: 'todo',
      priority: 'medium',
      project: values.project,
      createdDate: new Date(),
    };

    dispatch(addTask(newTask));
    form.resetFields();

    //? there is an issue (input field focused but can't type) occurs when immediately focus the input, so this timeout fuction held to create a small delay
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
          {isButtonShowing ? <Button onClick={() => setIsButtonShowing(false)} type='link' style={{width: '100px'}}>+ Add Task</Button>
           : <Input
            ref={taskInputRef}
            placeholder="+ Add Task"
            style={{ width: '100%' }}
            onChange={(e) => {
              const inputValue = e.currentTarget.value;
              if (inputValue.length >= 1) setIsAlertShowing(true);
              else if (inputValue === '') setIsAlertShowing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
                setIsAlertShowing(false);
                setIsDueDateFieldShowing(true);
              }
            }}
          />}
          {isAlertShowing && (
            <Alert
              message={
                <Typography.Text style={{ fontSize: 11 }}>
                  Press <strong>Tab</strong> to select a{' '}
                  <strong>'Due date'</strong> and a <strong>'Project'</strong>.
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
            onKeyDown={(e) => {
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
            message: 'Related project is required',
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
            onKeyDown={(e) => {
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
