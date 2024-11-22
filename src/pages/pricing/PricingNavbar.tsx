import React from 'react';
import NavbarLogo from '../../features/navbar/NavbarLogo';
import { Button, Col, Flex, Typography } from 'antd';
import { useResponsive } from '../../hooks/useResponsive';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const PricingNavbar = () => {
  //   localization
  const { t } = useTranslation('pricingPage');

  //   breakpoints from useResponsive custom hook
  const { isDesktop } = useResponsive();

  const navigate = useNavigate();

  return (
    <Col
      style={{
        width: '100%',
        display: 'flex',
        paddingInline: isDesktop ? 48 : 24,
        gap: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* logo */}
      <NavbarLogo />

      <Flex gap={8} align="center">
        <Typography.Text className="hidden md:block">
          {t('inqueryText')}
        </Typography.Text>
        <Button type="primary">{t('contactButton')}</Button>
        <Button onClick={() => navigate(-1)}>{t('backButton')}</Button>
      </Flex>
    </Col>
  );
};

export default PricingNavbar;
