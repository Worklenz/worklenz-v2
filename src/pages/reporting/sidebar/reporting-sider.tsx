import { ConfigProvider, Flex, Menu, MenuProps } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { colors } from '@/styles/colors';
import { useTranslation } from 'react-i18next';
import { reportingsItems } from '@/lib/reporting/reporting-constants';

const ReportingSider = () => {
  const location = useLocation();

  // localization
  const { t } = useTranslation('reporting-sidebar');

  // function to get the active menu key based on the current location
  const getCurrentActiveKey = () => {
    const afterWorklenzString = location.pathname?.split(
      '/worklenz/reporting/'
    )[1];
    const pathKey = afterWorklenzString?.split('/')[0];
    return pathKey;
  };

  // helper function to generate menu items with submenus
  const generateMenuItems = (): MenuProps['items'] =>
    reportingsItems.map((item) => {
      if (item.children) {
        return {
          key: item.key,
          label: t(`${item.name}Text`),
          children: item.children.map((child) => ({
            key: child.key,
            label: (
              <Link to={`/worklenz/reporting/${child.endpoint}`}>
                {t(`${child.name}Text`)}
              </Link>
            ),
          })),
        };
      } else {
        return {
          key: item.key,
          label: (
            <Link to={`/worklenz/reporting/${item.endpoint}`}>
              {t(`${item.name}Text`)}
            </Link>
          ),
        };
      }
    });

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemHoverBg: colors.transparent,
            itemHoverColor: colors.skyBlue,
            borderRadius: 12,
            itemMarginBlock: 4,
            subMenuItemBg: colors.transparent,
          },
        },
      }}
    >
      <Flex gap={24} vertical>
        <Menu
          className="custom-reporting-sider"
          items={generateMenuItems()}
          selectedKeys={[getCurrentActiveKey()]}
          mode="inline"
          style={{ width: '100%' }}
        />
      </Flex>
    </ConfigProvider>
  );
};

export default ReportingSider;
