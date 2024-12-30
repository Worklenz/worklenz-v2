import React from 'react';
import RatecardTable from './reatecard-table/ratecard-table';
import { Button, Flex, Typography } from 'antd';
import ImportRatecardsDrawer from '../../../../../features/finance/ratecard-drawer/import-ratecards-drawer';

const RatecardTab = () => {
  return (
    <Flex vertical gap={8}>
      <RatecardTable />

      <Typography.Text
        type="danger"
        style={{ display: 'block', marginTop: '10px' }}
      >
        * This rate card is generated based on the company's standard job titles
        and rates. However, you have the flexibility to modify it according to
        the project. These changes will not impact the organization's standard
        job titles and rates.
      </Typography.Text>
      <Button
        type="primary"
        style={{
          marginTop: '10px',
          width: 'fit-content',
          alignSelf: 'flex-end',
        }}
      >
        Save
      </Button>

      {/* import ratecards drawer  */}
      <ImportRatecardsDrawer />
    </Flex>
  );
};

export default RatecardTab;
