import { Button, Result } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const LicenseExpired = () => {
    const navigate = useNavigate()
    const {t} = useTranslation('licenseExpired')
  return (
    <div style={{ marginBlock: 65, minHeight: '90vh' }}>
        <Result
    status="warning"
    title={t('title')}
    subTitle={t('subtitle')}
    extra={
      <Button type="primary" key="console" onClick={() => navigate('/worklenz/admin-center/billing')}>
        {t('button')}
      </Button>
    }
  />
    </div>
  )
};

export default LicenseExpired;
