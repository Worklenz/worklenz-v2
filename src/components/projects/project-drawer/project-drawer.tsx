import { useEffect, useRef, useState } from 'react';

import {
  AutoComplete,
  Badge,
  Button,
  DatePicker,
  Divider,
  Drawer,
  Flex,
  Form,
  Input,
  InputRef,
  Popconfirm,
  Select,
  Skeleton,
  Space,
  Spin,
  Tooltip,
  Typography,
} from 'antd';
import dayjs from 'dayjs';

import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import {
  createProject,
  deleteProject,
  toggleDrawer,
  updateProject,
} from '@features/projects/projectsSlice';
import { addCategory } from '@features/settings/categories/categoriesSlice';

import { projectColors } from '@/lib/project/projectConstants';
import { colors } from '@/styles/colors';
import { IProjectViewModel } from '@/types/project/projectViewModel.types';
import { IProjectCategory } from '@/types/project/projectCategory.types';

import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { fetchClients } from '@/features/settings/client/clientSlice';
import { getStatusIcon } from '@/utils/projectUtils';
import { IProjectHealth } from '@/types/project/projectHealth.types';
import { IProjectStatus } from '@/types/project/projectStatus.types';
import { useTranslation } from 'react-i18next';
import ProjectManagerDropdown from '../project-manager-dropdown/project-manager-dropdown';
import { setProject, setProjectId } from '@/features/project/project.slice';
import { useNavigate } from 'react-router-dom';
import { formatDateTimeWithLocale } from '@/utils/format-date-time-with-locale';
import { calculateTimeDifference } from '@/utils/calculate-time-difference';
import logger from '@/utils/errorLogger';
import ProjectBasicInfo from './project-basic-info/project-basic-info';
import ProjectHealthSection from './project-health-section/project-health-section';
import ProjectStatusSection from './project-status-section/project-status-section';
import ProjectCategorySection from './project-category-section/project-category-section';
import ProjectClientSection from './project-client-section/project-client-section';

