import { Button, Flex, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { ArrowLeftOutlined, LeftOutlined } from '@ant-design/icons';
import coverImg from '../../../../assets/images/client-view-service-sample-cover.png';

const ClientViewServiceDetails = () => {
  // localization
  const { t } = useTranslation('client-view-services');

  const navigate = useNavigate();

  const { services } = useAppSelector(
    (state) => state.clientsPortalReducer.servicesReducer
  );

  // get service id from url
  const serviceId = window.location.pathname.split('/').pop();

  // get service details
  const service = services.find((service) => service.id === serviceId);

  return (
    <Flex gap={24} style={{ width: '100%' }}>
      <Button
        icon={<ArrowLeftOutlined style={{ fontSize: 22 }} />}
        className="borderless-icon-btn"
        style={{ boxShadow: 'none' }}
        onClick={() => navigate('/client-view/services')}
      />

      <Flex vertical gap={24} style={{ maxWidth: 680, width: '100%' }}>
        <Flex align="center" justify="space-between" style={{ width: '100%' }}>
          <Flex gap={12} align="center">
            <Typography.Title level={4} style={{ marginBlock: 0 }}>
              {service?.name}
            </Typography.Title>
          </Flex>

          <Button type="primary">{t('requestButton')}</Button>
        </Flex>

        <Flex vertical gap={24} style={{ width: '100%' }}>
          <img
            src={coverImg}
            alt={service?.name}
            style={{ width: '100%', objectFit: 'cover' }}
          />

          <div>{service?.service_data?.description}</div>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ClientViewServiceDetails;
