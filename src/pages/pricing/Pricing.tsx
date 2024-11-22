import { Flex } from 'antd';
import React from 'react';
import PricingHeader from './PricingHeader';
import PricingPlanContainer from './pricePlans/PricingPlanContainer';
import ComparePlansTableContainer from './comparePlansTable/ComparePlansTableContainer';
import PricingFAQ from './pricingFAQ/PricingFAQ';

const Pricing = () => {
  return (
    <Flex vertical gap={36} align="center">
      <PricingHeader />

      <PricingPlanContainer />

      <ComparePlansTableContainer />

      <PricingFAQ />
    </Flex>
  );
};

export default Pricing;
