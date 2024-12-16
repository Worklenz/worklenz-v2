import React, { useEffect } from 'react';
import { Card, Flex, Spin, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const AuthenticatingPage: React.FC = () => {
  const { t } = useTranslation('auth-common');
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/worklenz/home');
    }, 1000);
  }, []);

  return (
    <Card
      style={{
        width: '100%',
        boxShadow: 'none',
      }}
    >
      <Flex vertical align="center" gap="middle">
        <Spin size="large" />
        <Typography.Title level={3}>
          {t('authenticating', { defaultValue: 'Authenticating...' })}
        </Typography.Title>
        <Typography.Text>
          {t('gettingThingsReady', { defaultValue: 'Getting things ready for you...' })}
        </Typography.Text>
      </Flex>
    </Card>
  );
};

export default AuthenticatingPage;
