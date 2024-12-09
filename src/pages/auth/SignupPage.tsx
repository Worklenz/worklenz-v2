import React, { useState } from 'react';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Flex,
  Form,
  Input,
  message,
  Space,
  Typography,
} from 'antd';
import googleIcon from '../../assets/images/google-icon.png';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/AuthPageHeader';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';
import { useDocumentTitle } from '../../hooks/useDoumentTItle';

const SignupPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useDocumentTitle('Signup');

  // Localization
  const { t } = useTranslation('signupPage');

  // media queries from react-responsive package
  const isMobile = useMediaQuery({ query: '(max-width: 576px)' });

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      message.success(t('signupSuccessMessage'));

      setTimeout(() => {
        navigate('/worklenz/setup');
      }, 500);
    }, 1500);
  };

  return (
    <Card
      style={{
        width: '100%',
        boxShadow: 'none',
      }}
      styles={{
        body: {
          paddingInline: isMobile ? 24 : 48,
        },
      }}
      bordered={false}
    >
      <PageHeader description={t('headerDescription')} />
      <Form
        name="signup"
        layout="vertical"
        autoComplete="off"
        requiredMark="optional"
        onFinish={onFinish}
        style={{ width: '100%' }}
      >
        <Form.Item
          name="name"
          label={t('nameLabel')}
          rules={[
            {
              required: true,
              message: t('nameRequired'),
              whitespace: true,
            },
            {
              min: 4,
              message: t('nameMinCharacterRequired'),
            },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder={t('namePlaceholder')}
            size="large"
            style={{ borderRadius: 4 }}
          />
        </Form.Item>

        <Form.Item
          name="email"
          label={t('emailLabel')}
          rules={[
            {
              required: true,
              type: 'email',
              message: t('emailRequired'),
            },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder={t('emailPlaceholder')}
            size="large"
            style={{ borderRadius: 4 }}
          />
        </Form.Item>

        <Form.Item
          name="password"
          label={t('passwordLabel')}
          rules={[
            {
              required: true,
              message: t('passwordRequired'),
            },
            {
              min: 8,
              message: t('passwordMinCharacterRequired'),
            },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,
              message: t('passwordPatternRequired'),
            },
          ]}
        >
          <div>
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t('strongPasswordPlaceholder')}
              size="large"
              style={{ borderRadius: 4 }}
            />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {t('passwordValidationAltText')}
            </Typography.Text>
          </div>
        </Form.Item>

        <Form.Item>
          <Typography.Paragraph style={{ fontSize: 14 }}>
            {t('bySigningUpText')}
            <Link to="https://worklenz.com/privacy/"> {t('privacyPolicyLink')}</Link>{' '}
            {t('andText')}
            <Link to="https://worklenz.com/terms/"> {t('termsOfUseLink')}</Link>.
          </Typography.Paragraph>
        </Form.Item>

        <Form.Item>
          <Flex vertical gap={8}>
            <Button
              block
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              style={{ borderRadius: 4 }}
            >
              {t('signupButton')}
            </Button>

            <Typography.Text style={{ textAlign: 'center' }}>
              {t('orText')}
            </Typography.Text>

            <Button
              block
              type="default"
              size="large"
              style={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: 4,
              }}
            >
              <img
                src={googleIcon}
                alt="google icon"
                style={{ maxWidth: 20, width: '100%' }}
              />
              {t('signInWithGoogleButton')}
            </Button>
          </Flex>
        </Form.Item>

        <Form.Item>
          <Space>
            <Typography.Text style={{ fontSize: 14 }}>
              {t('alreadyHaveAccountText')}
            </Typography.Text>

            <Typography.Link href="/auth/login" style={{ fontSize: 14 }}>
              {t('loginButton')}
            </Typography.Link>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SignupPage;
