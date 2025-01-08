import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Col, ConfigProvider, Flex, Menu, MenuProps } from 'antd';

// Components
import AddMemberDrawer from '../settings/member/AddMemberDrawer';
import HelpButton from './help/HelpButton';
import InviteButton from './invite/InviteButton';
import MobileMenuButton from './mobileMenu/MobileMenuButton';
import NavbarLogo from './NavbarLogo';
import NotficationDrawer from './notification/NotficationDrawer';
import NotificationButton from './notification/NotificationButton';
import ProfileButton from './userProfile/ProfileButton';
import SwitchTeamButton from './switchTeam/SwitchTeamButton';
import UpgradePlanButton from './upgradePlan/UpgradePlanButton';

// Utils & Hooks
import { useResponsive } from '@/hooks/useResponsive';
import { getFromLocalStorage } from '@/utils/localStorageFunctions';
import { navRoutes, NavRoutesType } from './navRoutes';
import { getUserSession } from '@/utils/session-helper';
import { useAuthService } from '@/hooks/useAuth';

const Navbar = () => {
  const [current, setCurrent] = useState<string>('home');
  const isOwnerOrAdmin = useAuthService().isOwnerOrAdmin();

  const location = useLocation();
  // media queries from useResponsive custom hook
  const { isDesktop, isMobile, isTablet } = useResponsive();
  // localization
  const { t } = useTranslation('navbar');

  // in here nav routes list get data locally from the navRoutes array
  const [navRoutesList, setNavRoutesList] = useState<NavRoutesType[]>(
    () => getFromLocalStorage('navRoutes') || navRoutes
  );

  //this useEffect re render the navRoutes list with localstorage change
  useEffect(() => {
    const storedNavRoutesList: NavRoutesType[] = getFromLocalStorage('navRoutes') || navRoutes;
    setNavRoutesList(storedNavRoutesList);
  }, [navRoutesList]);

  // menu type
  type MenuItem = Required<MenuProps>['items'][number];
  // nav links menu
  const navlinkItems: MenuItem[] = navRoutesList.map((route, index) => ({
    key: route.path.split('/').pop() || index,
    label: (
      <Link to={route.path} style={{ fontWeight: 600 }}>
        {t(route.name)}
      </Link>
    ),
  }));

  useEffect(() => {
    // this one return the stirng after worklenz/
    const afterWorklenzString = location.pathname.split('/worklenz/')[1];

    // this one return the stirng after worklenz/ **pathKey** /
    const pathKey = afterWorklenzString.split('/')[0];

    setCurrent(pathKey ?? 'home');
  }, [location]);

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

      <Flex
        align="center"
        justify={isDesktop ? 'space-between' : 'flex-end'}
        style={{ width: '100%' }}
      >
        {/* navlinks menu  */}
        {isDesktop && (
          <Menu
            selectedKeys={[current]}
            mode="horizontal"
            style={{
              flex: 10,
              maxWidth: 720,
              minWidth: 0,
              border: 'none',
            }}
            items={navlinkItems}
          />
        )}

        <Flex gap={20} align="center">
          <ConfigProvider wave={{ disabled: true }}>
            {isDesktop && (
              <Flex gap={20} align="center">
                {isOwnerOrAdmin && <UpgradePlanButton />}
                {isOwnerOrAdmin && <InviteButton />}
                <Flex align="center">
                  <SwitchTeamButton />
                  <NotificationButton />
                  <HelpButton />
                  <ProfileButton isOwnerOrAdmin={isOwnerOrAdmin} />
                </Flex>
              </Flex>
            )}
            {isTablet && !isDesktop && (
              <Flex gap={12} align="center">
                <SwitchTeamButton />
                <NotificationButton />
                <ProfileButton isOwnerOrAdmin={isOwnerOrAdmin} />
                <MobileMenuButton />
              </Flex>
            )}
            {isMobile && (
              <Flex gap={12} align="center">
                <NotificationButton />
                <ProfileButton isOwnerOrAdmin={isOwnerOrAdmin} />
                <MobileMenuButton />
              </Flex>
            )}
          </ConfigProvider>
        </Flex>
      </Flex>

      {/* drawers  */}
      {/* add member drawer  */}
      {isOwnerOrAdmin && <AddMemberDrawer />}
      {/* notification drawer */}
      <NotficationDrawer />
    </Col>
  );
};

export default Navbar;
