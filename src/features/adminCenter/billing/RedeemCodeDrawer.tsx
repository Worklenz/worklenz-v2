import { Button, Drawer, Form, Input, notification, Typography } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { RootState } from '../../../app/store';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { toggleDrawer } from './billingSlice';

const RedeemCodeDrawer: React.FC = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation('current-bill');
  const [redeemCode, setRedeemCode] = useState<number | null>(null);
  const isDrawerOpen = useAppSelector(
    (state: RootState) => state.billingReducer.isDrawerOpen
  );
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRedeemCode(Number(e.target.value));
  };

  const handleFormSubmit = (values: any) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2500);
  };

  const [api, contextHolder] = notification.useNotification();
  const openNotification = () => {
    setTimeout(() => {
      api.open({
        message: (
          <span style={{ fontSize: '14px' }}>
            Redeem Code verification failed! Try again.
          </span>
        ),
      });
    }, 2500);
  };

  return (
    <div>
      {contextHolder}
      <Drawer
        title={
          <Typography.Text style={{ fontWeight: 500, fontSize: 16 }}>
            {t('drawerTitle')}
          </Typography.Text>
        }
        open={isDrawerOpen}
        onClose={() => {
          dispatch(toggleDrawer());
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="redeemCode"
            label={t('label')}
            rules={[
              {
                required: true,
                message: t('message'),
              },
            ]}
          >
            <Input
              placeholder={t('drawerPlaceholder')}
              onChange={handleChange}
            />
          </Form.Item>

          <Form.Item>
            {redeemCode && redeemCode.toString().length === 10 ? (
              isLoading ? (
                <Button type="primary" style={{ width: '100%' }} loading>
                  {t('verifying')}
                </Button>
              ) : (
                <Button
                  type="primary"
                  style={{ width: '100%' }}
                  htmlType="submit"
                  onClick={openNotification}
                >
                  {t('redeemSubmit')}
                </Button>
              )
            ) : (
              <Button
                type="primary"
                style={{ width: '100%' }}
                htmlType="submit"
                disabled
              >
                {t('redeemSubmit')}
              </Button>
            )}
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default RedeemCodeDrawer;
