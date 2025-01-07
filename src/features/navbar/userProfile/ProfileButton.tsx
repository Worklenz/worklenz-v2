// Ant Design
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Dropdown, Flex, MenuProps, Tooltip, Typography } from 'antd';

// React & Router
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Redux
import { useAppSelector } from '@/hooks/useAppSelector';
import { RootState } from '@/app/store';

// Utils & Constants
import { AvatarNamesMap } from '@/shared/constants';
import { getRole, getUserSession } from '@/utils/session-helper';

// Styles
import './profileDropdown.css';
import './ProfileButton.css';

interface ProfileButtonProps {
  isOwnerOrAdmin: boolean;
}

const ProfileButton = ({ isOwnerOrAdmin }: ProfileButtonProps) => {
  const { t } = useTranslation('navbar');
  const userDetails = getUserSession();
  const role = getRole();
  const themeMode = useAppSelector((state: RootState) => state.themeReducer.mode);

  const renderAvatar = () => {
    if (userDetails?.avatar_url) {
      return <Avatar src={userDetails.avatar_url} />;
    }

    return (
      <Avatar
        style={{
          backgroundColor: AvatarNamesMap[userDetails?.name?.charAt(0) || ''],
          verticalAlign: 'middle',
        }}
      >
        {userDetails?.name?.charAt(0)}
      </Avatar>
    );
  };

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
                <div>{renderAvatar()}</div>
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
