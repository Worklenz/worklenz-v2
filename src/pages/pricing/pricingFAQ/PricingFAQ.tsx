import { Collapse, ConfigProvider, Flex, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useResponsive } from '../../../hooks/useResponsive';
import { CollapseProps } from 'antd/lib';
import { DownOutlined } from '@ant-design/icons';
import { colors } from '../../../styles/colors';

const PricingFAQ = () => {
  // localization
  const { t } = useTranslation('pricingPageFAQs');

  // breakpoints from useResponsive custom hook
  const { isMobile } = useResponsive();

  // FAQs list
  const faqList = [
    { question: t('firstQuestion'), answer: t('firstAnswer') },
    { question: t('secondQuestion'), answer: t('secondAnswer') },
    { question: t('thirdQuestion'), answer: t('thirdAnswer') },
  ];

  const items: CollapseProps['items'] = faqList.map((faq, index) => ({
    key: index,
    label: (
      <Typography.Text className="text-[16px] font-medium">
        {faq.question}
      </Typography.Text>
    ),
    children: (
      <>
        <Typography.Text style={{ color: colors.lightGray }}>
          {faq.answer}
        </Typography.Text>
      </>
    ),
  }));

  return (
    <ConfigProvider
      theme={{
        components: {
          Collapse: {
            headerPadding: '8px 16px',
            contentPadding: '0 16px',
          },
        },
      }}
    >
      <Flex vertical gap={24} align="center" className="w-full">
        <Flex vertical align="center">
          <Typography.Title
            level={isMobile ? 4 : 1}
            style={{ marginBlockEnd: 8 }}
          >
            {t('faqTitle')}
          </Typography.Title>
          <Typography.Text type="secondary" className="text-[18px]">
            {t('faqSubTitle')}
          </Typography.Text>
        </Flex>
        <Collapse
          ghost
          items={items}
          className="w-full max-w-[580px]"
          expandIcon={({ isActive }) => (
            <DownOutlined rotate={isActive ? 180 : 0} />
          )}
          expandIconPosition="end"
        />
      </Flex>
    </ConfigProvider>
  );
};

export default PricingFAQ;
