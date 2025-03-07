import { BellOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import React from 'react';
import { toggleDrawer } from './notificationSlice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useTranslation } from 'react-i18next';

const NotificationButton = () => {
  const dispatch = useAppDispatch();

  // localization
  const { t } = useTranslation('navbar');

  return (
    <Tooltip title={t('notificationTooltip')} trigger={'hover'}>
      <Button
        style={{ height: '62px', width: '60px' }}
        type="text"
        icon={<BellOutlined style={{ fontSize: 20 }} />}
        onClick={() => dispatch(toggleDrawer())}
      />
    </Tooltip>
  );
};

export default NotificationButton;
