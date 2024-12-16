import React, { startTransition, useEffect, useState } from 'react';
import { Button, Form, Input, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '@/app/store';
import { setButtonDisabled } from '@features/actionSetup/buttonSlice';
import './organization-name-form.css';

const { Title } = Typography;

interface OrganizationNameProps {
  organizationName: string;
  onContinue: (inputValue: string) => void;
}

const OrganizationNameForm: React.FC<OrganizationNameProps> = ({ organizationName, onContinue }) => {
  console.log('organizationName', organizationName);
  const dispatch = useDispatch();
  const { t } = useTranslation('organization-name-form');
  const [inputValue, setInputValue] = useState(organizationName);

  const isButtonDisabled = useSelector((state: RootState) => state.button.isButtonDisable);
  const themeMode = useSelector((state: RootState) => state.themeReducer.mode);

  useEffect(() => {
    dispatch(setButtonDisabled(true));
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    dispatch(setButtonDisabled(value.trim() === ''));
  };

  const handleOnContinue = () => {
    startTransition(() => {
      onContinue(inputValue);
    });
  };

  return (
    <Form
      className="organization-name-form"
      style={{
        width: '600px',
        marginTop: '3rem',
        marginBottom: '3rem',
        paddingBottom: '1rem',
      }}
    >
      <Form.Item>
        <Title level={2} style={{ marginBottom: '1rem' }}>
          {t('nameYourOrganization')}
        </Title>
      </Form.Item>

      <Form.Item
        layout="vertical"
        rules={[{ required: true }]}
        label={
          <span
            style={{
              color: themeMode === 'dark' ? '' : '#00000073',
              fontWeight: 500,
            }}
          >
            {t('worklenzAccountTitle')}
          </span>
        }
      >
        <Input placeholder="e.g., test01's Team" value={inputValue} onChange={handleInputChange} />
      </Form.Item>

      <div style={{ display: 'flex', marginTop: '5rem' }} />

      <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="primary"
          htmlType="submit"
          disabled={isButtonDisabled}
          onClick={handleOnContinue}
        >
          {t('continue')}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default OrganizationNameForm;
