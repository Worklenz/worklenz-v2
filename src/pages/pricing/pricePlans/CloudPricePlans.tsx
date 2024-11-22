import { Button, Flex, Typography } from 'antd';
import React, { useMemo, useState } from 'react';
import PricePlanCard from './PricePlanCard';
import { useTranslation } from 'react-i18next';
import { CheckCircleFilled } from '@ant-design/icons';

const CloudPricePlans = ({ seats }: { seats: number }) => {
  const monthlyPricePerUser = 5.99;
  const annualPricePerUser = 3.99;

  const [totalMonthlyPrice, setTotlaMonthlyPrice] = useState<number>(
    seats * monthlyPricePerUser
  );
  const [totalAnnualPrice, setTotlaAnnualPrice] = useState<number>(
    seats * annualPricePerUser * 12
  );

  //   change the prices with seats change
  useMemo(() => {
    setTotlaMonthlyPrice(monthlyPricePerUser * seats);
    setTotlaAnnualPrice(annualPricePerUser * seats * 12);
  }, [seats]);

  //   localization
  const { t } = useTranslation('pricingPage');

  //   pro features list
  const proFeatures = [
    'unlimitedTeamsText',
    'freeStorageText',
    'unlimitedActiveProjectsText',
    'unlimitedTeamMembersText',
    'everythingInFreePlanText',
    'resourceManagementText',
    'advancedProjectReportingText',
    'trackTeamProgressText',
    'reportsExportingText',
  ];

  return (
    <Flex gap={24} className="w-full flex-col sm:mt-6 sm:flex-row">
      {/* pro monthly plan */}
      <PricePlanCard>
        <Flex vertical>
          <Typography.Text style={{ fontSize: 16, color: '#1677ff' }}>
            {t('proMonthlyText')}
          </Typography.Text>

          <Typography.Text>
            $
            <span style={{ fontSize: 36, fontWeight: 700 }}>
              {monthlyPricePerUser}
            </span>{' '}
            / {t('monthText')} / {t('userText')}
          </Typography.Text>

          <Typography.Text style={{ fontSize: 16 }}>
            {t('totalText')} ${totalMonthlyPrice.toFixed(2)}
          </Typography.Text>

          <Button
            shape="round"
            style={{
              fontSize: 16,
              paddingBlock: 16,
              marginBlockStart: 16,
              border: `1px solid #1677ff`,
              color: '#1677ff',
            }}
          >
            {t('getStartedButton')}
          </Button>

          {/* features  */}
          <Flex vertical gap={16} style={{ marginBlockStart: 24 }}>
            {proFeatures.map((feat, index) => (
              <Flex key={index} gap={8}>
                <CheckCircleFilled style={{ fontSize: 28 }} />
                <Typography.Text>{t(feat)}</Typography.Text>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </PricePlanCard>

      {/* pro annual plan */}
      <PricePlanCard isPopular={true}>
        <Flex vertical>
          <Typography.Text style={{ fontSize: 16, color: '#ef4444' }}>
            {t('proAnnuallyText')}
          </Typography.Text>

          <Typography.Text>
            $
            <span style={{ fontSize: 36, fontWeight: 700 }}>
              {annualPricePerUser}
            </span>{' '}
            / {t('yearText')} / {t('userText')}
          </Typography.Text>

          <Typography.Text style={{ fontSize: 16 }}>
            {t('totalText')} ${totalAnnualPrice.toFixed(2)}
          </Typography.Text>

          <Button
            type="primary"
            shape="round"
            style={{ fontSize: 16, paddingBlock: 16, marginBlockStart: 16 }}
          >
            {t('getStartedButton')}
          </Button>

          {/* features  */}
          <Flex vertical gap={16} style={{ marginBlockStart: 24 }}>
            {proFeatures.map((feat, index) => (
              <Flex key={index} gap={8}>
                <CheckCircleFilled style={{ fontSize: 28 }} />
                <Typography.Text>{t(feat)}</Typography.Text>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </PricePlanCard>
    </Flex>
  );
};

export default CloudPricePlans;
