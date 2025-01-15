import { TFunction } from 'i18next';
import { Badge, Form, FormInstance, Select, Typography } from 'antd';

import { IProjectHealth } from '@/types/project/projectHealth.types';

interface ProjectHealthSectionProps {
  healths: IProjectHealth[];
  form: FormInstance;
  t: TFunction;
}

const ProjectHealthSection = ({ healths, form, t }: ProjectHealthSectionProps) => {

  const healthOptions = healths.map((status, index) => ({
    key: index,
    value: status.id,
    label: (
      <Typography.Text style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Badge color={status.color_code} /> {status.name}
      </Typography.Text>
    ),
  }));

  return (
    <Form.Item name="health_id" label={t('health')}>
      <Select
        options={healthOptions}
        onChange={value => form.setFieldValue('health_id', value)}
      />
    </Form.Item>
  );
};

export default ProjectHealthSection;