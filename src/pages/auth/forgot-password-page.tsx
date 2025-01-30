import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import Form from 'antd/es/form';
import Card from 'antd/es/card';
import Input from 'antd/es/input';
import Flex from 'antd/es/flex';
import Button from 'antd/es/button';
import Typography from 'antd/es/typography';
import Result from 'antd/es/result';

import PageHeader from '@components/AuthPageHeader';

import { useDocumentTitle } from '@/hooks/useDoumentTItle';
import { useMixpanelTracking } from '@/hooks/useMixpanelTracking';
import { evt_forgot_password_page_visit } from '@/shared/worklenz-analytics-events';
import { resetPassword, verifyAuthentication } from '@features/auth/authSlice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setSession } from '@/utils/session-helper';
import { setUser } from '@features/user/userSlice';
import logger from '@/utils/errorLogger';

const ForgotPasswordPage = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [urlParams, setUrlParams] = useState({
    teamId: '',
  });

  const navigate = useNavigate();
  const { trackMixpanelEvent } = useMixpanelTracking();
  useDocumentTitle('Forgot Password');
  const dispatch = useAppDispatch();

  // Localization
  const { t } = useTranslation('auth/forgot-password');

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

  const onFinish = useCallback(
    async (values: any) => {
      if (values.email.trim() === '') return;
      try {
        setIsLoading(true);
        const result = await dispatch(resetPassword(values.email)).unwrap();
        if (result.done) {
          setIsSuccess(true);
        }
      } catch (error) {
        logger.error('Failed to reset password', error);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, t]
  );

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
      {isSuccess ? (
        <Result
          status="success"
          title={t('successTitle')}
          subTitle={t('successMessage')}
        />
      ) : (
        <>
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
        </>
      )}
    </Card>
  );
};

export default ForgotPasswordPage;
