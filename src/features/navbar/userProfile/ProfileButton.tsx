import { UserOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Dropdown,
  Flex,
  MenuProps,
  Tooltip,
  Typography,
} from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
// profile dropdown custom css
import './profileDropdown.css';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { RootState } from '../../../app/store';
import './ProfileButton.css';

import { Link } from 'react-router-dom';
import CustomAvatar from '../../../components/CustomAvatar';

const ProfileButton = () => {
  // get user data from redux - user reducer
  const userDetails = useAppSelector((state) => state.userReducer);
  // localization
  const { t } = useTranslation('navbar');

  const themeMode = useAppSelector(
    (state: RootState) => state.themeReducer.mode
  );

  const profile: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Card
          className={`profile-card ${themeMode === 'dark' ? 'dark' : ''}`}
          title={
            <div style={{ paddingBlock: '16px' }}>
              <Typography.Text>Account</Typography.Text>
              <Flex gap={8} align="center" justify="flex-start">
                <div>
                  <CustomAvatar avatarName={userDetails.name} />
                </div>
                <Flex vertical>
                  <Typography.Text>{userDetails.name}</Typography.Text>
                  <Typography.Text style={{ fontSize: 12 }}>
                    {userDetails.email}
                  </Typography.Text>
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    ({userDetails.userRole})
                  </Typography.Text>
                </Flex>
              </Flex>
            </div>
          }
          bordered={false}
          style={{ width: 230 }}
        >
          <Link
            to="/worklenz/admin-center/overview"
            style={{
              color: `${themeMode === 'dark' ? '#ffffffd9' : '#181818'}`,
            }}
          >
            Admin Center
          </Link>
          <Link
            to="/worklenz/settings/profile"
            style={{
              color: `${themeMode === 'dark' ? '#ffffffd9' : '#181818'}`,
            }}
          >
            Settings
          </Link>
          <Link
            to="/auth/login"
            style={{
              color: `${themeMode === 'dark' ? '#ffffffd9' : '#181818'}`,
            }}
          >
            Log Out
          </Link>
        </Card>
      ),
    },
  ];

  return (
    <Tooltip title={t('profileTooltip')}>
      <Dropdown
        overlayClassName="profile-dropdown"
        menu={{ items: profile }}
        placement="bottomRight"
        trigger={['click']}
      >
        <Button
          className="profile-button"
          style={{ height: '62px', width: '60px' }}
          type="text"
          icon={<UserOutlined style={{ fontSize: 20 }} />}
        />
      </Dropdown>
    </Tooltip>
  );
};

export default ProfileButton;
