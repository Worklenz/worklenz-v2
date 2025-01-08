import { ColorPicker, Form, FormInstance, Input } from 'antd';
import { useTranslation } from 'react-i18next';

import { IProjectViewModel } from '@/types/project/projectViewModel.types';

interface ProjectBasicInfoProps {
  editMode: boolean;
  project: IProjectViewModel | null;
  form: FormInstance;
}

const ProjectBasicInfo = ({ editMode, project, form }: ProjectBasicInfoProps) => {
  const { t } = useTranslation('project-drawer');

  const defaultColorCode = '#154c9b';

  return (
    <>
      <Form.Item
        name="name"
        label={t('name')}
        rules={[{ required: true, message: t('pleaseEnterAName') }]}
      >
        <Input placeholder={t('enterProjectName')} />
      </Form.Item>

      {editMode && (
        <Form.Item name="key" label={t('key')}>
          <Input placeholder={t('enterProjectKey')} value={project?.key} />
        </Form.Item>
      )}

      <Form.Item 
        name="color_code" 
        label={t('projectColor')} 
        layout="horizontal" 
        required
      >
        <ColorPicker
          value={project?.color_code || defaultColorCode}
          onChange={value => form.setFieldValue('color_code', value.toHexString())}
        />
      </Form.Item>
    </>
  );
};

export default ProjectBasicInfo;
