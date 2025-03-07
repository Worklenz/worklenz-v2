import React, { useEffect, useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Col, ConfigProvider, Flex, Menu, MenuProps } from 'antd';

import InviteTeamMembers from '../../components/common/invite-team-members/invite-team-members';
import HelpButton from './help/HelpButton';
import InviteButton from './invite/InviteButton';
import MobileMenuButton from './mobileMenu/MobileMenuButton';
import NavbarLogo from './NavbarLogo';
import NotficationDrawer from './notification/NotficationDrawer';
import NotificationButton from './notification/NotificationButton';
import ProfileButton from './user-profile/profile-button';
import SwitchTeamButton from './switchTeam/SwitchTeamButton';
import UpgradePlanButton from './upgradePlan/UpgradePlanButton';

import { useResponsive } from '@/hooks/useResponsive';
import { getJSONFromLocalStorage } from '@/utils/localStorageFunctions';
import { navRoutes, NavRoutesType } from './navRoutes';
import { useAuthService } from '@/hooks/useAuth';
import { createPortal } from 'react-dom';

const Navbar = () => {
  const [current, setCurrent] = useState<string>('home');
  const isOwnerOrAdmin = useAuthService().isOwnerOrAdmin();

  const location = useLocation();
  const { isDesktop, isMobile, isTablet } = useResponsive();
  const { t } = useTranslation('navbar');

  const [navRoutesList, setNavRoutesList] = useState<NavRoutesType[]>(navRoutes);

  useEffect(() => {
    const storedNavRoutesList: NavRoutesType[] = getJSONFromLocalStorage('navRoutes') || navRoutes;
    setNavRoutesList(storedNavRoutesList);
  }, []);

  const navlinkItems = useMemo(
    () =>
      navRoutesList
        .filter((route) => !route.adminOnly || isOwnerOrAdmin)
        .map((route, index) => ({
          key: route.path.split('/').pop() || index,
          label: (
            <Link to={route.path} style={{ fontWeight: 600 }}>
              {t(route.name)}
            </Link>
          ),
        })),
    [navRoutesList, t, isOwnerOrAdmin]
  );

  useEffect(() => {
    const afterWorklenzString = location.pathname.split('/worklenz/')[1];
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

      {isOwnerOrAdmin && createPortal(<InviteTeamMembers />, document.body, 'invite-team-members')}
      {createPortal(<NotficationDrawer />, document.body, 'notification-drawer')}
    </Col>
  );
};

export default Navbar;
