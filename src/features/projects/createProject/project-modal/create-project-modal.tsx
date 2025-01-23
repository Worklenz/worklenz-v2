import { Divider, Flex, Input, Modal, Radio, Tabs, Typography } from 'antd';
import { TabsProps } from 'antd/lib';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultTemplateTab from './default-template-tab';
import MyTemplateTab from './my-template-tab';
import ProjectFormTab from './project-form-tab';
import { CloseOutlined } from '@ant-design/icons';

type CreateProjectModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
};

const CreateProjectModal = ({
  isModalOpen,
  setIsModalOpen,
}: CreateProjectModalProps) => {
  const [projectName, setProjectName] = useState<string>('');

  // localization
  const { t } = useTranslation('create-project-modal');

  const items: TabsProps['items'] = [
    {
      key: 'fromScratch',
      label: t('fromScratch'),
      children: (
        <ProjectFormTab
          projectName={projectName}
          setProjectName={setProjectName}
        />
      ),
    },
    {
      key: 'defaultTemplates',
      label: t('defaultTemplates'),
      children: <DefaultTemplateTab />,
    },
    {
      key: 'myTemplates',
      label: t('myTemplates'),
      children: <MyTemplateTab />,
    },
  ];

  return (
    <>
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        title={
          <Flex
            align="center"
            justify="space-between"
            style={{ marginInline: 48 }}
          >
            <Typography.Title level={5} style={{ marginBlock: 0 }}>
              {t('createProject')}{' '}
            </Typography.Title>

            <CloseOutlined onClick={() => setIsModalOpen(false)} />
          </Flex>
        }
        style={{ top: 48 }}
        width={'96%'}
        closeIcon={null}
        footer={null}
      >
        <div style={{ paddingInline: 48 }}>
          <Divider style={{ marginBlockStart: 12 }} />
          <div>
            <Input
              placeholder={t('projectName')}
              style={{ paddingBlock: 12 }}
              value={projectName}
              onChange={(e) => setProjectName(e.currentTarget.value)}
              required
            />
            <Flex vertical gap={8} style={{ marginBlockStart: 12 }}>
              <Typography.Text>{t('defaultView')}</Typography.Text>
              <Radio.Group
                name="radiogroup"
                defaultValue={'tasklist'}
                options={[
                  { value: 'tasklist', label: t('tasklist') },
                  { value: 'kanbanBoard', label: t('kanbanBoard') },
                ]}
              />
            </Flex>
            <Tabs
              defaultActiveKey="fromScratch"
              items={items}
              style={{
                marginBlockStart: 24,
                height: 'calc(100vh - 320px)',
                overflow: 'hidden',
              }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateProjectModal;
