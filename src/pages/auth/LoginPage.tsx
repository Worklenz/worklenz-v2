import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
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

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Localization
  const { t } = useTranslation('loginPage');

  // media queries from react-responsive package
  const isMobile = useMediaQuery({ query: '(max-width: 576px)' });

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      setTimeout(() => {
        navigate('/worklenz/home');
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
        name="login"
        layout="vertical"
        autoComplete="off"
        requiredMark="optional"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        style={{ width: '100%' }}
      >
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              type: 'email',
              message: t('emailRequired'),
            },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder={t('emailPlaceholder')}
            size="large"
            style={{ borderRadius: 4 }}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: t('passwordRequired'),
              min: 8,
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t('passwordPlaceholder')}
            size="large"
            style={{ borderRadius: 4 }}
          />
        </Form.Item>

        <Form.Item>
          <Flex justify="space-between" align="center">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>{t('rememberMe')}</Checkbox>
            </Form.Item>

            <Link
              to="/auth/forgot-password"
              className="ant-typography ant-typography-link blue-link"
              style={{ fontSize: 14 }}
            >
              {t('forgotPasswordButton')}
            </Link>
          </Flex>
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
              {t('loginButton')}
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
              {t('dontHaveAccountText')}
            </Typography.Text>

            <Link
              to="/auth/signup"
              className="ant-typography ant-typography-link blue-link"
              style={{ fontSize: 14 }}
            >
              {t('signupButton')}
            </Link>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default LoginPage;
