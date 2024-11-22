import { Button, Tooltip } from 'antd';
import React from 'react';
import { colors } from '../../../styles/colors';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const UpgradePlanButton = () => {
  // localization
  const { t } = useTranslation('navbar');
  const navigate = useNavigate();

  return (
    <Tooltip title={t('upgradePlanTooltip')}>
      <Button
        style={{
          backgroundColor: colors.lightBeige,
          color: '#000000d9',
          padding: '4px 11px',
        }}
        size="small"
        type="text"
        onClick={() => navigate('/worklenz/pricing')}
      >
        {t('upgradePlan')}
      </Button>
    </Tooltip>
  );
};

export default UpgradePlanButton;
