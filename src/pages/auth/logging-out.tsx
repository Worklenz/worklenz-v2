import { useEffect } from 'react';
import { Card, Flex, Spin, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthService } from '../../hooks/useAuth';
import { useMediaQuery } from 'react-responsive';
import { authApiService } from '@/api/auth/auth.api.service';

const LoggingOutPage = () => {
  const navigate = useNavigate();
  const auth = useAuthService();
  const { t } = useTranslation('auth/auth-common');
  const isMobile = useMediaQuery({ query: '(max-width: 576px)' });

  useEffect(() => {
    const logout = async () => {
      await auth.signOut();
      await authApiService.logout();
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    };
    void logout();
  }, [auth, navigate]);

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
      <Flex vertical align="center" justify="center" gap={24} style={{ minHeight: '60vh' }}>
        <Spin size="large" />
        <Typography.Title level={3}>
          {t('loggingOut')}
        </Typography.Title>
      </Flex>
    </Card>
  );
};

export default LoggingOutPage;
