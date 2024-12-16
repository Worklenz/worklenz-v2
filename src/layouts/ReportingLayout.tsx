import { Col, ConfigProvider, Layout } from 'antd';
import React, { useState } from 'react';
import Navbar from '../features/navbar/Navbar';
import { useAppSelector } from '../hooks/useAppSelector';
import { colors } from '../styles/colors';
import { themeWiseColor } from '../utils/themeWiseColor';
import ReportingSider from '../pages/reporting/sidebar/reporting-sider';
import { Outlet } from 'react-router-dom';
import ReportingCollapsedButton from '../pages/reporting/sidebar/reporting-collapsed-button';

const ReportingLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  // function to handle collapse
  const handleCollapsedToggler = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <ConfigProvider
      wave={{ disabled: true }}
      theme={{
        components: {
          Layout: {
            siderBg: themeMode === 'dark' ? colors.darkGray : colors.white,
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
          className={`shadow-md ${themeMode === 'dark' ? 'shadow-[#5f5f5f1f]' : 'shadow-[#18181811]'}`}
          style={{
            zIndex: 999,
            position: 'fixed',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: 0,
          }}
        >
          <Navbar />
        </Layout.Header>

        <Layout.Sider
          collapsed={isCollapsed}
          collapsedWidth={24}
          width={160}
          style={{
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'fixed',
              zIndex: 120,
              height: '100vh',
              borderInlineEnd: `1px solid ${themeWiseColor('#f0f0f0', '#303030', themeMode)}`,
            }}
          >
            {/* sidebar collapsed button */}
            <ReportingCollapsedButton
              isCollapsed={isCollapsed}
              handleCollapseToggler={handleCollapsedToggler}
            />

            {!isCollapsed && (
              <div style={{ width: 160 }}>
                <ReportingSider />
              </div>
            )}
          </div>
        </Layout.Sider>

        <Layout.Content style={{ marginBlock: 96 }}>
          <Col style={{ paddingInline: 32 }}>
            <Outlet />
          </Col>
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  );
};

export default ReportingLayout;
