import React, { useEffect, useState } from 'react';
import { Col, ConfigProvider, Flex, Menu, MenuProps } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InviteButton from './invite/InviteButton';
import SwitchTeamButton from './switchTeam/SwitchTeamButton';
import NotificationButton from './notification/NotificationButton';
import ProfileButton from './userProfile/ProfileButton';
import AddMemberDrawer from '../settings/member/AddMemberDrawer';
import NotficationDrawer from './notification/NotficationDrawer';
import HelpButton from './help/HelpButton';
import UpgradePlanButton from './upgradePlan/UpgradePlanButton';
import MobileMenuButton from './mobileMenu/MobileMenuButton';
import NavbarLogo from './NavbarLogo';
import { getFromLocalStorage } from '../../utils/localStorageFunctions';
import { navRoutes, NavRoutesType } from './navRoutes';
import { useResponsive } from '../../hooks/useResponsive';

const Navbar = () => {
  const [current, setCurrent] = useState<string>('home');
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
    const storedNavRoutesList: NavRoutesType[] =
      getFromLocalStorage('navRoutes') || navRoutes;
    setNavRoutesList(storedNavRoutesList);
  }, [navRoutesList]);

  // menu type
  type MenuItem = Required<MenuProps>['items'][number];
  // nav links menu
  const navlinkItems: MenuItem[] = navRoutesList.map((route, index) => ({
    key: route.path.split('/').pop() || index,
    label: (
      <Link
        to={
          route.initialChild
            ? `${route.path}/${route.initialChild}`
            : route.path
        }
        style={{ fontWeight: 600 }}
      >
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
                <UpgradePlanButton />
                <InviteButton />
                <Flex align="center">
                  <SwitchTeamButton />
                  <NotificationButton />
                  <HelpButton />
                  <ProfileButton />
                </Flex>
              </Flex>
            )}
            {isTablet && !isDesktop && (
              <Flex gap={12} align="center">
                <SwitchTeamButton />
                <NotificationButton />
                <ProfileButton />
                <MobileMenuButton />
              </Flex>
            )}
            {isMobile && (
              <Flex gap={12} align="center">
                <NotificationButton />
                <ProfileButton />
                <MobileMenuButton />
              </Flex>
            )}
          </ConfigProvider>
        </Flex>
      </Flex>

      {/* drawers  */}
      {/* add member drawer  */}
      <AddMemberDrawer />
      {/* notification drawer */}
      <NotficationDrawer />
    </Col>
  );
};

export default Navbar;
