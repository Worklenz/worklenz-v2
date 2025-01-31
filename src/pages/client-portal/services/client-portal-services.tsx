import { Button, Flex, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import ServicesTable from './services-table';
import AddServicesModal from '../../../features/clients-portal/services/add-services-modal';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { toggleAddServicesModal } from '../../../features/clients-portal/services/services-slice';

const ClientPortalServices = () => {
  // localization
  const { t } = useTranslation('client-portal-services');

  const dispatch = useAppDispatch();

  return (
    <Flex vertical gap={24} style={{ width: '100%' }}>
      <Flex align="center" justify="space-between" style={{ width: '100%' }}>
        <Typography.Title level={5}>{t('title')}</Typography.Title>

        <Button
          type="primary"
          onClick={() => dispatch(toggleAddServicesModal())}
        >
          {t('addServiceButton')}{' '}
        </Button>
      </Flex>

      <ServicesTable />

      {/* <services modal /> */}
      <AddServicesModal />
    </Flex>
  );
};

export default ClientPortalServices;
