import React, { useEffect } from 'react';
import { Card, Flex, Spin, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { verifyAuthentication } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setSession } from '@/utils/session-helper';
import { setUser } from '@/features/user/userSlice';
import logger from '@/utils/errorLogger';

const REDIRECT_DELAY = 500; // Delay in milliseconds before redirecting

const AuthenticatingPage: React.FC = () => {
  const { t } = useTranslation('auth/auth-common');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleAuthentication = async () => {
      try {
        const session = await dispatch(verifyAuthentication()).unwrap();
        logger.info('Authentication session:', session);

        if (!session.authenticated) {
          return navigate('/auth/login');
        }

        // Set user session and state
        setSession(session.user);
        dispatch(setUser(session.user));

        // Redirect based on setup status
        setTimeout(() => {
          const redirectPath = session.user.setup_completed 
            ? '/worklenz/home'
            : '/worklenz/setup';
          navigate(redirectPath);
        }, REDIRECT_DELAY);

      } catch (error) {
        logger.error('Authentication verification failed:', error);
        navigate('/auth/login');
      }
    };

    void handleAuthentication();
  }, [dispatch, navigate]);

  const cardStyles = {
    width: '100%',
    boxShadow: 'none'
  };

  return (
    <Card style={cardStyles}>
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
