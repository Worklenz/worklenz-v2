import { Button, Flex, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useResponsive } from '../../hooks/useResponsive';

const PricingHeader = ({ isExpired = false }: { isExpired?: boolean }) => {
  // localization
  const { t } = useTranslation('pricingPage');

  //   breakpoints from useResponsive custom hook
  const { isMobile } = useResponsive();

  return (
    <Flex vertical align="center">
      <Typography.Title
        level={isMobile ? 3 : 1}
        style={{
          textAlign: 'center',
          fontWeight: 500,
        }}
      >
        {t('headerTitle')}
      </Typography.Title>

      {!isExpired ? (
        <Typography.Text style={{ textAlign: 'center', maxWidth: 720 }}>
          {t('notExpiredFirstText')} date {t('notExpiredLastText')}
        </Typography.Text>
      ) : (
        <Typography.Text style={{ textAlign: 'center', maxWidth: 720 }}>
          {t('expiredFirstText')}{' '}
          <Button type="link" style={{ paddingInline: 4 }}>
            {' '}
            {t('downgradeButton')}
          </Button>
          {t('expiredLastText')}
        </Typography.Text>
      )}
    </Flex>
  );
};

export default PricingHeader;
