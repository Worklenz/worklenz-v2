import { Flex, Input, Select, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

type PricingSeatsSelectorProps = {
  defaultSeats: number;
  setSeats: (noOfSeats: number) => void;
};

const PricingSeatsSelector = ({
  defaultSeats: seats = 5,
  setSeats,
}: PricingSeatsSelectorProps) => {
  //   localization
  const { t } = useTranslation('pricingPage');

  //   seats options list
  const seatsOptions = [5, 10, 15, 20, 25, 30].map((seatCount) => ({
    key: seatCount,
    value: seatCount,
    label: `${seatCount} ${t('seatsText', 'seats')}`,
  }));

  //   function to handle seats change
  const handleChange = (value: number) => {
    setSeats(value);
  };

  return (
    <Flex vertical gap={8} align="center">
      <Typography.Text>{t('chooseTeamSizeText')}</Typography.Text>
      <Select
        defaultValue={seats}
        style={{ width: 100 }}
        options={seatsOptions}
        onChange={handleChange}
      />
    </Flex>
  );
};

export default PricingSeatsSelector;
