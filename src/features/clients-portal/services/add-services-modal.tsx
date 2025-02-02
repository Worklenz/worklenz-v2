import { Card, Flex, Modal, Steps, Typography } from 'antd';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { toggleAddServicesModal } from './services-slice';
import { useState } from 'react';
import './services-modal.css';
import ServiceDetailsStep from './modal-stepper/service-details-step';
import RequestFormStep from './modal-stepper/request-form-step';
import PreviewAndSubmitStep from './modal-stepper/preview-and-submit-step';
import { TempServicesType } from '../../../types/client-portal/temp-client-portal.types';
import { nanoid } from '@reduxjs/toolkit';

const AddServicesModal = () => {
  const [current, setCurrent] = useState(0);
  const [service, setService] = useState<TempServicesType>({
    id: nanoid(),
    name: '',
    status: 'pending',
    service_data: {
      description: '',
      images: [],
      request_form: [],
    },
    no_of_requests: 0,
    created_by: 'sachintha prasad',
  });

  console.log('service', service);

  // localization
  const { t } = useTranslation('client-portal-services');

  const { isAddServicesModalOpen } = useAppSelector(
    (state) => state.clientsPortalReducer.servicesReducer
  );

  const dispatch = useAppDispatch();

  // function to handle model close
  const handleClose = () => {
    dispatch(toggleAddServicesModal());

    setService({
      id: nanoid(),
      name: '',
      status: 'pending',
      service_data: {
        description: '',
        images: [],
        request_form: [],
      },
      no_of_requests: 0,
    });
    setCurrent(0);
  };

  return (
    <Modal
      open={isAddServicesModalOpen}
      title={
        <Typography.Title level={5}>
          {t('addServiceDrawerTitle')}
        </Typography.Title>
      }
      width={1200}
      onCancel={handleClose}
      footer={null}
    >
      <Card>
        <Flex
          vertical
          gap={32}
          style={{ height: 'calc(100vh - 320px)', overflow: 'hidden' }}
        >
          <Steps
            type="navigation"
            current={current}
            className="clients-portal-services-steper"
            items={[
              {
                title: t('serviceDetailsStep'),
              },
              {
                title: t('requestFormStep'),
              },
              {
                title: t('previewAndSubmitStep'),
              },
            ]}
          />

          <div>
            {current === 0 && (
              <ServiceDetailsStep
                setCurrent={setCurrent}
                service={service}
                setService={setService}
              />
            )}
            {current === 1 && (
              <RequestFormStep
                setCurrent={setCurrent}
                service={service}
                setService={setService}
              />
            )}
            {current === 2 && (
              <PreviewAndSubmitStep setCurrent={setCurrent} service={service} />
            )}
          </div>
        </Flex>
      </Card>
    </Modal>
  );
};

export default AddServicesModal;
