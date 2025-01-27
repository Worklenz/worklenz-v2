import {
  Divider,
  Flex,
  Input,
  Modal,
  Radio,
  RadioChangeEvent,
  Tabs,
  Typography,
} from 'antd';
import { TabsProps } from 'antd/lib';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultTemplateTab from './default-template-tab';
import MyTemplateTab from './my-template-tab';
import ProjectFormTab from './project-form-tab';
import { CloseOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { toggleProjectModal } from '../../projectSlice';
import { saveToLocalStorage } from '../../../../utils/localStorageFunctions';

const CreateProjectModal = () => {
  const [projectName, setProjectName] = useState<string>('');
  const [defaultView, setDefaultView] = useState<'taskList' | 'board'>(
    'taskList'
  );

  // localization
  const { t } = useTranslation('create-project-modal');

  // get the project modal open state from project slice
  const isModalOpen = useAppSelector(
    (state) => state.projectReducer.isProjectModalOpen
  );

  const dispatch = useAppDispatch();

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

  // function to handle view change
  const onViewChange = (e: RadioChangeEvent) => {
    setDefaultView(e.target.value);
  };

  // if view changed, update the state
  useEffect(() => {
    if (defaultView === 'taskList') {
      saveToLocalStorage('pinnedTab', 'taskList');
    } else {
      saveToLocalStorage('pinnedTab', 'board');
    }
  }, [defaultView]);

  // function to close modal
  const handleCloseModal = () => {
    dispatch(toggleProjectModal());
  };

  return (
    <>
      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        title={
          <Flex
            align="center"
            justify="space-between"
            style={{ marginInline: 48 }}
          >
            <Typography.Title level={5} style={{ marginBlock: 0 }}>
              {t('createProject')}{' '}
            </Typography.Title>

            <CloseOutlined onClick={handleCloseModal} />
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
                defaultValue={'taskList'}
                onChange={onViewChange}
                options={[
                  { value: 'taskList', label: t('taskList') },
                  { value: 'board', label: t('kanbanBoard') },
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
