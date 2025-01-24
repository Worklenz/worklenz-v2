import { UserOutlined } from '@ant-design/icons';
import { Button, Card, Dropdown, Flex, MenuProps, Tooltip, Typography } from 'antd';

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '@/hooks/useAppSelector';
import { RootState } from '@/app/store';

import { getRole, getUserSession } from '@/utils/session-helper';

import './profile-dropdown.css';
import './profile-button.css';
import SingleAvatar from '@/components/common/single-avatar/single-avatar';

interface ProfileButtonProps {
  isOwnerOrAdmin: boolean;
}

const ProfileButton = ({ isOwnerOrAdmin }: ProfileButtonProps) => {
  const { t } = useTranslation('navbar');
  const userDetails = getUserSession();
  const role = getRole();
  const themeMode = useAppSelector((state: RootState) => state.themeReducer.mode);

  const getLinkStyle = () => ({
    color: themeMode === 'dark' ? '#ffffffd9' : '#181818',
  });

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
                <SingleAvatar avatarUrl={userDetails?.avatar_url} name={userDetails?.name} email={userDetails?.email} />
                <Flex vertical>
                  <Typography.Text>{userDetails?.name}</Typography.Text>
                  <Typography.Text style={{ fontSize: 12 }}>{userDetails?.email}</Typography.Text>
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    ({role})
                  </Typography.Text>
                </Flex>
              </Flex>
            </div>
          }
          bordered={false}
          style={{ width: 230 }}
        >
          {isOwnerOrAdmin && (
            <Link to="/worklenz/admin-center/overview" style={getLinkStyle()}>
              {t('adminCenter')}
            </Link>
          )}
          <Link to="/worklenz/settings/profile" style={getLinkStyle()}>
            {t('settings')}
          </Link>
          <Link to="/auth/logging-out" style={getLinkStyle()}>
            {t('logOut')}
          </Link>
        </Card>
      ),
    },
  ];

  return (
    <Dropdown
      overlayClassName="profile-dropdown"
      menu={{ items: profile }}
      placement="bottomRight"
      trigger={['click']}
    >
      <Tooltip title={t('profileTooltip')}>
        <Button
          className="profile-button"
          style={{ height: '62px', width: '60px' }}
          type="text"
          icon={<UserOutlined style={{ fontSize: 20 }} />}
        />
      </Tooltip>
    </Dropdown>
  );
};

export default ProfileButton;
