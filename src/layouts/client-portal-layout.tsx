import { Col, ConfigProvider, Flex, Layout, Typography } from 'antd';
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../features/navbar/Navbar';
import { useAppSelector } from '../hooks/useAppSelector';
import { useMediaQuery } from 'react-responsive';
import { colors } from '../styles/colors';
import ClientPortalSidebar from '../pages/client-portal/sidebar/client-portal-sidebar';
import { useTranslation } from 'react-i18next';

const ClientPortalLayout = () => {
  // localization
  const { t } = useTranslation('client-portal-common');

  // theme details from theme slice
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  // useMediaQuery hook to check if the screen is desktop or not
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            colorBgLayout:
              themeMode === 'dark' ? colors.darkGray : colors.white,
            headerBg: themeMode === 'dark' ? colors.darkGray : colors.white,
          },
        },
      }}
    >
      <Layout
        style={{
          minHeight: '100vh',
        }}
      >
        <Layout.Header
          className={`shadow-md ${themeMode === 'dark' ? '' : 'shadow-[#18181811]'}`}
          style={{
            zIndex: 999,
            position: 'fixed',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: 0,
            borderBottom: themeMode === 'dark' ? '1px solid #303030' : '',
          }}
        >
          <Navbar />
        </Layout.Header>

        <Layout.Content>
          <Col
            style={{
              paddingInline: isDesktop ? 64 : 24,
              marginBlockStart: 96,
              overflowX: 'hidden',
            }}
          >
            <Typography.Title level={4}>
              {t('clientPortalTitle')}
            </Typography.Title>

            <Flex
              gap={24}
              align="flex-start"
              style={{
                width: '100%',
                marginBlockStart: 24,
              }}
            >
              <Flex style={{ width: '100%', maxWidth: 240 }}>
                <ClientPortalSidebar />
              </Flex>
              <Flex style={{ width: '100%' }}>
                <Outlet />
              </Flex>
            </Flex>
          </Col>
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  );
};

export default ClientPortalLayout;
