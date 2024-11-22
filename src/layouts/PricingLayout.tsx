import { Col, Layout } from 'antd';
import React from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { Outlet } from 'react-router-dom';
import PricingNavbar from '../pages/pricing/PricingNavbar';

const PricingLayout = () => {
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  return (
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
        <PricingNavbar />
      </Layout.Header>

      <Layout.Content style={{ marginBlock: 96 }}>
        <Col style={{ paddingInline: 32 }}>
          <Outlet />
        </Col>
      </Layout.Content>
    </Layout>
  );
};

export default PricingLayout;
