import {
  Button,
  Card,
  Col,
  Modal,
  Progress,
  Row,
  Tooltip,
  Typography,
} from 'antd';
import React, { useState } from 'react';
import './current-bill.css';
import { InfoCircleTwoTone } from '@ant-design/icons';
import ChargesTable from './billing-tables/charges-table';
import InvoicesTable from './billing-tables/invoices-table';
import UpgradePlans from './upgrade-plans';
import { RootState } from '../../../app/store';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { toggleDrawer, toggleUpgradeModal } from '../../../features/adminCenter/billing/billingSlice';
import RedeemCodeDrawer from '../../../features/adminCenter/billing/RedeemCodeDrawer';

const CurrentBill: React.FC = () => {
  const themeMode = useAppSelector(
    (state: RootState) => state.themeReducer.mode
  );
  const dispatch = useAppDispatch();
  const totalData = 1;
  const usedData = 0;
  const remainingData = totalData - usedData;

  const percentage = (usedData / totalData) * 100;

  const isModalOpen = useAppSelector((state) => state.billingReducer.isModalOpen)

  const showModal = () => {
    dispatch(toggleUpgradeModal())
  };

  const handleCancel = () => {
    dispatch(toggleUpgradeModal())
  };

  const isTablet = useMediaQuery({ query: '(min-width: 1025px)' });

  const { t } = useTranslation('current-bill');

  return (
    <div style={{ width: '100%' }} className="current-billing">
      {isTablet ? (
        <Row>
          <Col span={16} style={{ paddingRight: '10px' }}>
            <Card
              title={
                <span
                  style={{
                    color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
                    fontWeight: 500,
                    fontSize: '16px',
                  }}
                >
                  {t('currentPlanDetails')}
                </span>
              }
              extra={
                <div
                  style={{
                    marginTop: '8px',
                    marginRight: '8px',
                  }}
                >
                  <Button type="primary" onClick={showModal}>
                    {t('upgradePlan')}
                  </Button>
                  <Modal
                    open={isModalOpen}
                    onCancel={handleCancel}
                    width={1000}
                    centered
                    okButtonProps={{ hidden: true }}
                    cancelButtonProps={{ hidden: true }}
                  >
                    <UpgradePlans />
                  </Modal>
                </div>
              }
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '50%',
                  padding: '0 12px',
                }}
              >
                <div style={{ marginBottom: '14px' }}>
                  <Typography.Text style={{ fontWeight: 700 }}>
                    {t('cardBodyText01')}
                  </Typography.Text>
                  <Tooltip title = 'Monday,November 18,2024'>
                    <Typography.Text>{t('cardBodyText02')}</Typography.Text>
                  </Tooltip>
                </div>
                <Button
                  type="link"
                  style={{
                    margin: 0,
                    padding: 0,
                    width: '90px',
                  }}
                  onClick={() => {
                    dispatch(toggleDrawer());
                  }}
                >
                  {t('redeemCode')}
                </Button>
                <RedeemCodeDrawer />
              </div>
            </Card>
          </Col>

          <Col span={8} style={{ paddingLeft: '10px' }}>
            <Card
              title={
                <span
                  style={{
                    color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
                    fontWeight: 500,
                    fontSize: '16px',
                  }}
                >
                  {t('accountStorage')}
                </span>
              }
            >
              <div style={{ display: 'flex' }}>
                <div style={{ padding: '0 8px' }}>
                  <Progress
                    percent={percentage}
                    type="circle"
                    format={(percent) => (
                      <span style={{ fontSize: '13px' }}>{percent}% Used</span>
                    )}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0 8px',
                  }}
                >
                  <Typography.Text>
                    {t('used')} <strong>{usedData} GB</strong>
                  </Typography.Text>
                  <Typography.Text>
                    {t('remaining')} <strong>{remainingData} GB</strong>
                  </Typography.Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      ) : (
        <div>
          <Col span={24}>
            <Card
              title={
                <span
                  style={{
                    color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
                    fontWeight: 500,
                    fontSize: '16px',
                  }}
                >
                  {t('currentPlanDetails')}
                </span>
              }
              extra={
                <div
                  style={{
                    marginTop: '8px',
                    marginRight: '8px',
                  }}
                >
                  <Button type="primary" onClick={showModal}>
                    {t('upgradePlan')}
                  </Button>
                  <Modal
                    open={isModalOpen}
                    onCancel={handleCancel}
                    width={1000}
                    centered
                    okButtonProps={{ hidden: true }}
                    cancelButtonProps={{ hidden: true }}
                  >
                    <UpgradePlans />
                  </Modal>
                </div>
              }
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '50%',
                  padding: '0 12px',
                }}
              >
                <div style={{ marginBottom: '14px' }}>
                  <Typography.Text style={{ fontWeight: 700 }}>
                    {t('cardBodyText01')}
                  </Typography.Text>
                  <Typography.Text>{t('cardBodyText02')}</Typography.Text>
                </div>
                <Button
                  type="link"
                  style={{
                    margin: 0,
                    padding: 0,
                    width: '90px',
                  }}
                  onClick={() => {
                    dispatch(toggleDrawer());
                  }}
                >
                  {t('redeemCode')}
                </Button>
                <RedeemCodeDrawer />
              </div>
            </Card>
          </Col>

          <Col span={24} style={{ marginTop: '1.5rem' }}>
            <Card
              title={
                <span
                  style={{
                    color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
                    fontWeight: 500,
                    fontSize: '16px',
                  }}
                >
                  {t('accountStorage')}
                </span>
              }
            >
              <div style={{ display: 'flex' }}>
                <div style={{ padding: '0 8px' }}>
                  <Progress
                    percent={percentage}
                    type="circle"
                    format={(percent) => (
                      <span style={{ fontSize: '13px' }}>{percent}% Used</span>
                    )}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0 8px',
                  }}
                >
                  <Typography.Text>
                    {t('used')} <strong>{usedData} GB</strong>
                  </Typography.Text>
                  <Typography.Text>
                    {t('remaining')} <strong>{remainingData} GB</strong>
                  </Typography.Text>
                </div>
              </div>
            </Card>
          </Col>
        </div>
      )}

      <div style={{ marginTop: '1.5rem' }}>
        <Card
          title={
            <span
              style={{
                color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
                fontWeight: 500,
                fontSize: '16px',
                display: 'flex',
                gap: '4px',
              }}
            >
              <span>{t('chargers')}</span>
              <Tooltip title={t('tooltip')}>
                <InfoCircleTwoTone />
              </Tooltip>
            </span>
          }
          style={{ marginTop: '16px' }}
        >
          <ChargesTable />
        </Card>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <Card
          title={
            <span
              style={{
                color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
                fontWeight: 500,
                fontSize: '16px',
                display: 'flex',
                gap: '4px',
              }}
            >
              {t('invoices')}
            </span>
          }
          style={{ marginTop: '16px' }}
        >
          <InvoicesTable />
        </Card>
      </div>
    </div>
  );
};

export default CurrentBill;
