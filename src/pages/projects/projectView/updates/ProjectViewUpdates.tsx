import { Button, Flex, Form, Mentions, Space } from 'antd';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { colors } from '../../../../styles/colors';
import { PaperClipOutlined } from '@ant-design/icons';
import OthersChatBox from './others-chat-box';
import MyChatBox from './my-chat-box';
import { fetchData } from '../../../../utils/fetchData';

const ProjectViewUpdates = () => {
  const [characterLength, setCharacterLength] = useState<number>(0);
  const [updatesData, setUpdatesData] = useState<any[]>([]);

  // localization
  const { t } = useTranslation('projectViewUpdatesTab');

  // fetch updates data
  useMemo(() => {
    fetchData('/project-view-mock-data/mock-data-updates.json', setUpdatesData);
  }, []);

  const [form] = Form.useForm();

  // get member list from project members slice
  const projectMembersList = useAppSelector(
    (state) => state.projectMemberReducer.membersList
  );

  // function to handle cancel
  const handleCancel = () => {
    form.resetFields(['comment']);
    setCharacterLength(0);
  };

  // mentions options
  const mentionsOptions = projectMembersList
    ? projectMembersList.map((member) => ({
        value: member.memberName,
        label: member.memberName,
      }))
    : [];

  return (
    <Flex justify="center" style={{ width: '100%' }}>
      <Flex
        gap={8}
        vertical
        justify="space-between"
        style={{
          height: 'calc(100vh - 260px)',
          width: '100%',
          maxWidth: 1240,
        }}
      >
        <Flex vertical gap={24} style={{ height: '100%', overflowY: 'auto' }}>
          {updatesData.map((update, index) =>
            update.type === 'others' ? (
              <OthersChatBox key={index} update={update} />
            ) : (
              <MyChatBox key={index} update={update} />
            )
          )}
        </Flex>
        <Form form={form}>
          <Form.Item name={'comment'} style={{ marginBlock: 8 }}>
            <Mentions
              placeholder={t('inputPlaceholder')}
              options={mentionsOptions}
              autoSize
              maxLength={2000}
              onChange={(e) => setCharacterLength(e.length)}
              style={{
                minHeight: 80,
              }}
            />
            <span
              style={{
                position: 'absolute',
                bottom: 4,
                right: 12,
                color: colors.lightGray,
              }}
            >{`${characterLength}/2000`}</span>
          </Form.Item>
          <Form.Item style={{ marginBlock: 0 }}>
            <Flex gap={8} justify="space-between">
              <Button icon={<PaperClipOutlined />} />
              <Space>
                <Button onClick={handleCancel}>{t('cancelButton')}</Button>
                <Button type="primary" disabled={characterLength === 0}>
                  {t('commentButton')}
                </Button>
              </Space>
            </Flex>
          </Form.Item>
        </Form>
      </Flex>
    </Flex>
  );
};

export default ProjectViewUpdates;
