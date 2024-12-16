import { Button, Drawer, Dropdown } from 'antd';
import { startTransition, useEffect, useState } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { toggleDrawer } from '../../../features/projects/projectsSlice';
import { DownOutlined, EditOutlined, ImportOutlined } from '@ant-design/icons';
import TemplateDrawer from '@components/account-setup/template-drawer/template-drawer';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const CreateProjectButton = () => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string>('');
  const location = useLocation();

  const { t } = useTranslation('create-first-project-form');

  const openTemplateSelector = () => {
    startTransition(() => {
      setOpen(true);
    });
  };

  const closeTemplateSelector = () => {
    setOpen(false);
  };

  useEffect(() => {
    const pathKey = location.pathname.split('/').pop();
    setCurrent(pathKey ?? 'home');
  }, [location]);

  const items = [
    {
      key: '1',
      label: (
        <div
          style={{ width: '100%', margin: 0, padding: 0 }}
          onClick={openTemplateSelector}
        >
          <ImportOutlined style={{ marginRight: '8px' }} />{' '}
          {current === 'home'
            ? ' Import from template '
            : ' Create from template'}
        </div>
      ),
    },
  ];

  return (
    <div>
      <Dropdown.Button
        type="primary"
        icon={<DownOutlined />}
        onClick={() => dispatch(toggleDrawer())}
        menu={{ items }}
      >
        <EditOutlined /> Create Project
      </Dropdown.Button>

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
              padding: '10px 16px',
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
  );
};

export default CreateProjectButton;
