import { useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Form, Input, message, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/AuthPageHeader';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';
import { useDocumentTitle } from '@/hooks/useDoumentTItle';
import { useMixpanelTracking } from '@/hooks/useMixpanelTracking';
import { evt_forgot_password_page_visit } from '@/shared/worklenz-analytics-events';
import { verifyAuthentication } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setSession } from '@/utils/session-helper';
import { setUser } from '@/features/user/userSlice';
import logger from '@/utils/errorLogger';
const ForgotPasswordPage = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [urlParams, setUrlParams] = useState({
    teamId: '',
  });

  const navigate = useNavigate();
  const { trackMixpanelEvent } = useMixpanelTracking();
  useDocumentTitle('Forgot Password');
  const dispatch = useAppDispatch();

  // Localization
  const { t } = useTranslation('forgot-password');

  // media queries from react-responsive package
  const isMobile = useMediaQuery({ query: '(max-width: 576px)' });

  useEffect(() => {
    trackMixpanelEvent(evt_forgot_password_page_visit);
    const searchParams = new URLSearchParams(window.location.search);
    setUrlParams({
      teamId: searchParams.get('team') || '',
    });
    const verifyAuthStatus = async () => {
      try {
        const session = await dispatch(verifyAuthentication()).unwrap();
        if (session?.authenticated) {
          setSession(session.user);
          dispatch(setUser(session.user));
          navigate('/worklenz/home');
        }
      } catch (error) {
        logger.error('Failed to verify authentication status', error);
      }
    };
    void verifyAuthStatus();
  }, [dispatch, navigate, trackMixpanelEvent]);

  const onFinish = (values: any) => {
    if (values.email.trim() === '') return;

    setIsLoading(true);
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
        name="forgot-password"
        form={form}
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

        <Form.Item>
          <Flex vertical gap={8}>
            <Button
              block
              type="primary"
              htmlType="submit"
              size="large"
              loading={isLoading}
              style={{ borderRadius: 4 }}
            >
              {t('resetPasswordButton')}
            </Button>
            <Typography.Text style={{ textAlign: 'center' }}>{t('orText')}</Typography.Text>
            <Link to="/auth/login">
              <Button
                block
                type="default"
                size="large"
                style={{
                  borderRadius: 4,
                }}
              >
                {t('returnToLoginButton')}
              </Button>
            </Link>
          </Flex>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ForgotPasswordPage;
