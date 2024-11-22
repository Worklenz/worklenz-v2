import { Card, Tag } from 'antd';
import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../styles/colors';
import { themeWiseColor } from '../../../utils/themeWiseColor';
import { useAppSelector } from '../../../hooks/useAppSelector';

type PricePlanCardProps = {
  children: ReactNode;
  isPopular?: boolean;
};

const PricePlanCard = ({ children, isPopular = false }: PricePlanCardProps) => {
  // localization
  const { t } = useTranslation('pricingPage');

  //   get theme details from theme reducer
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  return (
    <Card
      style={{
        position: 'relative',
        borderColor: isPopular
          ? '#f97316'
          : themeWiseColor('inherit', colors.lightGray, themeMode),
        width: '100%',
      }}
    >
      {isPopular && (
        <Tag
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: 48,
            color: colors.white,
            paddingInline: 12,
            border: 'none',
          }}
          className="bg-gradient-to-r from-[#f97316] to-[#ef4444]"
        >
          {t('popularText')}
        </Tag>
      )}

      {children}
    </Card>
  );
};

export default PricePlanCard;
