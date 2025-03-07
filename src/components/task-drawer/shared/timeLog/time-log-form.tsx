import React from 'react';
import { Button, DatePicker, Form, Input, TimePicker, Flex } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { useAppSelector } from '@/hooks/useAppSelector';
import { themeWiseColor } from '@/utils/themeWiseColor';

const TimeLogForm = ({ onCancel }: { onCancel: () => void }) => {
  const [form] = Form.useForm();

  // get theme details from theme slice
  const themeMode = useAppSelector(state => state.themeReducer.mode);

  return (
    <Flex
      gap={8}
      vertical
      align="center"
      justify="center"
      style={{
        width: '100%',
        position: 'relative',
        height: 'fit-content',
        justifySelf: 'flex-end',
        paddingBlock: 24,
      }}
    >
      <div
        style={{
          marginBlockEnd: 0,
          height: 1,
          position: 'absolute',
          top: 0,
          width: '120%',
          backgroundColor: themeWiseColor('#ebebeb', '#3a3a3a', themeMode),
        }}
      />

      <Form form={form} style={{ width: '100%' }} layout="vertical">
        <Form.Item style={{ marginBlockEnd: 0 }}>
          <Flex gap={8}>
            <Form.Item name="date" label="Date">
              <DatePicker disabledDate={current => current && current.toDate() > new Date()}/>
            </Form.Item>

            <Form.Item name="startTime" label="Start Time">
              <TimePicker format="mm:ss" />
            </Form.Item>

            <Form.Item name="endTime" label="End Time">
              <TimePicker format="mm:ss" />
            </Form.Item>
          </Flex>
        </Form.Item>

        <Form.Item name="description" label="Work Description" style={{ marginBlockEnd: 12 }}>
          <Input.TextArea placeholder="Add a description" />
        </Form.Item>

        <Form.Item>
          <Flex gap={8}>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" icon={<ClockCircleOutlined />} disabled>
              Log time
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default TimeLogForm;
