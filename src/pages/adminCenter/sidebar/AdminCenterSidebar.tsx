import { RightOutlined } from '@ant-design/icons'
import { ConfigProvider, Flex, Menu, MenuProps } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import { colors } from '../../../styles/colors'
import { useTranslation } from 'react-i18next'
import { adminCenterItems } from '../adminCenterConstants'
import './AdminCenterSidebar.css'

const AdminCenterSidebar: React.FC = () => {
    // localization
    const { t } = useTranslation('adminCenterSidebar')

    type MenuItem = Required<MenuProps>['items'][number]
    // import menu items from admin center sidebar constants
    const menuItems = adminCenterItems

    // menu items
    const items: MenuItem[] = [
        ...menuItems.map((item) => ({
            key: item.key,
            label: (
                <Flex gap={8} justify="space-between" className="admin-center-sidebar-button">
                    <Flex gap={8}>
                        {item.icon}
                        <Link to={`/worklenz/admin-center/${item.endpoint}`}>
                            {t(item.name)}
                        </Link>
                    </Flex>
                    <RightOutlined style={{ fontSize: 12, fontWeight: 'bold' }} />
                </Flex>
            ),
        })),
    ]

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
                style={{ border: 'none', width: '100%' }}
                mode="vertical"
                items={items}
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['1']}
            />
        </ConfigProvider>
    )
}

export default AdminCenterSidebar
