import { UserOutlined } from '@ant-design/icons'
import {
    Avatar,
    Button,
    Card,
    Dropdown,
    Flex,
    MenuProps,
    Tooltip,
    Typography,
} from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
// profile dropdown custom css
import './profileDropdown.css'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { Link } from 'react-router-dom'
import { avatarNamesMap } from '../../../shared/constants'

const ProfileButton = () => {
    // get user data from redux - user reducer
    const userDetails = useAppSelector((state) => state.userReducer)
    // localization
    const { t } = useTranslation('navbar')

    // get avatar character
    const avatarCharacter = userDetails.name[0].toLocaleUpperCase()

    const profile: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <Card
                    className="profile-card"
                    title={
                        <div style={{ paddingBlock: '16px' }}>
                            <Typography.Text>Account</Typography.Text>
                            <Flex gap={8} align="center" justify="flex-start">
                                <div>
                                    <Avatar
                                        style={{
                                            backgroundColor:
                                                avatarNamesMap[avatarCharacter],
                                            verticalAlign: 'middle',
                                        }}
                                    >
                                        {avatarCharacter}
                                    </Avatar>
                                </div>
                                <Flex vertical>
                                    <Typography.Text>
                                        {userDetails.name}
                                    </Typography.Text>
                                    <Typography.Text style={{ fontSize: 12 }}>
                                        {userDetails.email}
                                    </Typography.Text>
                                    <Typography.Text
                                        type="secondary"
                                        style={{ fontSize: 12 }}
                                    >
                                        ({userDetails.userRole})
                                    </Typography.Text>
                                </Flex>
                            </Flex>
                        </div>
                    }
                    bordered={false}
                    style={{ width: 230 }}
                >
                    {/* <Typography.Link
                        href="/worklenz/admin-center/overview"
                        style={{ color: colors.darkGray }}
                    >
                        Admin Center
                    </Typography.Link>
                    <Typography.Link
                        href="/worklenz/settings/profile"
                        style={{ color: colors.darkGray }}
                    >
                        Settings
                    </Typography.Link>
                    <Typography.Link
                        href="/auth/login"
                        style={{ color: colors.darkGray }}
                    >
                        Log Out
                    </Typography.Link>*/}

                    <Link to="/worklenz/admin-center">Admin Center</Link>
                    <Link to="/worklenz/settings/profile">Settings</Link>
                    <Link to="/auth/login">Log Out</Link>
                </Card>
            ),
        },
    ]

    return (
        <Tooltip title={t('profileTooltip')}>
            <Dropdown
                overlayClassName="profile-dropdown"
                menu={{ items: profile }}
                placement="bottomRight"
                trigger={['click']}
            >
                <Button
                    className="borderless-icon-btn"
                    icon={<UserOutlined style={{ fontSize: 20 }} />}
                />
            </Dropdown>
        </Tooltip>
    )
}

export default ProfileButton
