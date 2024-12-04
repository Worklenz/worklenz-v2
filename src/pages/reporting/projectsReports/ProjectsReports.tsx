import {
  Button,
  Card,
  Checkbox,
  Dropdown,
  Flex,
  Skeleton,
  Space,
  Typography,
} from 'antd';
import React, { useEffect } from 'react';
import CustomPageHeader from '../pageHeader/CustomPageHeader';
import { DownOutlined } from '@ant-design/icons';
import ProjectReportsTable from './projectsReportsTable/ProjectsReportsTable';
import ProjectsReportsFilters from './projectsReportsFilters/ProjectsReportsFilters';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { fetchProjectData } from '../../../features/reporting/projectReports/projectReportsSlice';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '../../../hooks/useDoumentTItle';

const ProjectsReports = () => {
  // localization
  const { t } = useTranslation('reportingProjects');

  useDocumentTitle('Reporting - Projects');

  const dispatch = useAppDispatch();

  // get project list and loading state from project repors reducer
  const { projectList, isLoading } = useAppSelector(
    (state) => state.projectReportsReducer
  );

  // load data from project reports reducer
  useEffect(() => {
    dispatch(fetchProjectData());
  }, [dispatch]);

  return (
    <Flex vertical>
      <CustomPageHeader
        title={`${projectList.length === 1 ? `${projectList.length}  ${t('projectCount')}` : `${projectList.length}  ${t('projectCountPlural')}`} `}
        children={
          <Space>
            <Button>
              <Checkbox />
              <Typography.Text>{t('includeArchivedButton')}</Typography.Text>
            </Button>

            <Dropdown menu={{ items: [{ key: '1', label: t('excelButton') }] }}>
              <Button type="primary" icon={<DownOutlined />} iconPosition="end">
                {t('exportButton')}
              </Button>
            </Dropdown>
          </Space>
        }
      />

      <Card title={<ProjectsReportsFilters />}>
        {isLoading ? (
          <Skeleton />
        ) : (
          <ProjectReportsTable projectList={projectList} />
        )}
      </Card>
    </Flex>
  );
};

export default ProjectsReports;
