import { Flex, Typography } from 'antd';
import React from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useTranslation } from 'react-i18next';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { colors } from '../../../styles/colors';
import { privilegesTableData } from '../../../lib/pricing/privilegesFeaturesData';

const PrivilegesFeaturesTable = () => {
  // localization
  const { t } = useTranslation('pricingPagePrivilegesFeatures');

  //   get theme details from theme reducer
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  //   table styles
  const tableBorder = `border-[1px] ${themeMode === 'dark' ? 'border-[#707070]' : 'border-[#e5e7eb]'} `;
  const backgroudColor = `${themeMode === 'dark' ? 'bg-[#707070]' : 'bg-[#e5e7eb]'} `;
  const oddRowsbackgroudColor = `${themeMode === 'dark' ? 'bg-[#303030]' : 'bg-[#f9fafb]'} `;

  return (
    <>
      {privilegesTableData.map((item) => (
        <table key={item.title} className={`${tableBorder}`}>
          <thead>
            <tr>
              <th className={`${backgroudColor} ${tableBorder} flex px-4 py-3`}>
                <Typography.Text className="text-[16px] font-medium">
                  {t(item.title)}
                </Typography.Text>
              </th>
            </tr>
          </thead>

          <tbody>
            {item.featuresList.map((row, index) => (
              <tr
                key={index}
                className={`grid grid-cols-3 ${
                  index % 2 === 0 ? oddRowsbackgroudColor : ''
                }`}
              >
                <td className={`${tableBorder} border-x p-4`}>
                  <Flex vertical>
                    <Typography.Text className="font-medium">
                      {t(row.featureTitle)}
                    </Typography.Text>
                    <Typography.Text
                      type="secondary"
                      className="text-[12px] font-medium"
                    >
                      {t(row.featureSubTitle)}
                    </Typography.Text>
                  </Flex>
                </td>
                <td className={`${tableBorder} border-x p-4`}>
                  {row.isFreeFeature ? (
                    <CheckCircleTwoTone />
                  ) : (
                    <CloseCircleTwoTone twoToneColor={colors.vibrantOrange} />
                  )}
                </td>
                <td className={`${tableBorder} border-x p-4`}>
                  {' '}
                  {row.isProFeature ? (
                    <CheckCircleTwoTone />
                  ) : (
                    <CloseCircleTwoTone twoToneColor={colors.vibrantOrange} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </>
  );
};

export default PrivilegesFeaturesTable;
