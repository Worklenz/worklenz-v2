import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import './HelpButton.css';

const HelpButton = () => {
  // localization
  const { t } = useTranslation('navbar');

  return (
    <Tooltip title={t('help')}>
      <Button
        className="notification-icon"
        style={{ height: '62px', width: '60px' }}
        type="text"
        icon={<QuestionCircleOutlined style={{ fontSize: 20 }} />}
      />
    </Tooltip>
  );
};

export default HelpButton;
