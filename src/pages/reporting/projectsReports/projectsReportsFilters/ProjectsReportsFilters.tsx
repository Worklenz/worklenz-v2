import { Flex } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProjectStatusFilterDropdown from './ProjectStatusFilterDropdown';
import ProjectHealthFilterDropdown from './ProjectHealthFilterDropdown';
import ProjectCategoriesFilterDropdown from './ProjectCategoriesFilterDropdown';
import ProjectManagersFilterDropdown from './ProjectManagersFiterDropdown';
import ProjectTableShowFieldsDropdown from './ProjectTableShowFieldsDropdown';
import CustomSearchbar from '../../../../components/CustomSearchbar';

const ProjectsReportsFilters = () => {
  const [searchQuery, setSearhQuery] = useState<string>('');

  // localization
  const { t } = useTranslation('reporting-projects-filters');

  return (
    <Flex gap={8} align="center" justify="space-between">
      <Flex gap={8} wrap={'wrap'}>
        {/* status dropdown  */}
        <ProjectStatusFilterDropdown />
        {/* health dropdown  */}
        <ProjectHealthFilterDropdown />
        {/* category dropdown  */}
        <ProjectCategoriesFilterDropdown />
        {/* project managers dropdown  */}
        <ProjectManagersFilterDropdown />
      </Flex>

      <Flex gap={12}>
        {/* show fields dropdown  */}
        <ProjectTableShowFieldsDropdown />

        {/* searchbar  */}
        <CustomSearchbar
          placeholderText={t('searchByNamePlaceholder')}
          searchQuery={searchQuery}
          setSearchQuery={setSearhQuery}
        />
      </Flex>
    </Flex>
  );
};

export default ProjectsReportsFilters;
