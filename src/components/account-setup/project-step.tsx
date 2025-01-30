import React, { startTransition, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Drawer, Form, Input, InputRef, Select, Typography } from 'antd';
import TemplateDrawer from '../common/template-drawer/template-drawer';

import { RootState } from '@/app/store';
import { setProjectName, setTemplateId } from '@/features/account-setup/account-setup.slice';

import { projectTemplatesApiService } from '@/api/project-templates/project-templates.api.service';
import logger from '@/utils/errorLogger';

import { IAccountSetupRequest } from '@/types/project-templates/project-templates.types';

import { evt_account_setup_template_complete } from '@/shared/worklenz-analytics-events';
import { useMixpanelTracking } from '@/hooks/useMixpanelTracking';

const { Title } = Typography;

interface Props {
  onEnter: () => void;
  styles: any;
  isDarkMode: boolean;
}

export const ProjectStep: React.FC<Props> = ({ onEnter, styles, isDarkMode = false }) => {
  const { t } = useTranslation('account-setup');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { trackMixpanelEvent } = useMixpanelTracking();

  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 200);
  }, []);

  const { projectName, templateId, organizationName } = useSelector(
    (state: RootState) => state.accountSetupReducer
  );
  const [open, setOpen] = useState(false);
  const [creatingFromTemplate, setCreatingFromTemplate] = useState(false);

  const handleTemplateSelected = (templateId: string) => {
    if (!templateId) return;
    dispatch(setTemplateId(templateId));
  };

  const toggleTemplateSelector = (isOpen: boolean) => {
    startTransition(() => setOpen(isOpen));
  };

  const createFromTemplate = async () => {
    setCreatingFromTemplate(true);
    if (!templateId) return;
    try {
      const model: IAccountSetupRequest = {
        team_name: organizationName,
        project_name: null,
        template_id: templateId || null,
        tasks: [],
        team_members: [],
      };
      const res = await projectTemplatesApiService.setupAccount(model);
      if (res.done && res.body.id) {
        toggleTemplateSelector(false);
        trackMixpanelEvent(evt_account_setup_template_complete);
        navigate(`/worklenz/projects/${res.body.id}`);
      }
    } catch (error) {
      logger.error('createFromTemplate', error);
    }
  };

  const onPressEnter = () => {
    if (!projectName) return;
    onEnter();
  };

  return (
    <div>
      <Form className="step-form" style={styles.form}>
        <Form.Item>
          <Title level={2} style={{ marginBottom: '1rem' }}>
            {t('projectStepTitle')}
          </Title>
        </Form.Item>
        <Form.Item
          layout="vertical"
          rules={[{ required: true }]}
          label={<span style={styles.label}>{t('projectStepLabel')}</span>}
        >
          <Input
            placeholder={t('projectStepPlaceholder')}
            value={projectName}
            onChange={e => dispatch(setProjectName(e.target.value))}
            onPressEnter={onPressEnter}
            ref={inputRef}
          />
        </Form.Item>
      </Form>
      <div style={{ position: 'relative' }}>
        <Title level={4} className={isDarkMode ? 'vert-text-dark' : 'vert-text'}>
          {t('or')}
        </Title>
        <div className={isDarkMode ? 'vert-line-dark' : 'vert-line'} />
      </div>

      <div className="flex justify-center">
        <Button onClick={() => toggleTemplateSelector(true)} type="primary">
          {t('templateButton')}
        </Button>
      </div>
      <Drawer
        title={t('templateDrawerTitle')}
        width={1000}
        onClose={() => toggleTemplateSelector(false)}
        open={open}
        footer={
          <div style={styles.drawerFooter}>
            <Button style={{ marginRight: '8px' }} onClick={() => toggleTemplateSelector(false)}>
              {t('cancel')}
            </Button>
            <Button
              type="primary"
              onClick={() => createFromTemplate()}
              loading={creatingFromTemplate}
            >
              {t('create')}
            </Button>
          </div>
        }
      >
        <TemplateDrawer showBothTabs={false} templateSelected={handleTemplateSelected} />
      </Drawer>
    </div>
  );
};
