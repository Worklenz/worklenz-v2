import React, { useEffect, useState } from 'react';
import {
  Form,
  InputNumber,
  Select,
  DatePicker,
  Tag,
  Switch,
  Typography,
  Button,
  ConfigProvider,
  Flex,
} from 'antd';
import AssigneeSelector from '@components/task-list-common/assigneeSelector/AssigneeSelector';
import LabelsSelector from '@components/task-list-common/labelsSelector/labels-selector';
import {
  DoubleLeftOutlined,
  MinusOutlined,
  PauseOutlined,
} from '@ant-design/icons';
import { colors } from '@/styles/colors';
import { getPriorityColor } from '@/utils/getPriorityColors';
import { useAppSelector } from '@/hooks/useAppSelector';
import NotifyMemberSelector from './NotifyMemberSelector';
import { TaskType } from '@/types/task.types';
import { simpleDateFormat } from '@/utils/simpleDateFormat';

type TaskDetailsFormProps = {
  selectedTask?: TaskType | null;
};

const TaskDetailsForm = ({ selectedTask = null }: TaskDetailsFormProps) => {
  const [isShowStartDate, setIsShowStartDate] = useState<boolean>(false);
  const [form] = Form.useForm();
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  // Initialize form values
  useEffect(() => {
    if (selectedTask) {
      form.setFieldsValue({
        taskId: selectedTask.taskId,
        phase: selectedTask.phase,
        assignees: selectedTask.members,
        dueDate: selectedTask.dueDate
          ? simpleDateFormat(selectedTask.dueDate)
          : null,
        hours: 0,
        minutes: 0,
        priority: selectedTask.priority || 'medium',
        labels: selectedTask.labels || [],
        billable: false,
        notify: [],
      });
    } else {
      form.resetFields();
    }
  }, [selectedTask, form]);

  // Define options for selectors
  const phaseMenuItems = [
    { key: '1', value: '1', label: 'Phase 1' },
    { key: '2', value: '2', label: 'Phase 2' },
  ];

  // Priority options with icons
  const priorityMenuItems = [
    {
      key: 'low',
      value: 'low',
      label: (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          Low
          <MinusOutlined
            style={{ color: getPriorityColor('low', themeMode) }}
          />
        </div>
      ),
    },
    {
      key: 'medium',
      value: 'medium',
      label: (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          Medium
          <PauseOutlined
            style={{
              color: getPriorityColor('medium', themeMode),
              rotate: '90deg',
            }}
          />
        </div>
      ),
    },
    {
      key: 'high',
      value: 'high',
      label: (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          High
          <DoubleLeftOutlined
            style={{
              color: getPriorityColor('high', themeMode),
              rotate: '90deg',
            }}
          />
        </div>
      ),
    },
  ];

  // Handle form submission
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log('task details form values', values);
    });
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Form: { itemMarginBottom: 8 },
        },
      }}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        initialValues={{
          priority: 'medium',
          hours: 0,
          minutes: 0,
          billable: false,
        }}
        onFinish={handleSubmit}
      >
        <Form.Item name="taskId" label="Task Key">
          <Tag>{selectedTask ? selectedTask.taskId : 'NEW-TASK'}</Tag>
        </Form.Item>

        <Form.Item name="phase" label="Phase">
          <Select
            placeholder="Select Phase"
            options={phaseMenuItems}
            style={{ width: 'fit-content'}}
            dropdownStyle={{width: 'fit-content'}}
          />
        </Form.Item>

        <Form.Item name="assignees" label="Assignees">
          <AssigneeSelector
            taskId={selectedTask ? selectedTask.taskId : 'NEW-TASK'}
          />
        </Form.Item>

        <Form.Item name="dueDate" label="Due Date">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isShowStartDate && (
              <>
                <DatePicker placeholder="Start Date" />
                <Typography.Text>-</Typography.Text>
              </>
            )}
            <DatePicker placeholder="End Date" />
            <Button
              type="text"
              onClick={() => setIsShowStartDate((prev) => !prev)}
              style={{ color: isShowStartDate ? 'red' : colors.skyBlue }}
            >
              {isShowStartDate ? 'Hide Start Date' : 'Show Start Date'}
            </Button>
          </div>
        </Form.Item>

        <Form.Item name="timeEstimation" label="Time Estimation">
          <Flex gap={8}>
            <Form.Item
              name="hours"
              label={
                <Typography.Text
                  style={{ color: colors.lightGray, fontSize: 12 }}
                >
                  Hours
                </Typography.Text>
              }
              style={{ marginBottom: 36 }}
              labelCol={{ style: { paddingBlock: 0 } }}
              layout="vertical"
            >
              <InputNumber min={0} placeholder="Hours" />
            </Form.Item>
            <Form.Item
              name="minutes"
              label={
                <Typography.Text
                  style={{ color: colors.lightGray, fontSize: 12 }}
                >
                  Minutes
                </Typography.Text>
              }
              style={{ marginBottom: 36 }}
              labelCol={{ style: { paddingBlock: 0 } }}
              layout="vertical"
            >
              <InputNumber min={0} max={60} placeholder="Minutes" />
            </Form.Item>
          </Flex>
        </Form.Item>

        <Form.Item name="priority" label="Priority">
          <Select
            options={priorityMenuItems}
            style={{ width: 'fit-content' }}
          />
        </Form.Item>

        <Form.Item name="labels" label="Labels">
          <LabelsSelector
            taskId={selectedTask ? selectedTask.taskId : 'NEW-TASK'}
          />
        </Form.Item>

        <Form.Item name="billable" label="Billable">
          <Switch defaultChecked={false} />
        </Form.Item>

        <Form.Item name="notify" label={selectedTask ? "Notify" : "When done, notify"}>
          <NotifyMemberSelector />
        </Form.Item>

        {/* <Form.Item wrapperCol={{ span: 24 }}>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            {selectedTask ? 'Update Task' : 'Create Task'}
          </Button>
        </Form.Item> */}
      </Form>
    </ConfigProvider>
  );
};

export default TaskDetailsForm;
