import { Button, Flex, Form, Mentions, Space, Tooltip, Typography } from 'antd';
import React, { useState } from 'react';
import { PaperClipOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { colors } from '../../../../../styles/colors';
import { themeWiseColor } from '../../../../../utils/themeWiseColor';

const InfoTabFooter = () => {
  const [characterLength, setCharacterLength] = useState<number>(0);
  const [isCommentBoxExpand, setIsCommentBoxExpand] = useState<boolean>(false);

  const [form] = Form.useForm();

  // get theme details from theme slice
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  // get member list from project members slice
  const projectMembersList = useAppSelector(
    (state) => state.projectMemberReducer.membersList
  );

  // function to handle cancel
  const handleCancel = () => {
    form.resetFields(['comment']);
    setCharacterLength(0);
    setIsCommentBoxExpand(false);
  };

  // mentions options
  const mentionsOptions = projectMembersList
    ? projectMembersList.map((member) => ({
        value: member.memberName,
        label: member.memberName,
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
          <Mentions
            placeholder={'Add a comment..'}
            options={mentionsOptions}
            autoSize
            maxLength={5000}
            onClick={() => setIsCommentBoxExpand(true)}
            onChange={(e) => setCharacterLength(e.length)}
            style={{
              minHeight: isCommentBoxExpand ? 180 : 60,
              maxHeight: 480,
              overflow: 'auto',
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
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          Created in a few seconds by Dev prasad
        </Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          Updated in a few seconds
        </Typography.Text>
      </Flex>
    </Flex>
  );
};

export default InfoTabFooter;
