import { ConfigProvider, Flex, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useResponsive } from '../../../hooks/useResponsive';
import OverviewDetailsTable from './OverviewDetailsTable';
import PrivilegesFeaturesTable from './PrivilegesFeaturesTable';

const ComparePlansTableContainer = () => {
  // localization
  const { t } = useTranslation('pricingPage');

  //   breakpoints from useResponsive custom hook
  const { isMobile } = useResponsive();

  return (
    <ConfigProvider wave={{ disabled: true }}>
      <Flex
        vertical
        gap={24}
        style={{ width: '100%', maxWidth: 1200, marginBlockStart: 24 }}
      >
        <Flex vertical>
          <Typography.Title level={isMobile ? 4 : 2}>
            {t('comparePlansTitle')}
          </Typography.Title>
          <Typography.Text>{t('comparePlansSubTitle')}</Typography.Text>
        </Flex>
        <Flex vertical>
          <OverviewDetailsTable />
          <PrivilegesFeaturesTable />
        </Flex>
      </Flex>
    </ConfigProvider>
  );
};

export default ComparePlansTableContainer;
