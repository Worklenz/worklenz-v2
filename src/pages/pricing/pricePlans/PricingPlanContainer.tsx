import { ConfigProvider, Flex, Tabs } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TabsProps } from 'antd/lib';
import '../pricing.css';
import { useAppSelector } from '../../../hooks/useAppSelector';
import CloudPricePlans from './CloudPricePlans';
import SelfHostedPlans from './SelfHostedPlans';
import { themeWiseColor } from '../../../utils/themeWiseColor';
import { colors } from '../../../styles/colors';
import PricingSeatsSelector from './PricingSeatsSelector';

const PricingPlanContainer = () => {
  const [seats, setSeats] = useState<number>(5);

  //   localization
  const { t } = useTranslation('pricingPage');

  //   get theme details from theme reducer
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  const tabItems: TabsProps['items'] = [
    {
      key: 'cloud',
      label: t('cloudTab'),
      children: <CloudPricePlans seats={seats} />,
    },
    {
      key: 'selfHosted',
      label: t('selfHostedTab'),
      children: <SelfHostedPlans />,
    },
  ];

  return (
    <ConfigProvider
      wave={{ disabled: true }}
      theme={{
        components: {
          Tabs: {
            cardBg: themeWiseColor('#f5f5f5', '#303030', themeMode),
            itemSelectedColor: colors.white,
            inkBarColor: colors.transparent,
          },
          Button: {
            defaultHoverBg: colors.paleBlue,
          },
        },
      }}
    >
      <Flex vertical gap={24} style={{ width: '100%' }}>
        <PricingSeatsSelector defaultSeats={seats} setSeats={setSeats} />

        <Flex vertical align="center" style={{ width: '100%' }}>
          <Tabs
            className="custom-tab"
            type="card"
            size="large"
            items={tabItems}
            defaultActiveKey="cloud"
            style={{ width: '100%', maxWidth: 800 }}
          />
        </Flex>
      </Flex>
    </ConfigProvider>
  );
};

export default PricingPlanContainer;
