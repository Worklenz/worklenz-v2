import React, { startTransition, useEffect, useState } from 'react';
import { Button, Drawer, Form, Input, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import './create-first-project-form.css';
import TemplateDrawer from '@components/account-setup/template-drawer/template-drawer';
import { RootState } from '@/app/store';
import { setButtonDisabled } from '@features/actionSetup/buttonSlice';

const { Title } = Typography;

interface CreateFirstProjectProps {
  onContinue: () => void;
  onGoBack: () => void;
}

const CreateFirstProjectForm: React.FC<CreateFirstProjectProps> = ({ onContinue, onGoBack }) => {
  // State & Hooks
  const dispatch = useDispatch();
  const { t } = useTranslation('create-first-project-form');
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);

  // Selectors
  const isButtonDisabled = useSelector((state: RootState) => state.button.isButtonDisable);
  const themeMode = useSelector((state: RootState) => state.themeReducer.mode);

  // Effects
  useEffect(() => {
    dispatch(setButtonDisabled(true));
  }, [dispatch]);

  // Handlers
  const openTemplateSelector = () => {
    startTransition(() => {
      setOpen(true);
    });
  };

  const closeTemplateSelector = () => {
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    dispatch(setButtonDisabled(value.trim() === ''));
  };

  const handleGoBack = () => {
    startTransition(() => {
      onGoBack();
    });
  };

  const handleOnContinue = () => {
    startTransition(() => {
      onContinue();
    });
  };

  const handleTemplateSelected = () => {
    console.log('template imported');
  };

  // Styles
  const formStyles = {
    width: '600px',
    paddingBottom: '1rem',
    marginTop: '3rem',
    height: '100%',
    overflow: 'hidden'
  };

  const labelStyles = {
    color: themeMode === 'dark' ? '' : '#00000073',
    fontWeight: 500,
  };

  const buttonContainerStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '1rem',
  };

  const drawerFooterStyles = {
    display: 'flex',
    justifyContent: 'right',
    padding: '10px 16px 10px 16px',
  };

  return (
    <Form className="first-project-form" style={formStyles}>
      <Form.Item>
        <Title level={2} style={{ marginBottom: '1rem' }}>
          {t('formTitle')}
        </Title>
      </Form.Item>

      <Form.Item
        layout="vertical"
        rules={[{ required: true }]}
        label={<span style={labelStyles}>{t('inputLabel')}</span>}
      >
        <Input
          placeholder="e.g. Worklenz marketing plan"
          value={inputValue}
          onChange={handleInputChange}
        />
      </Form.Item>

      <div style={{ position: 'relative' }}>
        <Title level={4} className={themeMode === 'dark' ? 'vert-text-dark' : 'vert-text'}>
          {t('or')}
        </Title>
        <div className={themeMode === 'dark' ? 'vert-line-dark' : 'vert-line'}></div>
      </div>

      <div style={buttonContainerStyles}>
        <Button onClick={openTemplateSelector} type="primary" style={buttonContainerStyles}>
          {t('templateButton')}
        </Button>
        <Drawer
          title={t('templateDrawerTitle')}
          width={1000}
          onClose={closeTemplateSelector}
          open={open}
          footer={
            <div style={drawerFooterStyles}>
              <Button style={{ marginRight: '8px' }} onClick={closeTemplateSelector}>
                {t('cancel')}
              </Button>
              <Button type="primary">{t('create')}</Button>
            </div>
          }
        >
          <TemplateDrawer showBothTabs={false} templateSelected={handleTemplateSelected} />
        </Drawer>
      </div>

      <Form.Item style={{ marginTop: '5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button style={{ padding: 0 }} type="link" onClick={handleGoBack}>
            {t('goBack')}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            disabled={isButtonDisabled}
            onClick={handleOnContinue}
          >
            {t('continue')}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default CreateFirstProjectForm;
