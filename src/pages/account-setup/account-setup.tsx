import React, { startTransition, useState } from 'react';
import { Alert, Button, Drawer, Form, Input, List, Space, Steps, Typography } from 'antd';
import { CloseCircleOutlined, MailOutlined, PlusOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { RootState } from '@/app/store';
import { useDocumentTitle } from '@/hooks/useDoumentTItle';
import { getSession } from '@/utils/session-helper';
import { validateEmail } from '@/utils/validateEmail';
import logo from '@/assets/images/logo.png';
import logoDark from '@/assets/images/logo-dark-mode.png';
import TemplateDrawer from '@/components/account-setup/template-drawer/template-drawer';
import { projectTemplatesApiService } from '@/api/project-templates/project-templates.api.service';

import './account-setup.css';
import { IAccountSetupRequest } from '@/types/project-templates/project-templates.types';
import { profileSettingsApiService } from '@/api/settings/profile/profile-settings.api.service';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

interface Task {
  id: number;
  value: string;
}

interface Email {
  id: number;
  value: string;
}

const AccountSetup: React.FC = () => {
  const { t } = useTranslation('account-setup');
  const userDetails = getSession();
  const themeMode = useSelector((state: RootState) => state.themeReducer.mode);
  useDocumentTitle(t('setupYourAccount', 'Account Setup'));
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);
  const [organizationName, setOrganizationName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([{ id: 0, value: '' }]);
  const [emails, setEmails] = useState<Email[]>([{ id: 0, value: '' }]);
  const [creatingFromTemplate, setCreatingFromTemplate] = useState(false);

  const isDarkMode = themeMode === 'dark';
  const organizationNamePlaceholder = userDetails?.name ? `e.g., ${userDetails?.name}'s Team` : '';

  const styles = {
    form: {
      width: '600px',
      paddingBottom: '1rem',
      marginTop: '3rem',
      height: '100%',
      overflow: 'hidden',
    },
    label: {
      color: isDarkMode ? '' : '#00000073',
      fontWeight: 500,
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '1rem',
    },
    drawerFooter: {
      display: 'flex',
      justifyContent: 'right',
      padding: '10px 16px',
    },
    container: {
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      padding: '3rem 0',
      backgroundColor: isDarkMode ? 'black' : '#FAFAFA',
    },
    contentContainer: {
      backgroundColor: isDarkMode ? '#141414' : 'white',
      marginTop: '1.5rem',
      paddingTop: '3rem',
      margin: '1.5rem auto 0',
      width: '100%',
      maxWidth: '66.66667%',
      maxHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
    },
    space: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '0',
      flexGrow: 1,
      width: '100%',
    },
    steps: {
      margin: '1rem 0',
      width: '600px',
    },
    stepContent: {
      flexGrow: 1,
      width: '600px',
    },
    actionButtons: {
      flexGrow: 1,
      width: '600px',
      marginBottom: '1rem',
    },
  };

  const handleTemplateSelected = (templateId: string) => {
    setTemplateId(templateId);
  };

  const toggleTemplateSelector = (isOpen: boolean) => {
    startTransition(() => setOpen(isOpen));
  };

  const handleListItemChange = (
    id: number,
    value: string,
    setter: React.Dispatch<React.SetStateAction<Task[] | Email[]>>,
    items: Task[] | Email[]
  ) => {
    setter(items.map(item => (item.id === id ? { ...item, value } : item)));
  };

  // TODO: automatically focus on the next input field
  const handleAddItem = (
    items: Task[] | Email[],
    setter: React.Dispatch<React.SetStateAction<Task[] | Email[]>>,
    validateFn?: (value: string) => boolean
  ) => {
    const lastItem = items[items.length - 1];
    if (lastItem.value.trim() && (!validateFn || validateFn(lastItem.value))) {
      setter([...items, { id: items.length + 1, value: '' }]);
    } else {
      <Alert message="Please fill the field correctly before adding a new one" type="error" />;
    }
  };

  const handleRemoveItem = (
    id: number,
    items: Task[] | Email[],
    setter: React.Dispatch<React.SetStateAction<Task[] | Email[]>>
  ) => {
    if (items.length > 1) {
      setter(items.filter(item => item.id !== id));
    }
  };

  const createFromTemplate = async () => {
    toggleTemplateSelector(false);
    setCreatingFromTemplate(true);
    try {
      const model: IAccountSetupRequest = {
        team_name: organizationName,
        project_name: projectName,
        template_id: templateId || null,
        tasks: tasks.map(task => task.value),
        team_members: emails.map(email => email.value),
      };
      const res = await projectTemplatesApiService.setupAccount(model);
      if (res.done) {
        navigate('/worklenz/home');
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const completeAccountSetup = async (skip = false) => {
    try {
      const model: IAccountSetupRequest = {
        team_name: organizationName,
        project_name: projectName,
        tasks: tasks.map(task => task.value),
        team_members: skip ? [] : emails.map(email => email.value),
      };
      const res = await profileSettingsApiService.setupAccount(model);
      if (res.done) {
        navigate('/worklenz/home');
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const renderFormStep = (
    title: string,
    inputLabel: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    placeholder: string,
    onEnter?: () => void
  ) => (
    <Form className="step-form" style={styles.form}>
      <Form.Item>
        <Title level={2} style={{ marginBottom: '1rem' }}>
          {title}
        </Title>
      </Form.Item>
      <Form.Item
        layout="vertical"
        rules={[{ required: true }]}
        label={<span style={styles.label}>{inputLabel}</span>}
      >
        <Input placeholder={placeholder} value={value} onChange={onChange} onPressEnter={onEnter} />
      </Form.Item>
    </Form>
  );

  const steps = [
    {
      title: '',
      content: renderFormStep(
        t('nameYourOrganization'),
        t('worklenzAccountTitle'),
        organizationName,
        e => setOrganizationName(e.target.value),
        organizationNamePlaceholder,
        () => setCurrent(prev => prev + 1)
      ),
    },
    {
      title: '',
      content: (
        <>
          {renderFormStep(
            t('step1Title'),
            t('inputLabel'),
            projectName,
            e => setProjectName(e.target.value),
            'e.g. Worklenz marketing plan',
            () => setCurrent(prev => prev + 1)
          )}
          <div style={{ position: 'relative' }}>
            <Title level={4} className={isDarkMode ? 'vert-text-dark' : 'vert-text'}>
              {t('or')}
            </Title>
            <div className={isDarkMode ? 'vert-line-dark' : 'vert-line'} />
          </div>

          <div className="flex justify-center">
            <Button onClick={() => toggleTemplateSelector(true)} type="primary">
              {t('templateButton')}
            </Button>
          </div>
          <Drawer
            title={t('templateDrawerTitle')}
            width={1000}
            onClose={() => toggleTemplateSelector(false)}
            open={open}
            footer={
              <div style={styles.drawerFooter}>
                <Button
                  style={{ marginRight: '8px' }}
                  onClick={() => toggleTemplateSelector(false)}
                >
                  {t('cancel')}
                </Button>
                <Button type="primary" onClick={() => createFromTemplate()}>
                  {t('create')}
                </Button>
              </div>
            }
          >
            <TemplateDrawer showBothTabs={false} templateSelected={handleTemplateSelected} />
          </Drawer>
        </>
      ),
    },
    {
      title: '',
      content: (
        <Form className="create-first-task-form" style={{ ...styles.form, minHeight: '300px' }}>
          <Form.Item>
            <Title level={2}>{t('step2Title')}</Title>
          </Form.Item>
          <List
            dataSource={tasks}
            renderItem={(task, index) => (
              <List.Item>
                <div style={{ display: 'flex', width: '600px' }}>
                  <Input
                    placeholder="Your Task"
                    value={task.value}
                    id={`task-input-${index}`}
                    onChange={e => handleListItemChange(task.id, e.target.value, setTasks, tasks)}
                    onPressEnter={() => handleAddItem(tasks, setTasks)}
                  />
                  <Button
                    className="custom-close-button"
                    style={{ marginLeft: '48px' }}
                    type="text"
                    icon={
                      <CloseCircleOutlined
                        style={{ fontSize: '20px', color: isDarkMode ? '' : '#00000073' }}
                      />
                    }
                    onClick={() => handleRemoveItem(task.id, tasks, setTasks)}
                  />
                </div>
              </List.Item>
            )}
          />
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={() => handleAddItem(tasks, setTasks)}
            style={{ marginTop: '16px' }}
          >
            {t('addAnother')}
          </Button>
        </Form>
      ),
    },
    {
      title: '',
      content: (
        <Form className="invite-members-form" style={{ ...styles.form, minHeight: '300px' }}>
          <Form.Item>
            <Title level={2}>{t('step3Title')}</Title>
          </Form.Item>
          <List
            dataSource={emails}
            renderItem={email => (
              <List.Item>
                <div style={{ display: 'flex', width: '600px' }}>
                  <Input
                    placeholder="Email address"
                    value={email.value}
                    onChange={e =>
                      handleListItemChange(email.id, e.target.value, setEmails, emails)
                    }
                  />
                  <Button
                    className="custom-close-button"
                    style={{ marginLeft: '48px' }}
                    type="text"
                    icon={
                      <CloseCircleOutlined
                        style={{ fontSize: '20px', color: isDarkMode ? '' : '#00000073' }}
                      />
                    }
                    onClick={() => handleRemoveItem(email.id, emails, setEmails)}
                  />
                </div>
              </List.Item>
            )}
          />
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={() => handleAddItem(emails, setEmails, validateEmail)}
            style={{ marginTop: '16px' }}
          >
            {t('addAnother')}
          </Button>
        </Form>
      ),
    },
  ];

  const isValid = () => {
    if (current === 0) return organizationName.trim() === '';
    if (current === 1) return projectName.trim() === '';
    if (current === 2) return !tasks.some(task => task.value.trim() !== '');
    if (current === 3) return !emails.some(email => validateEmail(email.value));
    return false;
  };

  const nextStep = () => {
    if (current === 3) {
      completeAccountSetup();
    } else {
      setCurrent(prev => prev + 1);
    }
  };

  return (
    <div style={styles.container}>
      <div>
        <img src={isDarkMode ? logoDark : logo} alt="Logo" width={235} height={50} />
      </div>
      <Title level={5} style={{ textAlign: 'center', margin: '4px 0 24px' }}>
        {t('setupYourAccount')}
      </Title>
      <div style={styles.contentContainer}>
        <Space className={isDarkMode ? 'dark-mode' : ''} direction="vertical" style={styles.space}>
          <Steps
            className={isValid() ? 'step' : 'progress-steps'}
            current={current}
            items={steps}
            style={styles.steps}
          />
          <div className="step-content" style={styles.stepContent}>
            {steps[current].content}
          </div>
          <div style={styles.actionButtons}>
            <div
              style={{
                display: 'flex',
                justifyContent: current !== 0 ? 'space-between' : 'flex-end',
              }}
            >
              {current !== 0 && (
                <div>
                  <Button
                    style={{ padding: 0 }}
                    type="link"
                    className="my-7"
                    onClick={() => setCurrent(prev => prev - 1)}
                  >
                    {t('goBack')}
                  </Button>
                  {current === 3 && (
                    <Button
                      style={{ color: isDarkMode ? '' : '#00000073', fontWeight: 500 }}
                      type="link"
                      className="my-7"
                      onClick={() => completeAccountSetup(true)}
                    >
                      {t('skipForNow')}
                    </Button>
                  )}
                </div>
              )}
              <Button
                type="primary"
                htmlType="submit"
                disabled={isValid()}
                className="my-7"
                onClick={() => nextStep()}
              >
                {t('continue')}
              </Button>
            </div>
          </div>
        </Space>
      </div>
    </div>
  );
};

export default AccountSetup;
