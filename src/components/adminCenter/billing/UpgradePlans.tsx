import { Button, Card, Col, Form, Input, Row, Tag, Typography } from 'antd';
import React, { useState } from 'react';
import './UpgradePlans.css';
import { CheckCircleFilled } from '@ant-design/icons';
import { RootState } from '../../../app/store';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useTranslation } from 'react-i18next';
import { timeZoneCurrencyMap } from '../../../utils/timeZoneCurrencyMap';

const UpgradePlans: React.FC = () => {
  const themeMode = useAppSelector(
    (state: RootState) => state.themeReducer.mode
  );
  const [selectedCard, setSelectedCard] = useState(2);

  const handleCardSelect = (cardIndex: number) => {
    setSelectedCard(cardIndex);
  };

  const handleValuesChange = (values: any) => {
    if (values.seats <= 15) {
      setSelectedCard(2);
    } else if (values.seats > 15 && values.seats <= 200) {
      setSelectedCard(3);
    } else if (values.seats > 200) {
      setSelectedCard(4);
    }
  };

  const isSelected = (cardIndex: number) => {
    return selectedCard === cardIndex ? { border: '2px solid #1890ff' } : {};
  };

  const { t } = useTranslation('current-bill');

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const userCurrency = timeZoneCurrencyMap[userTimeZone] || 'USD';

  return (
    <div
      className="upgrade-plans"
      style={{ marginTop: '1.5rem', textAlign: 'center' }}
    >
      <Typography.Title level={2}>{t('modalTitle')}</Typography.Title>

      <Row justify="center">
        <Form initialValues={{ seats: 15 }} onValuesChange={handleValuesChange}>
          <Form.Item name="seats" label={t('seatLabel')}>
            <Input type="number" min={15} step={5} />
          </Form.Item>
        </Form>
      </Row>

      <Row>
        <Col span={6} style={{ padding: '0 4px' }}>
          <Card
            style={{ ...isSelected(1), height: '100%' }} // Apply the selected style
            hoverable
            title={
              <span
                style={{
                  color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
                  fontWeight: 500,
                  fontSize: '16px',
                  display: 'flex',
                  gap: '4px',
                  justifyContent: 'center',
                }}
              >
                {t('freePlan')}
              </span>
            }
            onClick={() => handleCardSelect(1)}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto',
                rowGap: '10px',
                padding: '20px 20px 0',
              }}
            >
              <Typography.Title level={1}>{userCurrency} 0.00</Typography.Title>
              <span>{t('freeSubtitle')}</span>
              <Typography.Title level={5}>{t('freeUsers')}</Typography.Title>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateRows: 'auto auto auto',
                rowGap: '7px',
                padding: '10px',
                justifyItems: 'flex-start',
              }}
            >
              <div>
                <CheckCircleFilled style={{ color: '#52c41a' }} />
                &nbsp;<span>{t('freeText01')}</span>
              </div>
              <div>
                <CheckCircleFilled style={{ color: '#52c41a' }} />
                &nbsp;<span>{t('freeText02')}</span>
              </div>
              <div>
                <CheckCircleFilled style={{ color: '#52c41a' }} />
                &nbsp;<span>{t('freeText03')}</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col span={6} style={{ padding: '0 4px' }}>
          <Card
            style={{ ...isSelected(2), height: '100%' }} // Apply the selected style for default card
            hoverable
            title={
              <span
                style={{
                  color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
                  fontWeight: 500,
                  fontSize: '16px',
                  display: 'flex',
                  gap: '4px',
                  justifyContent: 'center',
                }}
              >
                {t('startup')}
              </span>
            }
            onClick={() => handleCardSelect(2)}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto',
                rowGap: '10px',
                padding: '20px 20px 0',
              }}
            >
              <Typography.Title level={1}>{userCurrency} 4990</Typography.Title>
              <span>{t('startupSubtitle')}</span>
              <Typography.Title level={5}>{t('startupUsers')}</Typography.Title>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateRows: 'auto auto auto',
                gridTemplateColumns: '200px',
                rowGap: '7px',
                padding: '10px',
                justifyItems: 'start',
                alignItems: 'start',
              }}
            >
              <div>
                <CheckCircleFilled style={{ color: '#52c41a' }} />
                &nbsp;
                <span>{t('startupText01')}</span>
              </div>
              <div>
                <CheckCircleFilled style={{ color: '#52c41a' }} />
                &nbsp;
                <span>{t('startupText02')}</span>
              </div>
              <div>
                <CheckCircleFilled style={{ color: '#52c41a' }} />
                &nbsp;
                <span>{t('startupText03')}</span>
              </div>
              <div>
                <CheckCircleFilled style={{ color: '#52c41a' }} />
                &nbsp;
                <span>{t('startupText04')}</span>
              </div>
              <div>
                <CheckCircleFilled style={{ color: '#52c41a' }} />
                &nbsp;
                <span>{t('startupText05')}</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col span={6} style={{ padding: '0 4px' }}>
          <Card
            style={{ ...isSelected(3), height: '100%' }} // Apply the selected style
            hoverable
            title={
              <span
                style={{
                  color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
                  fontWeight: 500,
                  fontSize: '16px',
                  display: 'flex',
                  gap: '4px',
                  justifyContent: 'center',
                }}
              >
                {t('business')} <Tag color="volcano">{t('tag')}</Tag>
              </span>
            }
            onClick={() => handleCardSelect(3)}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto',
                rowGap: '10px',
                padding: '20px 20px 0',
              }}
            >
              <Typography.Title level={1}>{userCurrency} 300</Typography.Title>
              <span>{t('businessSubtitle')}</span>
              <Typography.Title level={5}>16 - 200 users</Typography.Title>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateRows: 'auto auto auto',
                gridTemplateColumns: '200px',
                rowGap: '7px',
                padding: '10px',
                justifyItems: 'start',
                alignItems: 'start',
              }}
            >
              <div>
                <CheckCircleFilled style={{ color: '#52c41a' }} />
                &nbsp;
                <span>{t('startupText01')}</span>
              </div>
              <div>
                <CheckCircleFilled style={{ color: '#52c41a' }} />
                &nbsp;
                <span>{t('startupText02')}</span>
              </div>
              <div>
                <CheckCircleFilled style={{ color: '#52c41a' }} />
                &nbsp;
                <span>{t('startupText03')}</span>
              </div>
              <div>
                <CheckCircleFilled style={{ color: '#52c41a' }} />
                &nbsp;
                <span>{t('startupText04')}</span>
              </div>
              <div>
                <CheckCircleFilled style={{ color: '#52c41a' }} />
                &nbsp;
                <span>{t('startupText05')}</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col span={6} style={{ padding: '0 4px' }}>
          <Card
            style={{ ...isSelected(4), height: '100%' }} // Apply the selected style
            hoverable
            title={
              <span
                style={{
                  color: `${themeMode === 'dark' ? '#ffffffd9' : '#000000d9'}`,
                  fontWeight: 500,
                  fontSize: '16px',
                  display: 'flex',
                  gap: '4px',
                  justifyContent: 'center',
                }}
              >
                {t('enterprise')}
              </span>
            }
            onClick={() => handleCardSelect(4)}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto',
                rowGap: '10px',
                padding: '20px 20px 0',
              }}
            >
              <Typography.Title level={1}>{userCurrency} 250</Typography.Title>
              <span>{t('businessSubtitle')}</span>
              <Typography.Title level={5}>
                {t('enterpriseUsers')}
              </Typography.Title>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateRows: 'auto auto auto',
                gridTemplateColumns: '200px',
                rowGap: '7px',
                padding: '10px',
                justifyItems: 'start',
                alignItems: 'start',
              }}
            >
              <div>
                <CheckCircleFilled style={{ color: '#52c41a' }} />
                &nbsp;
                <span>{t('startupText01')}</span>
              </div>
              <div>
                <CheckCircleFilled style={{ color: '#52c41a' }} />
                &nbsp;
                <span>{t('startupText02')}</span>
              </div>
              <div>
                <CheckCircleFilled style={{ color: '#52c41a' }} />
                &nbsp;
                <span>{t('startupText03')}</span>
              </div>
              <div>
                <CheckCircleFilled style={{ color: '#52c41a' }} />
                &nbsp;
                <span>{t('startupText04')}</span>
              </div>
              <div>
                <CheckCircleFilled style={{ color: '#52c41a' }} />
                &nbsp;
                <span>{t('startupText05')}</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <div
        style={{
          backgroundColor: `${themeMode === 'dark' ? '#141414' : '#e2e3e5'}`,
          padding: '1rem',
          marginTop: '1.5rem',
        }}
      >
        <Typography.Title level={4}>{t('footerTitle')}</Typography.Title>

        <Form>
          <Row justify="center" style={{ height: '32px' }}>
            <Form.Item
              style={{ margin: '0 24px 0 0' }}
              name="contactNumber"
              label={t('footerLabel')}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input placeholder="07xxxxxxxx" />
            </Form.Item>
            <Form.Item>
              <Button type="primary">{t('footerButton')}</Button>
            </Form.Item>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default UpgradePlans;
