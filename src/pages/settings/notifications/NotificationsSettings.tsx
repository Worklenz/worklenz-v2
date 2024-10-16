import { Card, Checkbox, Divider, Flex, Typography } from 'antd'
import React from 'react'
import { colors } from '../../../styles/colors'
import { useTranslation } from 'react-i18next'

const NotificationsSettings = () => {
    // localization
    const { t } = useTranslation('notificationsSettings')

    return (
        <Card style={{ width: '100%' }}>
            <Flex vertical gap={4}>
                <Flex gap={8} align="center">
                    <Checkbox />
                    <Typography.Title level={4} style={{ marginBlockEnd: 0 }}>
                        {t('emailTitle')}
                    </Typography.Title>
                </Flex>
                <Typography.Text
                    style={{ fontSize: 14, color: colors.lightGray }}
                >
                    {t('emailDescription')}
                </Typography.Text>
            </Flex>
            <Divider />
            <Flex vertical gap={4}>
                <Flex gap={8} align="center">
                    <Checkbox />
                    <Typography.Title level={4} style={{ marginBlockEnd: 0 }}>
                        {t('dailyDigestTitle')}
                    </Typography.Title>
                </Flex>
                <Typography.Text
                    style={{ fontSize: 14, color: colors.lightGray }}
                >
                    {t('dailyDigestDescription')}
                </Typography.Text>
            </Flex>
            <Divider />
            <Flex vertical gap={4}>
                <Flex gap={8} align="center">
                    <Checkbox />
                    <Typography.Title level={4} style={{ marginBlockEnd: 0 }}>
                        {t('popupTitle')}
                    </Typography.Title>
                </Flex>
                <Typography.Text
                    style={{ fontSize: 14, color: colors.lightGray }}
                >
                    {t('popupDescription')}
                </Typography.Text>
            </Flex>
            <Divider />
            <Flex vertical gap={4}>
                <Flex gap={8} align="center">
                    <Checkbox />
                    <Typography.Title level={4} style={{ marginBlockEnd: 0 }}>
                        {t('unreadItemsTitle')}
                    </Typography.Title>
                </Flex>
                <Typography.Text
                    style={{ fontSize: 14, color: colors.lightGray }}
                >
                    {t('unreadItemsDescription')}
                </Typography.Text>
            </Flex>
        </Card>
    )
}

export default NotificationsSettings