const ProjectDrawer = ({
  categories = [],
  statuses = [],
  healths = [],
  onDelete,
}: {
  categories: IProjectCategory[];
  statuses: IProjectStatus[];
  healths: IProjectHealth[];
  onDelete: (id: string) => void;
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('project-drawer');
  const navigate = useNavigate();

  const { clients, loading: loadingClients } = useAppSelector(state => state.clientReducer);
  const { project, projectId, projectLoading } = useAppSelector(state => state.projectReducer);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [creatingProject, setCreatingProject] = useState<boolean>(false);
  const [deletingProject, setDeletingProject] = useState<boolean>(false);

  useEffect(() => {
    if (!clients.data?.length)
      dispatch(fetchClients({ index: 1, size: 5, field: null, order: null, search: null }));
  }, [dispatch]);

  const [editMode, setEditMode] = useState<boolean>(false);

  const isDrawerOpen = useAppSelector(state => state.projectsReducer.isProjectDrawerOpen);

  const [form] = Form.useForm();

  // function for handle form submit
  const handleFormSubmit = async (values: any) => {
    setCreatingProject(true);
    try {
      const projectModel: IProjectViewModel = {
        name: values.name,
        color_code: values.color_code,
        status_id: values.status_id,
        category_id: values.category_id || null,
        health_id: values.health_id,
        notes: values.notes,
        key: values.key,
        client_id: values.client_id,
        client_name: values.client_name,
        project_manager: values.projectManager,
        start_date: values.start_date,
        end_date: values.end_date,
        working_days: values.working_days,
        man_days: values.man_days,
        hours_per_day: values.hours_per_day,
      };
      if (editMode && projectId) {
        const response = await dispatch(
          updateProject({ id: projectId, project: projectModel })
        ).unwrap();
        if (response?.id) {
          form.resetFields();
          dispatch(toggleDrawer());
        }
      } else {
        const response = await dispatch(createProject(projectModel)).unwrap();
        if (response?.id) {
          form.resetFields();
          dispatch(toggleDrawer());
          navigate(`/worklenz/projects/${response.id}`);
        }
      }
    } catch (error) {
      logger.error('Error creating project', error);
    } finally {
      setCreatingProject(false);
    }
  };

  const visibleChanged = (visible: boolean) => {
    if (visible && project?.id) {
      setEditMode(true);
      form.setFieldsValue({
        ...project,
        start_date: project.start_date ? dayjs(project.start_date) : null,
        end_date: project.end_date ? dayjs(project.end_date) : null,
      });
    }
  };

  const handleDrawerClose = () => {
    form.resetFields();
    dispatch(toggleDrawer());
    setEditMode(false);
    dispatch(setProject({} as IProjectViewModel));
    dispatch(setProjectId(null));
  };

  const handleDeleteProject = async () => {
    setDeletingProject(true);
    if (projectId) {
      await dispatch(deleteProject(projectId)).unwrap();
      dispatch(toggleDrawer());
      navigate('/worklenz/projects');
    }
    setDeletingProject(false);
  };

  return (
    <Drawer
      title={
        <Typography.Text style={{ fontWeight: 500, fontSize: 16 }}>
          {editMode ? t('editProject') : t('createProject')}
        </Typography.Text>
      }
      open={isDrawerOpen}
      onClose={handleDrawerClose}
      destroyOnClose
      afterOpenChange={visibleChanged}
      footer={
        <Flex justify="space-between">
          <Space>
            {editMode && (
              <Popconfirm
                title={t('deleteConfirmation')}
                description={t('deleteConfirmationDescription')}
                onConfirm={handleDeleteProject}
                okText={t('yes')}
                cancelText={t('no')}
              >
                <Button danger type="dashed" loading={deletingProject}>
                  {t('delete')}
                </Button>
              </Popconfirm>
            )}
          </Space>
          <Space>
            <Button type="primary" onClick={() => form.submit()} loading={creatingProject}>
              {editMode ? t('update') : t('create')}
            </Button>
          </Space>
        </Flex>
      }
    >
      {
        <Skeleton active paragraph={{ rows: 12 }} loading={projectLoading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
            initialValues={{
              color_code: project?.color_code || projectColors[0],
              status_id: project?.status_id || statuses.find(status => status.is_default)?.id,
              health_id: project?.health_id || healths.find(health => health.is_default)?.id,
              client_id: project?.client_id || null,
              client: project?.client_name || null,
              category_id: project?.category_id || null,
              working_days: project?.working_days || 0,
              man_days: project?.man_days || 0,
              hours_per_day: project?.hours_per_day || 8,
            }}
          >
            <ProjectBasicInfo editMode={editMode} project={project} form={form} />
            <ProjectStatusSection statuses={statuses} form={form} t={t} />
            <ProjectHealthSection healths={healths} form={form} t={t} />
            <ProjectCategorySection categories={categories} form={form} t={t} />

            <Form.Item name="notes" label={t('notes')}>
              <Input.TextArea placeholder={t('enterNotes')} />
            </Form.Item>

            <ProjectClientSection
              clients={clients}
              form={form}
              t={t}
              project={project}
              loadingClients={loadingClients}
            />

            <Form.Item name="project_manager" label={t('projectManager')} layout="horizontal">
              <ProjectManagerDropdown />
            </Form.Item>
            <Form.Item name="date" layout="horizontal">
              <Flex gap={8}>
                <Form.Item name="start_date" label={t('startDate')}>
                  <DatePicker />
                </Form.Item>
                <Form.Item name="end_date" label={t('endDate')}>
                  <DatePicker />
                </Form.Item>
              </Flex>
            </Form.Item>
            <Form.Item name="working_days" label={t('estimateWorkingDays')}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="man_days" label={t('estimateManDays')}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="hours_per_day" label={t('hoursPerDay')}>
              <Input type="number" />
            </Form.Item>
          </Form>
          {editMode && (
            <Flex vertical gap={4}>
              <Divider />
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {t('createdAt')}&nbsp;
                <Tooltip title={formatDateTimeWithLocale(project?.created_at || '')}>
                  {calculateTimeDifference(project?.created_at || '')}
                </Tooltip>{' '}
                {t('by')} {project?.project_owner || ''}
              </Typography.Text>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {t('updatedAt')}&nbsp;
                <Tooltip title={formatDateTimeWithLocale(project?.updated_at || '')}>
                  {calculateTimeDifference(project?.updated_at || '')}
                </Tooltip>
              </Typography.Text>
            </Flex>
          )}
        </Skeleton>
      }
    </Drawer>
  );
};

export default ProjectDrawer;
