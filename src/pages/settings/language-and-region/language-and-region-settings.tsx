import { Button, Card, Form, Select } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useDocumentTitle } from '@/hooks/useDoumentTItle';
import { useMixpanelTracking } from '@/hooks/useMixpanelTracking';
import { ILanguageType, Language, setLanguage } from '@/features/i18n/localesSlice';
import { evt_settings_language_and_region_visit, evt_settings_language_changed } from '@/shared/worklenz-analytics-events';

const LanguageAndRegionSettings = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('settings-language');
  const { trackMixpanelEvent } = useMixpanelTracking();
  const { lng } = useAppSelector(state => state.localesReducer);

  useDocumentTitle('Language & Region');

  useEffect(() => {
    trackMixpanelEvent(evt_settings_language_and_region_visit);
  }, [trackMixpanelEvent]);

  const languageOptions: { value: ILanguageType; label: string }[] = [
    {
      value: Language.EN,
      label: 'English',
    },
    {
      value: Language.ES,
      label: 'Español',
    },
    {
      value: Language.PT,
      label: 'Português',
    },
  ];

  const handleLanguageChange = (value: ILanguageType) => {
    dispatch(setLanguage(value));
  };

  const onFinish = (values: { language?: ILanguageType; timeZone?: string }) => {
    if (values.language) {
      handleLanguageChange(values.language);
      trackMixpanelEvent(evt_settings_language_changed, { language: values.language });
    }
  };

  return (
    <Card style={{ width: '100%' }}>
      <Form
        layout="vertical"
        style={{ width: '100%', maxWidth: 350 }}
        initialValues={{
          language: lng || Language.EN,
          timeZone: 'Asia/Colombo',
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="language"
          label={t('language')}
          rules={[
            {
              required: true,
              message: t('language_required'),
            },
          ]}
        >
          <Select options={languageOptions}/>
        </Form.Item>
        <Form.Item
          name="timeZone"
          label={t('time_zone')}
          rules={[
            {
              required: true,
              message: t('time_zone_required'),
            },
          ]}
        >
          <Select showSearch />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">{t('save_changes')}</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default LanguageAndRegionSettings;
