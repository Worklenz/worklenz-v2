import { Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import CreateProjectModal from './project-modal/create-project-modal';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { toggleProjectModal } from '../projectSlice';

const CreateProjectButton = () => {
  // localization
  const { t } = useTranslation('createFirstProjectFormPage');

  const dispatch = useAppDispatch();

  return (
    <>
      <Button type="primary" onClick={() => dispatch(toggleProjectModal())}>
        <EditOutlined /> {t('createProject')}
      </Button>

      <CreateProjectModal />
    </>
  );
};

export default CreateProjectButton;
