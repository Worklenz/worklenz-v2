import { Flex, Typography } from 'antd'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import AdminCenterSidebar from '../pages/adminCenter/sidebar/AdminCenterSidebar'
import { useTranslation } from 'react-i18next'

const AdminCenterLayout: React.FC = () => {
    const isTablet = useMediaQuery({ query: '(min-width: 768px)' })
    const { t } = useTranslation('adminCenterSidebar')

    return (
        <div
            style={{
                marginBlock: 96,
                minHeight: '90vh',
                marginLeft: '68px',
                marginRight: '68px',
            }}
        >
            <Typography.Title level={4}>{t('adminCenter')}</Typography.Title>

            {isTablet ? (
                <Flex
                    gap={24}
                    align="flex-start"
                    style={{
                        width: '100%',
                        marginBlockStart: 24,
                    }}
                >
                    <Flex style={{ width: '100%', maxWidth: 250 }}>
                        <AdminCenterSidebar />
                    </Flex>
                    <Flex style={{ width: '100%' }}>
                        <Outlet />
                    </Flex>
                </Flex>
            ) : (
                <Flex
                    vertical
                    gap={24}
                    style={{
                        marginBlockStart: 24,
                    }}
                >
                    <AdminCenterSidebar />
                    <Outlet />
                </Flex>
            )}
        </div>
    )
}

export default AdminCenterLayout
