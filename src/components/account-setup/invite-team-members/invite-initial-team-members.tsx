import React, { startTransition, useState } from 'react';
import { Alert, Button, Form, Input, List, Typography } from 'antd';
import {
  CloseCircleOutlined,
  MailOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import './invite-team-members.css';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

interface InviteInitialTeamMembersProps {
  onGoBack: () => void;
}

interface Email {
  id: number;
  value: string;
}

const InviteInitialTeamMembers: React.FC<InviteInitialTeamMembersProps> = ({
  onGoBack,
}) => {
  const [emails, setEmails] = useState<Email[]>([
    { id: Date.now(), value: '' },
  ]);
  const themeMode = useSelector((state: RootState) => state.themeReducer.mode);

  const { t } = useTranslation('invite-team-members');

  const navigate = useNavigate()

  const handleInputChange = (
    id: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setEmails(
      emails.map((email) => (email.id === id ? { ...email, value } : email))
    );
  };

  const addEmail = () => {
    const lastTask = emails[emails.length - 1];
    if (lastTask.value.trim() !== '') {
      setEmails([...emails, { id: Date.now(), value: '' }]);
    } else {
      <Alert
        message="Please fill the email before adding a new one"
        type="error"
      />;
    }
  };

  const removeEmail = (id: number) => {
    if (emails.length > 1) {
      setEmails(emails.filter((email) => email.id !== id));
    }
  };

  const isButtonDisabled = emails.some((email) => email.value.trim() === '');

  const handleGoBack = () => {
    startTransition(() => {
      onGoBack();
    });
  };

  return (
    <Form
      className="invite-members-form"
      style={{
        minHeight: '300px',
        width: '600px',
        paddingBottom: '1rem',
        marginBottom: '3rem',
        marginTop: '3rem',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Form.Item>
        <Title level={2} style={{ marginBottom: '1rem' }}>
          {t('formTitle')}
          <br />
          <Text style={{ fontSize: '20px', fontWeight: 400 }}>
            "<mark>Test</mark>"
          </Text>
        </Title>
      </Form.Item>
      <Form.Item
        layout="vertical"
        rules={[{ required: true }]}
        label={
          <span
            style={{
              color: themeMode === 'dark' ? '' : '#00000073',
              fontWeight: 500,
            }}
          >
            {t('inputLable')}{' '}
            <span style={{ marginLeft: '0.25rem' }}>
              <MailOutlined />
            </span>
          </span>
        }
      >
        <List
          dataSource={emails}
          renderItem={(email) => (
            <List.Item>
              <div style={{ display: 'flex', width: '600px' }}>
                <Input
                  placeholder="Email address"
                  value={email.value}
                  onChange={(e) => handleInputChange(email.id, e)}
                />
                <Button
                  className="custom-close-button"
                  style={{ marginLeft: '48px' }}
                  type="text"
                  icon={
                    <CloseCircleOutlined
                      style={{
                        color: themeMode === 'dark' ? '' : '#00000073',
                        fontSize: '20px',
                      }}
                    />
                  }
                  onClick={() => removeEmail(email.id)}
                />
              </div>
            </List.Item>
          )}
        />
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={addEmail}
          style={{ marginTop: '16px' }}
        >
          {t('addAnother')}
        </Button>
        <div
          style={{
            marginTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <Button
              style={{ padding: '4px 15px 4px 0' }}
              type="link"
              onClick={handleGoBack}
            >
              {t('goBack')}
            </Button>
            <Button
              style={{
                color: themeMode === 'dark' ? '' : '#00000073',
                fontWeight: 500,
              }}
              type="text"
              onClick={() => navigate('/worklenz/home')}
            >
              {t('skipForNow')}
            </Button>
          </div>
          <Button type="primary" htmlType="submit" disabled={isButtonDisabled} onClick={() => navigate('/worklenz/home')}>
            {t('continue')}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default InviteInitialTeamMembers;
