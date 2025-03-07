import { Button, Flex, Form, Mentions, Space, Tooltip, Typography } from 'antd';
import React, { useState } from 'react';
import { PaperClipOutlined } from '@ant-design/icons';
import { useAppSelector } from '@/hooks/useAppSelector';
import { colors } from '@/styles/colors';
import { themeWiseColor } from '@/utils/themeWiseColor';
import { formatDateTimeWithLocale } from '@/utils/format-date-time-with-locale';
import { calculateTimeGap } from '@/utils/calculate-time-gap';
import { calculateTimeDifference } from '@/utils/calculate-time-difference';

const InfoTabFooter = () => {
  const [characterLength, setCharacterLength] = useState<number>(0);
  const [isCommentBoxExpand, setIsCommentBoxExpand] = useState<boolean>(false);
  const { taskFormViewModel } = useAppSelector(state => state.taskDrawerReducer);

  const [form] = Form.useForm();

  // get theme details from theme slice
  const themeMode = useAppSelector(state => state.themeReducer.mode);

  // get member list from project members slice
  const projectMembersList = useAppSelector(state => state.projectMemberReducer.membersList);

  // function to handle cancel
  const handleCancel = () => {
    form.resetFields(['comment']);
    setCharacterLength(0);
    setIsCommentBoxExpand(false);
  };

  // mentions options
  const mentionsOptions = projectMembersList
    ? projectMembersList.map(member => ({
        value: member.id,
        label: member.name,
      }))
    : [];

  return (
    <Flex
      gap={8}
      vertical
      align="center"
      justify="center"
      style={{
        width: '100%',
        position: 'relative',
        height: 'auto',
        justifySelf: 'flex-end',
        flexShrink: 1,
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

      <Form form={form} style={{ width: '100%' }}>
        <Form.Item name={'comment'} style={{ marginBlock: 12 }}>
          <div>
            <Mentions
              placeholder={'Add a comment..'}
              options={mentionsOptions}
              autoSize
              maxLength={5000}
              onClick={() => setIsCommentBoxExpand(true)}
              onChange={e => setCharacterLength(e.length)}
              style={{
                minHeight: isCommentBoxExpand ? 180 : 60,
                maxHeight: 480,
                overflow: 'scroll',
                paddingBlockEnd: 24,
              }}
            />

            <span
              style={{
                position: 'absolute',
                bottom: 4,
                right: 12,
                color: colors.lightGray,
              }}
            >{`${characterLength}/5000`}</span>
          </div>
        </Form.Item>

        {isCommentBoxExpand && (
          <Form.Item style={{ marginBottom: 0 }}>
            <Flex gap={8} justify="space-between">
              <Tooltip title={'Attach files'}>
                <Button icon={<PaperClipOutlined />} />
              </Tooltip>

              <Space>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button type="primary" disabled={characterLength === 0}>
                  Comment
                </Button>
              </Space>
            </Flex>
          </Form.Item>
        )}
      </Form>

      <Flex align="center" justify="space-between" style={{ width: '100%' }}>
        <Tooltip
          title={
            taskFormViewModel?.task?.created_at
              ? formatDateTimeWithLocale(taskFormViewModel.task.created_at)
              : 'N/A'
          }
        >
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Created{' '}
            {taskFormViewModel?.task?.created_at
              ? calculateTimeDifference(taskFormViewModel.task.created_at)
              : 'N/A'} by {taskFormViewModel?.task?.reporter}
          </Typography.Text>
        </Tooltip>
        <Tooltip
          title={
            taskFormViewModel?.task?.updated_at
              ? formatDateTimeWithLocale(taskFormViewModel.task.updated_at)
              : 'N/A'
          }
        >
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Updated{' '}
            {taskFormViewModel?.task?.updated_at
              ? calculateTimeDifference(taskFormViewModel.task.updated_at)
              : 'N/A'}
          </Typography.Text>
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export default InfoTabFooter;
