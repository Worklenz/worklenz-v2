import { Flex, Typography } from 'antd';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import ClientPortalSidebar from '../pages/client-portal/sidebar/client-portal-sidebar';

// this layout is a sub layout of the main layout
const ClientPortalLayout = () => {
  // media queries from react-responsive package
  const isTablet = useMediaQuery({ query: '(min-width: 768px)' });

  return (
    <div style={{ marginBlock: 96, minHeight: '90vh' }}>
      <Typography.Title level={4}>Client Portal</Typography.Title>

      {isTablet ? (
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
      ) : (
        <Flex
          vertical
          gap={24}
          style={{
            marginBlockStart: 24,
          }}
        >
          <ClientPortalSidebar />
          <Outlet />
        </Flex>
      )}
    </div>
  );
};

export default ClientPortalLayout;
