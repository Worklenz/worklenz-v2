import React, { startTransition, useEffect, useState } from 'react';
import { Button, Drawer, Form, Input, Typography } from 'antd';
import './CreateFirstProjectForm.css';
import TemplateDrawer from '../templateDrawer/TemplateDrawer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { setButtonDisabled } from '../../../features/action-setup/buttonSlice';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

interface CreateFirstProjectProps {
  onContinue: () => void;
  onGoBack: () => void;
}

const CreateFirstProjectForm: React.FC<CreateFirstProjectProps> = ({
  onContinue,
  onGoBack,
}) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');
  const isButtonDisabled = useSelector(
    (state: RootState) => state.button.isButtonDisable
  );
  const [open, setOpen] = useState(false);
  const themeMode = useSelector((state: RootState) => state.themeReducer.mode);

  const { t } = useTranslation('createFirstProjectFormPage');

  const openTemplateSelector = () => {
    startTransition(() => {
      setOpen(true);
    });
  };

  const closeTemplateSelector = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(setButtonDisabled(true));
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim() === '') {
      dispatch(setButtonDisabled(true));
    } else {
      dispatch(setButtonDisabled(false));
    }
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

  return (
    <Form
      className="first-project-form"
      style={{
        width: '600px',
        paddingBottom: '1rem',
        marginTop: '3rem',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      <Form.Item>
        <Title level={2} style={{ marginBottom: '1rem' }}>
          {t('formTitle')}
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
            {t('inputLabel')}
          </span>
        }
      >
        <Input
          placeholder="e.g. Worklenz marketing plan"
          value={inputValue}
          onChange={handleInputChange}
        />
      </Form.Item>

      <div style={{ position: 'relative' }}>
        <Title
          level={4}
          className={themeMode === 'dark' ? 'vert-text-dark' : 'vert-text'}
        >
          {t('or')}
        </Title>
        <div
          className={themeMode === 'dark' ? 'vert-line-dark' : 'vert-line'}
        ></div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '1rem',
        }}
      >
        <Button
          onClick={openTemplateSelector}
          type="primary"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {t('templateButton')}
        </Button>
        <Drawer
          title={t('templateDrawerTitle')}
          width={1000}
          onClose={closeTemplateSelector}
          open={open}
          footer={
            <div
              style={{
                display: 'flex',
                justifyContent: 'right',
                padding: '10px 16px 10px 16px',
              }}
            >
              <Button
                style={{ marginRight: '8px' }}
                onClick={closeTemplateSelector}
              >
                {t('cancel')}
              </Button>
              <Button type="primary">{t('create')}</Button>
            </div>
          }
        >
          <TemplateDrawer />
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
