import { RightOutlined } from '@ant-design/icons';
import { ConfigProvider, Flex, Menu, MenuProps } from 'antd';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { colors } from '../../../styles/colors';
import { useTranslation } from 'react-i18next';
import { clientPortalItems } from '../../../lib/client-portal-constants/client-portal-constants';

const ClientPortalSidebar = () => {
  const location = useLocation();
  // localization
  const { t } = useTranslation('client-portal-sidebar');

  type MenuItem = Required<MenuProps>['items'][number];
  // import menu items from settings sidebar constants
  const menuItems = clientPortalItems;

  // function for get the active menu item
  const getCurrentActiveKey = () => {
    // this one return the stirng after worklenz/
    const afterWorklenzString = location.pathname.split(
      '/worklenz/client-portal/'
    )[1];

    // this one return the stirng after worklenz/ **pathKey** /
    const pathKey = afterWorklenzString.split('/')[0];

    return pathKey;
  };

  // menu items
  const items: MenuItem[] = [
    ...menuItems.map((item) => ({
      key: item.key,
      label: (
        <Flex gap={8} justify="space-between">
          <Flex gap={8}>
            {item.icon}
            <Link to={`/worklenz/client-portal/${item.endpoint}`}>
              {t(item.name)}
            </Link>
          </Flex>
          <RightOutlined style={{ fontSize: 12 }} />
        </Flex>
      ),
    })),
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemHoverBg: colors.transparent,
            itemHoverColor: colors.skyBlue,
            borderRadius: 12,
            itemMarginBlock: 4,
          },
        },
      }}
    >
      <Menu
        items={items}
        selectedKeys={[getCurrentActiveKey()]}
        mode="vertical"
        style={{ border: 'none', width: '100%' }}
      />
    </ConfigProvider>
  );
};

export default ClientPortalSidebar;
