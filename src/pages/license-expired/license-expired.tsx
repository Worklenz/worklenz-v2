import { useEffect } from 'react';
import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { verifyAuthentication } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { LoadingOutlined } from '@ant-design/icons';

const LicenseExpired = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('license-expired');
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(state => state.auth);

  const checkSubscriptionStatus = async () => {
    const session = await dispatch(verifyAuthentication()).unwrap();
    if (!session.user.is_expired) {
      navigate('/worklenz/home');
    }
  };

  useEffect(() => {
    void checkSubscriptionStatus();
  }, []);

  return (
    <div style={{ marginBlock: 65, minHeight: '90vh' }}>
      {isLoading ? (
        <Result icon={<LoadingOutlined />} title={t('checking')} />
      ) : (
        <Result
          status="warning"
          title={t('title')}
          subTitle={t('subtitle')}
          extra={
            <Button
              type="primary"
              key="console"
              onClick={() => navigate('/worklenz/admin-center/billing')}
            >
              {t('button')}
            </Button>
          }
        />
      )}
    </div>
  );
};

export default LicenseExpired;
