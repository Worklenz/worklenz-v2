import { Button, Col, DatePicker, Flex, Input, Row } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

const ProjectTimelineModal = ({
  setIsModalOpen,
}: {
  setIsModalOpen: (x: boolean) => void;
}) => {
  const { t } = useTranslation('schedule');

  return (
    <Flex vertical gap={10} style={{ width: '480px' }}>
      <Row>
        <Col
          span={12}
          style={{
            display: 'flex',
            flexDirection: 'column',
            paddingRight: '20px',
          }}
        >
          <span>{t('startDate')}</span>
          <DatePicker />
        </Col>
        <Col
          span={12}
          style={{
            display: 'flex',
            flexDirection: 'column',
            paddingLeft: '20px',
          }}
        >
          <span>{t('endDate')}</span>
          <DatePicker />
        </Col>
      </Row>
      <Row>
        <Col span={12} style={{ paddingRight: '20px' }}>
          <span>{t('hoursPerDay')}</span>
          <Input max={24} defaultValue={8} type="number" suffix="hours" />
        </Col>

        <Col span={12} style={{ paddingLeft: '20px' }}>
          <span>{t('totalHours')}</span>
          <Input max={24} defaultValue={8} type="number" suffix="hours" />
        </Col>
      </Row>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Button type="link">{t('deleteButton')}</Button>
        <div style={{ display: 'flex', gap: '5px' }}>
          <Button onClick={() => setIsModalOpen(false)}>
            {t('cancelButton')}
          </Button>
          <Button type="primary" onClick={() => setIsModalOpen(false)}>
            {t('saveButton')}
          </Button>
        </div>
      </div>
    </Flex>
  );
};

export default React.memo(ProjectTimelineModal);
