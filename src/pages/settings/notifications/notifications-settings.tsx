import { Card, Checkbox, Divider, Flex, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useDocumentTitle } from '../../../hooks/useDoumentTItle';

const NotificationsSettings = () => {
  // localization
  const { t } = useTranslation('settings-notifications');
  const themeMode = useAppSelector((state) => state.themeReducer.mode)

  useDocumentTitle('Notifications Settings');

  return (
    <Card style={{ width: '100%' }}>
      <Flex vertical gap={4}>
        <Flex gap={8} align="center">
          <Checkbox />
          <Typography.Title level={4} style={{ marginBlockEnd: 0 }}>
            {t('emailTitle')}
          </Typography.Title>
        </Flex>
        <Typography.Text style={{ fontSize: 14, color: themeMode === 'dark' ? '#9CA3AF' : '#00000073' }}>
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
        <Typography.Text style={{ fontSize: 14, color: themeMode === 'dark' ? '#9CA3AF' : '#00000073'  }}>
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
        <Typography.Text style={{ fontSize: 14, color: themeMode === 'dark' ? '#9CA3AF' : '#00000073'  }}>
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
        <Typography.Text style={{ fontSize: 14, color: themeMode === 'dark' ? '#9CA3AF' : '#00000073'  }}>
          {t('unreadItemsDescription')}
        </Typography.Text>
      </Flex>
    </Card>
  );
};

export default NotificationsSettings;
