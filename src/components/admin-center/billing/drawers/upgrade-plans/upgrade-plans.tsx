import { useEffect, useState } from 'react';
import { Button, Card, Col, Flex, Form, Row, Select, Tag, Tooltip, Typography } from 'antd/es';
import { useTranslation } from 'react-i18next';

import { adminCenterApiService } from '@/api/admin-center/admin-center.api.service';
import {
  IPricingPlans,
  IUpgradeSubscriptionPlanResponse,
} from '@/types/admin-center/admin-center.types';
import logger from '@/utils/errorLogger';
import { useAppSelector } from '@/hooks/useAppSelector';
import { IPaddlePlans, SUBSCRIPTION_STATUS } from '@/shared/constants';
import { CheckCircleFilled, InfoCircleOutlined } from '@ant-design/icons';
import { useAuthService } from '@/hooks/useAuth';
import { fetchBillingInfo, toggleUpgradeModal } from '@/features/admin-center/admin-center.slice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { billingApiService } from '@/api/admin-center/billing.api.service';

declare const Paddle: any;

const UpgradePlans = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('admin-center/current-bill');
  const [plans, setPlans] = useState<IPricingPlans>({});
  const [selectedPlan, setSelectedCard] = useState(IPaddlePlans.ANNUAL);
  const [selectedSeatCount, setSelectedSeatCount] = useState(5);
  const [seatCountOptions, setSeatCountOptions] = useState<number[]>([]);
  const [switchingToFreePlan, setSwitchingToFreePlan] = useState(false);

  const [switchingToPaddlePlan, setSwitchingToPaddlePlan] = useState(false);
  const [form] = Form.useForm();
  const currentSession = useAuthService().getCurrentSession();
  const paddlePlans = IPaddlePlans;

  const { billingInfo } = useAppSelector(state => state.adminCenterReducer);
  const themeMode = useAppSelector(state => state.themeReducer.mode);

  const populateSeatCountOptions = (currentSeats: number) => {
    if (!currentSeats) return [];

    const step = 5;
    const maxSeats = 90;
    const minValue = Math.min(currentSeats + 1);
    const rangeStart = Math.ceil(minValue / step) * step;
    const range = Array.from(
      { length: Math.floor((maxSeats - rangeStart) / step) + 1 },
      (_, i) => rangeStart + i * step
    );

    return currentSeats < step
      ? [...Array.from({ length: rangeStart - minValue }, (_, i) => minValue + i), ...range]
      : range;
  };

  const fetchPricingPlans = async () => {
    try {
      const res = await adminCenterApiService.getPlans();
      if (res.done) {
        setPlans(res.body);
      }
    } catch (error) {
      logger.error('Error fetching pricing plans', error);
    }
  };

  const switchToFreePlan = async () => {
    const teamId = currentSession?.team_id;
    if (!teamId) return;

    try {
      setSwitchingToFreePlan(true);
      const res = await adminCenterApiService.switchToFreePlan(teamId);
      if (res.done) {
        dispatch(fetchBillingInfo());
        dispatch(toggleUpgradeModal());
      }
    } catch (error) {
      logger.error('Error switching to free plan', error);
    } finally {
      setSwitchingToFreePlan(false);
    }
  };

  const handlePaddleCallback = (data: any) => {
    if (data.event === 'Checkout.Loaded') {
      setSwitchingToPaddlePlan(false);
    }

    if (data.event === 'Checkout.Complete') {
      dispatch(fetchBillingInfo());
      dispatch(toggleUpgradeModal());
    }
  };

  const initializePaddle = (data: IUpgradeSubscriptionPlanResponse) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/paddle.js';
    script.type = 'text/javascript';
    script.async = true;

    document.getElementsByTagName('head')[0].appendChild(script);

    script.onload = () => {
      if (data.sandbox) Paddle.Environment.set('sandbox');
      Paddle.Setup({
        vendor: parseInt(data.vendor_id),
        eventCallback: (data: any) => {
          void handlePaddleCallback(data);
        },
      });
      Paddle.Checkout.open(data.params);
    };
  };

  const upgradeToPaddlePlan = async (planId: string) => {
    try {
      setSwitchingToPaddlePlan(true);
      if (billingInfo?.trial_in_progress && billingInfo.status === SUBSCRIPTION_STATUS.TRIALING) {
        const res = await billingApiService.upgradeToPaidPlan(planId, selectedSeatCount);
        if (res.done) {
          setSwitchingToPaddlePlan(false);
          initializePaddle(res.body);
        }
      }
    } catch (error) {
      logger.error('Error upgrading to paddle plan', error);
    }
  };

  const continueWithPaddlePlan = async () => {
    if (selectedPlan && selectedSeatCount.toString() === '100+') return;

    try {
      setSwitchingToPaddlePlan(true);
      let planId: string | null = null;

      if (selectedPlan === paddlePlans.ANNUAL && plans.annual_plan_id) {
        planId = plans.annual_plan_id;
      } else if (selectedPlan === paddlePlans.MONTHLY && plans.monthly_plan_id) {
        planId = plans.monthly_plan_id;
      }

      if (planId) upgradeToPaddlePlan(planId);
    } catch (error) {
      logger.error('Error upgrading to paddle plan', error);
    } finally {
      setSwitchingToPaddlePlan(false);
    }
  };

  const isSelected = (cardIndex: IPaddlePlans) =>
    selectedPlan === cardIndex ? { border: '2px solid #1890ff' } : {};


  const cardStyles = {
    title: {
      color: themeMode === 'dark' ? '#ffffffd9' : '#000000d9',
      fontWeight: 500,
      fontSize: '16px',
      display: 'flex',
      gap: '4px',
      justifyContent: 'center',
    },
    priceContainer: {
      display: 'grid',
      gridTemplateColumns: 'auto',
      rowGap: '10px',
      padding: '20px 20px 0',
    },
    featureList: {
      display: 'grid',
      gridTemplateRows: 'auto auto auto',
      gridTemplateColumns: '200px',
      rowGap: '7px',
      padding: '10px',
      justifyItems: 'start',
      alignItems: 'start',
    },
    checkIcon: { color: '#52c41a' },
  };

  const calculateAnnualTotal = (price: string | undefined) => {
    if (!price) return;
    return (12 * parseFloat(price) * selectedSeatCount).toFixed(2);
  };

  const calculateMonthlyTotal = (price: string | undefined) => {
    if (!price) return;
    return (parseFloat(price) * selectedSeatCount).toFixed(2);
  };

  useEffect(() => {
    fetchPricingPlans();
    if (billingInfo?.total_used) {
      setSeatCountOptions(populateSeatCountOptions(billingInfo.total_used));
      form.setFieldsValue({ seatCount: selectedSeatCount });
    }
  }, [billingInfo]);

  const renderFeature = (text: string) => (
    <div>
      <CheckCircleFilled style={cardStyles.checkIcon} />
      &nbsp;<span>{text}</span>
    </div>
  );

  return (
    <div>
      <Flex justify="center" align="center">
        <Typography.Title level={2}>
          {billingInfo?.status === SUBSCRIPTION_STATUS.TRIALING
            ? t('selectPlan')
            : t('changeSubscriptionPlan')}
        </Typography.Title>
      </Flex>

      <Flex justify="center" align="center">
        <Form form={form}>
          <Form.Item name="seatCount" label={t('noOfSeats')}>
            <Select
              style={{ width: 100 }}
              value={selectedSeatCount}
              options={seatCountOptions.map(option => ({
                value: option,
                text: option.toString(),
              }))}
              onChange={setSelectedSeatCount}
            />
          </Form.Item>
        </Form>
      </Flex>

      <Flex>
        <Row className="w-full">
          {/* Free Plan */}
          <Col span={8} style={{ padding: '0 4px' }}>
            <Card
              style={{ ...isSelected(paddlePlans.FREE), height: '100%' }}
              hoverable
              title={<span style={cardStyles.title}>{t('freePlan')}</span>}
              onClick={() => setSelectedCard(paddlePlans.FREE)}
            >

              <div style={cardStyles.priceContainer}>
                <Flex justify="space-between" align="center">
                  <Typography.Title level={1}>$ 0.00</Typography.Title>
                  <Typography.Text>{t('freeForever')}</Typography.Text>
                </Flex>
                <Flex justify="center" align="center">
                  <Typography.Text strong style={{ fontSize: '16px' }}>
                    {t('bestForPersonalUse')}
                  </Typography.Text>
                </Flex>
              </div>

              <div style={cardStyles.featureList}>
                {renderFeature(`${plans.free_tier_storage} ${t('storage')}`)}
                {renderFeature(`${plans.projects_limit} ${t('projects')}`)}
                {renderFeature(`${plans.team_member_limit} ${t('teamMembers')}`)}
              </div>
            </Card>
          </Col>

          {/* Annual Plan */}
          <Col span={8} style={{ padding: '0 4px' }}>
            <Card
              style={{ ...isSelected(paddlePlans.ANNUAL), height: '100%' }}
              hoverable

              title={
                <span style={cardStyles.title}>
                  {t('annualPlan')}{' '}
                  <Tag color="volcano" style={{ lineHeight: '21px' }}>
                    {t('tag')}
                  </Tag>
                </span>
              }
              onClick={() => setSelectedCard(paddlePlans.ANNUAL)}
            >
              <div style={cardStyles.priceContainer}>

                <Flex justify="space-between" align="center">
                  <Typography.Title level={1}>$ {plans.annual_price}</Typography.Title>
                  <Typography.Text>seat / month</Typography.Text>
                </Flex>
                <Flex justify="center" align="center">
                  <Typography.Text strong style={{ fontSize: '16px' }}>
                    Total ${calculateAnnualTotal(plans.annual_price)}/ year
                    <Tooltip
                      title={
                        '$' + plans.annual_price + ' x 12 months x ' + selectedSeatCount + ' seats'
                      }
                    >
                      <InfoCircleOutlined
                        style={{ color: 'grey', fontSize: '16px', marginLeft: '4px' }}
                      />
                    </Tooltip>
                  </Typography.Text>
                </Flex>
                <Flex justify="center" align="center">
                  <Typography.Text>{t('billedAnnually')}</Typography.Text>
                </Flex>
              </div>

              <div style={cardStyles.featureList} className="mt-4">
                {renderFeature(t('startupText01'))}
                {renderFeature(t('startupText02'))}
                {renderFeature(t('startupText03'))}
                {renderFeature(t('startupText04'))}
                {renderFeature(t('startupText05'))}
              </div>
            </Card>
          </Col>

          {/* Monthly Plan */}
          <Col span={8} style={{ padding: '0 4px' }}>
            <Card
              style={{ ...isSelected(paddlePlans.MONTHLY), height: '100%' }}
              hoverable
              title={<span style={cardStyles.title}>{t('monthlyPlan')}</span>}
              onClick={() => setSelectedCard(paddlePlans.MONTHLY)}

            >
              <div style={cardStyles.priceContainer}>
                <Flex justify="space-between" align="center">
                  <Typography.Title level={1}>$ {plans.monthly_price}</Typography.Title>
                  <Typography.Text>seat / month</Typography.Text>
                </Flex>
                <Flex justify="center" align="center">
                  <Typography.Text strong style={{ fontSize: '16px' }}>
                    Total ${calculateMonthlyTotal(plans.monthly_price)}/ month
                    <Tooltip
                      title={'$' + plans.monthly_price + ' x ' + selectedSeatCount + ' seats'}
                    >
                      <InfoCircleOutlined
                        style={{ color: 'grey', fontSize: '16px', marginLeft: '4px' }}
                      />
                    </Tooltip>
                  </Typography.Text>
                </Flex>
                <Flex justify="center" align="center">
                  <Typography.Text>{t('billedMonthly')}</Typography.Text>
                </Flex>
              </div>

              <div style={cardStyles.featureList}>
                {renderFeature(t('startupText01'))}
                {renderFeature(t('startupText02'))}
                {renderFeature(t('startupText03'))}
                {renderFeature(t('startupText04'))}
                {renderFeature(t('startupText05'))}
              </div>
            </Card>
          </Col>
        </Row>
      </Flex>
      <Row justify="end" className="mt-4">
        {selectedPlan === paddlePlans.FREE && (
          <Button
            type="primary"
            htmlType="submit"
            loading={switchingToFreePlan}
            onClick={switchToFreePlan}

          >
            Try for free
          </Button>
        )}
        {selectedPlan === paddlePlans.ANNUAL && (
          <Button
            type="primary"
            htmlType="submit"
            loading={switchingToPaddlePlan}
            onClick={continueWithPaddlePlan}
            disabled={billingInfo?.plan_id === plans.annual_plan_id}
          >
            Continue with {t('annualPlan')}
          </Button>

        )}
        {selectedPlan === paddlePlans.MONTHLY && (
          <Button
            type="primary"
            htmlType="submit"
            loading={switchingToPaddlePlan}
            onClick={continueWithPaddlePlan}
            disabled={billingInfo?.plan_id === plans.monthly_plan_id}
          >
            Continue with {t('monthlyPlan')}
          </Button>
        )}
      </Row>
    </div>
  );
};

export default UpgradePlans;
