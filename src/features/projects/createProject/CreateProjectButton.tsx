import { Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import CreateProjectModal from './project-modal/create-project-modal';
import { useState } from 'react';

const CreateProjectButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // localization
  const { t } = useTranslation('createFirstProjectFormPage');

  return (
    <>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        <EditOutlined /> {t('createProject')}
      </Button>

      <CreateProjectModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};

export default CreateProjectButton;
