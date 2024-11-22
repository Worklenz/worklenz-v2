import { Button, Flex, Typography } from 'antd';
import React from 'react';
import PricePlanCard from './PricePlanCard';
import { useTranslation } from 'react-i18next';
import { CheckCircleFilled } from '@ant-design/icons';

const SelfHostedPlans = () => {
  //   localization
  const { t } = useTranslation('pricingPage');

  //   enterprises features list
  const enterprisesFeatures = ['allProFeaturesText', 'hostingSupportText'];

  return (
    <div className="mx-auto w-full max-w-[400px] flex-col sm:mt-6 sm:flex-row">
      {/* enterprise monthly plan */}
      <PricePlanCard>
        <Flex vertical>
          <Typography.Text style={{ fontSize: 16, color: '#9339ea' }}>
            {t('enterpriseText')}
          </Typography.Text>

          <Typography.Text style={{ fontSize: 36, fontWeight: 700 }}>
            {t('customText')}
          </Typography.Text>

          <Typography.Text style={{ fontSize: 16 }}>
            {t('suitableForEnterpriseText')}
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
            {t('contactButton')}
          </Button>

          {/* features  */}
          <Flex vertical gap={16} style={{ marginBlockStart: 24 }}>
            {enterprisesFeatures.map((feat, index) => (
              <Flex key={index} gap={8}>
                <CheckCircleFilled style={{ fontSize: 28 }} />
                <Typography.Text>{t(feat)}</Typography.Text>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </PricePlanCard>
    </div>
  );
};

export default SelfHostedPlans;
