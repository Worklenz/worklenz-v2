import React, { useState } from 'react';
import { adminCenterApiService } from '@/api/admin-center/admin-center.api.service';
import {
  evt_billing_pause_plan,
  evt_billing_resume_plan,
} from '@/shared/worklenz-analytics-events';
import { useMixpanelTracking } from '@/hooks/useMixpanelTracking';
import logger from '@/utils/errorLogger';
import { Button, Card, Flex, Modal, Space, Tooltip, Typography } from 'antd/es';
import RedeemCodeDrawer from '../drawers/redeem-code-drawer/redeem-code-drawer';
import {
  fetchBillingInfo,
  toggleRedeemCodeDrawer,
  toggleUpgradeModal,
} from '@/features/admin-center/admin-center.slice';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useTranslation } from 'react-i18next';
import { WarningTwoTone } from '@ant-design/icons';
import { calculateTimeGap } from '@/utils/calculate-time-gap';
import { formatDate } from '@/utils/timeUtils';
import UpgradePlansLKR from '../drawers/upgrade-plans-lkr/upgrade-plans-lkr';
import UpgradePlans from '../drawers/upgrade-plans/upgrade-plans';
import { ISUBSCRIPTION_TYPE, SUBSCRIPTION_STATUS } from '@/shared/constants';

