import {
  Button,
  ConfigProvider,
  Flex,
  Menu,
  MenuProps,
  Typography,
} from 'antd';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { colors } from '../../../styles/colors';
import { useTranslation } from 'react-i18next';
import { clientViewItems } from '../../../lib/client-view/client-view-constants';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

type ClientViewSiderMenuProps = {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
};

const ClientViewSiderMenu = ({
  isCollapsed,
  setIsCollapsed,
}: ClientViewSiderMenuProps) => {
  const location = useLocation();
  // localization
  const { t } = useTranslation('client-view-common');

  type MenuItem = Required<MenuProps>['items'][number];
  // import menu items from client view sidebar constants
  const menuItems = clientViewItems;

  // function for get the active menu item
  const getCurrentActiveKey = () => {
    // this one return the stirng after clientView/
    const afterClientViewString = location.pathname.split('/client-view/')[1];

    // this one return the stirng after clientView/ **pathKey** /
    const pathKey = afterClientViewString.split('/')[0];

    return pathKey;
  };

  // menu items
  const items: MenuItem[] = [
    ...menuItems.map((item) => ({
      key: item.key,
      label: (
        <Flex gap={8} justify="space-between">
          <Link
            to={`/client-view/${item.endpoint}`}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <div>{item.icon}</div>
            {!isCollapsed && <div>{t(item.name)}</div>}
          </Link>
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
          Button: {
            paddingInline: 20,
            paddingBlock: 24,
          },
        },
      }}
    >
      <Flex vertical gap={12} style={{ width: '100%' }}>
        <Button
          type="text"
          style={{ justifyContent: 'flex-start' }}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          {!isCollapsed && <Typography.Text>{t('dashboard')}</Typography.Text>}
        </Button>

        <Menu
          defaultValue={'services'}
          items={items}
          selectedKeys={[getCurrentActiveKey()]}
          mode="vertical"
          style={{ border: 'none', width: '100%' }}
        />
      </Flex>
    </ConfigProvider>
  );
};

export default ClientViewSiderMenu;
