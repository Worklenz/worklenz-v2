import { PageHeader } from '@ant-design/pro-components';
import { Tabs, TabsProps } from 'antd';
import React from 'react';
import CurrentBill from '@components/adminCenter/billing/CurrentBill';
import Configuration from '@components/adminCenter/configuration/Configuration';
import { useTranslation } from 'react-i18next';

const Billing: React.FC = () => {
  const { t } = useTranslation('currentBill');

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: t('currentBill'),
      children: <CurrentBill />,
    },
    {
      key: '2',
      label: t('configuration'),
      children: <Configuration />,
    },
  ];

  return (
    <div style={{ width: '100%' }}>
      <PageHeader
        title={<span>{t('title')}</span>}
        style={{ padding: '16px 0' }}
      />
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default Billing;
