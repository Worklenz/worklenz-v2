import { Button, Flex, Typography } from 'antd';
import React from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useTranslation } from 'react-i18next';

const OverviewDetailsTable = () => {
  // localization
  const { t } = useTranslation('pricingPage');

  //   get theme details from theme reducer
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  //   table styles
  const tableBorder = `border-[1px] ${themeMode === 'dark' ? 'border-[#707070]' : 'border-[#e5e7eb]'} `;
  const backgroudColor = `${themeMode === 'dark' ? 'bg-[#303030]' : 'bg-[#f3f4f6]'} `;
  const oddRowsbackgroudColor = `${themeMode === 'dark' ? 'bg-[#303030]' : 'bg-[#f9fafb]'} `;

  //   table data list
  const tableData = [
    { feature: t('teamsText'), free: '1', pro: t('unlimitedText') },
    {
      feature: t('storageText'),
      free: '500MB',
      pro: '25GB',
    },
    {
      feature: t('activeProjectsText'),
      free: '3',
      pro: t('unlimitedText'),
    },
    {
      feature: t('teamMembersText'),
      free: t('unlimitedText'),
      pro: t('unlimitedText'),
    },
  ];

  return (
    <table className={`${tableBorder}`}>
      <thead>
        <tr className="grid grid-cols-3">
          <th className={`${tableBorder} border-x p-4`}></th>

          <th className={`${tableBorder} border-x p-4 ${backgroudColor}`}>
            <Flex vertical gap={8} align="center">
              <Flex vertical>
                <Typography.Title level={2}>Free</Typography.Title>
                <Typography.Text className="font-normal">
                  <span className="text-[16px] font-semibold">Free</span>{' '}
                  /month/user
                </Typography.Text>
              </Flex>
              <Button
                type="primary"
                shape="round"
                className="w-full max-w-[180px]"
              >
                Try Now
              </Button>
            </Flex>
          </th>

          <th className={`${tableBorder} border-x p-4 ${backgroudColor}`}>
            <Flex vertical gap={8} align="center">
              <Flex vertical>
                <Typography.Title level={2}>Pro</Typography.Title>
                <Typography.Text className="font-normal">
                  <span className="text-[16px] font-semibold">$5.99</span>{' '}
                  /month/user
                </Typography.Text>
              </Flex>
              <Button
                type="primary"
                shape="round"
                className="w-full max-w-[180px]"
              >
                Try Now
              </Button>
            </Flex>
          </th>
        </tr>
      </thead>

      <tbody>
        {tableData.map((row, index) => (
          <tr
            key={index}
            className={`grid grid-cols-3 ${
              index % 2 === 0 ? oddRowsbackgroudColor : ''
            }`}
          >
            <td className={`${tableBorder} border-x p-4 font-medium`}>
              {row.feature}
            </td>
            <td className={`${tableBorder} border-x p-4`}>{row.free}</td>
            <td className={`${tableBorder} border-x p-4`}>{row.pro}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OverviewDetailsTable;