const CurrentPlanDetails = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('admin-center/current-bill');
  const { trackMixpanelEvent } = useMixpanelTracking();

  const [pausingPlan, setPausingPlan] = useState(false);
  const [cancellingPlan, setCancellingPlan] = useState(false);

  const themeMode = useAppSelector(state => state.themeReducer.mode);
  const { loadingBillingInfo, billingInfo, freePlanSettings, isUpgradeModalOpen } = useAppSelector(
    state => state.adminCenterReducer
  );

  const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const handleSubscriptionAction = async (action: 'pause' | 'resume') => {
    const isResume = action === 'resume';
    const setLoadingState = isResume ? setCancellingPlan : setPausingPlan;
    const apiMethod = isResume
      ? adminCenterApiService.resumeSubscription
      : adminCenterApiService.pauseSubscription;
    const eventType = isResume ? evt_billing_resume_plan : evt_billing_pause_plan;

    try {
      setLoadingState(true);
      const res = await apiMethod();
      if (res.done) {
        setTimeout(() => {
          setLoadingState(false);
          dispatch(fetchBillingInfo());
          trackMixpanelEvent(eventType);
        }, 8000);
      }
    } catch (error) {
      logger.error(`Error ${action}ing subscription`, error);
    } finally {
      setLoadingState(false);
    }
  };

  const checkSubscriptionStatus = (allowedStatuses: any[]) => {
    if (!billingInfo?.status || billingInfo.is_ltd_user) return false;
    return allowedStatuses.includes(billingInfo.status);
  };

  const shouldShowRedeemButton = () => {
    if (billingInfo?.trial_in_progress) return true;
    return billingInfo?.ltd_users ? billingInfo.ltd_users < 50 : false;
  };

  const showChangeButton = () => {
    return checkSubscriptionStatus([SUBSCRIPTION_STATUS.ACTIVE, SUBSCRIPTION_STATUS.PASTDUE]);
  };

  const showPausePlanButton = () => {
    return checkSubscriptionStatus([SUBSCRIPTION_STATUS.ACTIVE, SUBSCRIPTION_STATUS.PASTDUE]);
  };

  const showResumePlanButton = () => {
    return checkSubscriptionStatus([SUBSCRIPTION_STATUS.PAUSED]);
  };

  const renderExtra = () => {
    if (!billingInfo || billingInfo.is_custom) return null;

    return (
      <Space>
        {showPausePlanButton() && (
          <Button
            type="link"
            danger
            loading={pausingPlan}
            onClick={() => handleSubscriptionAction('pause')}
          >
            {t('pausePlan')}
          </Button>
        )}

        {showResumePlanButton() && (
          <Button
            type="primary"
            loading={cancellingPlan}
            onClick={() => handleSubscriptionAction('resume')}
          >
            {t('resumePlan')}
          </Button>
        )}

        {billingInfo.trial_in_progress && (
          <Button type="primary" onClick={() => dispatch(toggleUpgradeModal())}>
            {t('upgradePlan')}
          </Button>
        )}

        {showChangeButton() && (
          <Button
            type="primary"
            loading={pausingPlan || cancellingPlan}
            onClick={() => dispatch(toggleUpgradeModal())}
          >
            {t('changePlan')}
          </Button>
        )}
      </Space>
    );
  };

  const renderLtdDetails = () => {
    if (!billingInfo || billingInfo.is_custom) return null;
    return (
      <Flex vertical>
        <Typography.Text strong>{billingInfo.plan_name}</Typography.Text>
        <Typography.Text>{t('ltdUsers', { ltd_users: billingInfo.ltd_users })}</Typography.Text>
      </Flex>
    );
  };

  const renderTrialDetails = () => {
    const checkIfTrialExpired = () => {
      if (!billingInfo?.trial_expire_date) return false;
      const today = new Date();
      const trialExpireDate = new Date(billingInfo.trial_expire_date);
      return today > trialExpireDate;
    };

    const isExpired = checkIfTrialExpired();
    const trialExpireDate = billingInfo?.trial_expire_date || '';

    return (
      <Flex vertical>
        <Typography.Text strong>
          {t('trialPlan')}
          {isExpired && <WarningTwoTone twoToneColor="#faad14" style={{ marginLeft: 8 }} />}
        </Typography.Text>
        <Tooltip title={formatDate(new Date(trialExpireDate))}>
          <Typography.Text>
            {t(isExpired ? 'trialExpired' : 'trialInProgress', {
              trial_expire_string: calculateTimeGap(trialExpireDate),
            })}
          </Typography.Text>
        </Tooltip>
      </Flex>
    );
  };

  const renderFreePlan = () => (
    <Flex vertical>
      <Typography.Text strong>Free Plan</Typography.Text>
      <Typography.Text>
        <br />-{' '}
        {freePlanSettings?.team_member_limit === 0
          ? t('unlimitedTeamMembers')
          : `${freePlanSettings?.team_member_limit} ${t('teamMembers')}`}
        <br />- {freePlanSettings?.projects_limit} {t('projects')}
        <br />- {freePlanSettings?.free_tier_storage} MB {t('storage')}
      </Typography.Text>
    </Flex>
  );

  const renderPaddleSubscriptionInfo = () => {
    return (
      <Flex vertical>
        <Typography.Text strong>{billingInfo?.plan_name}</Typography.Text>
        <Flex>
          <Typography.Text>{billingInfo?.default_currency}</Typography.Text>&nbsp;
          <Typography.Text>
            {billingInfo?.billing_type === 'year'
              ? billingInfo.unit_price_per_month
              : billingInfo?.unit_price}

            &nbsp;{t('perMonthPerUser')}
          </Typography.Text>
        </Flex>
      </Flex>
    );
  };

  return (
    <Card
      style={{ height: '100%' }}
      title={
        <Typography.Text
          style={{

            color: themeMode === 'dark' ? '#ffffffd9' : '#000000d9',
            fontWeight: 500,
            fontSize: '16px',
          }}
        >
          {t('currentPlanDetails')}
        </Typography.Text>
      }
      loading={loadingBillingInfo}
      extra={renderExtra()}
    >
      <Flex vertical>
        <div style={{ marginBottom: '14px' }}>
          {billingInfo?.subscription_type === ISUBSCRIPTION_TYPE.LIFE_TIME_DEAL && renderLtdDetails()}
          {billingInfo?.subscription_type === ISUBSCRIPTION_TYPE.TRIAL && renderTrialDetails()}
          {billingInfo?.subscription_type === ISUBSCRIPTION_TYPE.FREE && renderFreePlan()}
          {billingInfo?.subscription_type === ISUBSCRIPTION_TYPE.PADDLE && renderPaddleSubscriptionInfo()}
        </div>

        {shouldShowRedeemButton() && (
          <>
            <Button
              type="link"
              style={{ margin: 0, padding: 0, width: '90px' }}
              onClick={() => dispatch(toggleRedeemCodeDrawer())}
            >
              {t('redeemCode')}
            </Button>
            <RedeemCodeDrawer />
          </>
        )}
        <Modal
          open={isUpgradeModalOpen}
          onCancel={() => dispatch(toggleUpgradeModal())}
          width={1000}
          centered
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ hidden: true }}
        >
          {browserTimeZone === 'Asia/Colombo' ? <UpgradePlansLKR /> : <UpgradePlans />}
        </Modal>
      </Flex>
    </Card>
  );
};

export default CurrentPlanDetails;
