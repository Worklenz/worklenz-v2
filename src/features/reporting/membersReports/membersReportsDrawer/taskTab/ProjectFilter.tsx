import { Flex, Select, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

type ProjectFilterProps = {
  projectList: {
    projectId: string;
    project: string;
  }[];
};

const ProjectFilter = ({ projectList }: ProjectFilterProps) => {
  // localization
  const { t } = useTranslation('reporting-members-drawer');

  const selectOptions = projectList.map(project => ({
    key: project.projectId,
    value: project.project,
  }));

  return (
    <Flex gap={4} align="center">
      <Typography.Text>{t('filterByText')}</Typography.Text>
      <Select placeholder={t('selectProjectPlaceholder')} options={selectOptions} />
    </Flex>
  );
};

export default ProjectFilter;
