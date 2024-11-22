import React from 'react';
import { RouteObject } from 'react-router-dom';
import PricingLayout from '../layouts/PricingLayout';
import Pricing from '../pages/pricing/Pricing';

const pricingRoute: RouteObject = {
  path: '/worklenz/pricing',
  element: <PricingLayout />,
  children: [{ path: '/worklenz/pricing', element: <Pricing /> }],
};

export default pricingRoute;
