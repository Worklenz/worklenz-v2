import { useEffect, useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Button,
  DatePicker,
  Divider,
  Drawer,
  Flex,
  Form,
  Input,
  notification,
  Popconfirm,
  Skeleton,
  Space,
  Tooltip,
  Typography,
} from 'antd';
import dayjs from 'dayjs';

import { fetchClients } from '@/features/settings/client/clientSlice';
import {
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectsQuery,
  useUpdateProjectMutation,
} from '@/api/projects/projects.v1.api.service';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { projectColors } from '@/lib/project/project-constants';
import { setProject, setProjectId } from '@/features/project/project.slice';
import { fetchProjectCategories } from '@/features/projects/lookups/projectCategories/projectCategoriesSlice';
import { fetchProjectHealth } from '@/features/projects/lookups/projectHealth/projectHealthSlice';
import { fetchProjectStatuses } from '@/features/projects/lookups/projectStatuses/projectStatusesSlice';

import ProjectManagerDropdown from '../project-manager-dropdown/project-manager-dropdown';
import ProjectBasicInfo from './project-basic-info/project-basic-info';
import ProjectHealthSection from './project-health-section/project-health-section';
import ProjectStatusSection from './project-status-section/project-status-section';
import ProjectCategorySection from './project-category-section/project-category-section';
import ProjectClientSection from './project-client-section/project-client-section';

import { IProjectViewModel } from '@/types/project/projectViewModel.types';
import { ITeamMemberViewModel } from '@/types/teamMembers/teamMembersGetResponse.types';
import { calculateTimeDifference } from '@/utils/calculate-time-difference';
import { formatDateTimeWithLocale } from '@/utils/format-date-time-with-locale';
import logger from '@/utils/errorLogger';
import { setProjectData, toggleProjectDrawer } from '@/features/project/project-drawer.slice';
import useIsProjectManager from '@/hooks/useIsProjectManager';
import { useAuthService } from '@/hooks/useAuth';

const ProjectDrawer = ({ onClose }: { onClose: () => void }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation('project-drawer');
  const [form] = Form.useForm();

  // Auth and permissions
  const isProjectManager = useIsProjectManager();
  const isOwnerorAdmin = useAuthService().isOwnerOrAdmin();
  const isEditable = isProjectManager || isOwnerorAdmin;

  // State
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedProjectManager, setSelectedProjectManager] = useState<ITeamMemberViewModel | null>(
    null
  );

  // Selectors
  const { clients, loading: loadingClients } = useAppSelector(state => state.clientReducer);
  const { requestParams } = useAppSelector(state => state.projectsReducer);
  const { isProjectDrawerOpen, projectId, projectLoading, project } = useAppSelector(
    state => state.projectDrawerReducer
  );
  const { projectStatuses } = useAppSelector(state => state.projectStatusesReducer);
  const { projectHealths } = useAppSelector(state => state.projectHealthReducer);
  const { projectCategories } = useAppSelector(state => state.projectCategoriesReducer);

  // API Hooks
  const { refetch: refetchProjects } = useGetProjectsQuery(requestParams);
  const [deleteProject, { isLoading: isDeletingProject }] = useDeleteProjectMutation();
  const [updateProject, { isLoading: isUpdatingProject }] = useUpdateProjectMutation();
  const [createProject, { isLoading: isCreatingProject }] = useCreateProjectMutation();

  // Memoized values
  const defaultFormValues = useMemo(
    () => ({
      color_code: project?.color_code || projectColors[0],
      status_id: project?.status_id || projectStatuses.find(status => status.is_default)?.id,
      health_id: project?.health_id || projectHealths.find(health => health.is_default)?.id,
      client_id: project?.client_id || null,
      client: project?.client_name || null,
      category_id: project?.category_id || null,
      working_days: project?.working_days || 0,
      man_days: project?.man_days || 0,
      hours_per_day: project?.hours_per_day || 8,
    }),
    [project, projectStatuses, projectHealths]
  );

  // Effects
  useEffect(() => {
    const loadInitialData = async () => {
      const fetchPromises = [];
      if (projectStatuses.length === 0) fetchPromises.push(dispatch(fetchProjectStatuses()));
      if (projectCategories.length === 0) fetchPromises.push(dispatch(fetchProjectCategories()));
      if (projectHealths.length === 0) fetchPromises.push(dispatch(fetchProjectHealth()));
      if (!clients.data?.length) {
        fetchPromises.push(
          dispatch(fetchClients({ index: 1, size: 5, field: null, order: null, search: null }))
        );
      }
      await Promise.all(fetchPromises);
    };

    loadInitialData();
  }, [dispatch]);

  // Handlers
  const handleFormSubmit = async (values: any) => {
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
        start_date: values.start_date,
        end_date: values.end_date,
        working_days: parseInt(values.working_days),
        man_days: parseInt(values.man_days),
        hours_per_day: parseInt(values.hours_per_day),
        project_manager: selectedProjectManager,
      };

      const action =
        editMode && projectId
          ? updateProject({ id: projectId, project: projectModel })
          : createProject(projectModel);

      const response = await action;

      if (response?.data?.done) {
        form.resetFields();
        dispatch(toggleProjectDrawer());
        if (!editMode) {
          navigate(`/worklenz/projects/${response.data.body.id}?tab=tasks-list&pinned_tab=tasks-list`);
        }
        refetchProjects();
      } else {
        notification.error({ message: response?.data?.message });
        logger.error(
          editMode ? 'Error updating project' : 'Error creating project',
          response?.data?.message
        );
      }
    } catch (error) {
      logger.error('Error saving project', error);
    }
  };

  const handleVisibilityChange = useCallback(
    (visible: boolean) => {
      if (visible && projectId) {
        setEditMode(true);
        if (project) {
          form.setFieldsValue({
            ...project,
            start_date: project.start_date ? dayjs(project.start_date) : null,
            end_date: project.end_date ? dayjs(project.end_date) : null,
          });
          setSelectedProjectManager(project.project_manager || null);
        }
      } else {
        resetForm();
      }
    },
    [projectId, project]
  );

  const resetForm = useCallback(() => {
    setEditMode(false);
    form.resetFields();
    setSelectedProjectManager(null);
  }, [form]);

  const handleDrawerClose = useCallback(() => {
    resetForm();
    setTimeout(() => dispatch(toggleProjectDrawer()), 300);
    onClose();
  }, [resetForm, dispatch, onClose]);

  const handleDeleteProject = async () => {
    if (!projectId) return;

    try {
      const res = await deleteProject(projectId);
      if (res?.data?.done) {
        dispatch(setProject({} as IProjectViewModel));
        dispatch(setProjectData({} as IProjectViewModel));
        dispatch(setProjectId(null));
        dispatch(toggleProjectDrawer());
        navigate('/worklenz/projects');
        refetchProjects();
      } else {
        notification.error({ message: res?.data?.message });
        logger.error('Error deleting project', res?.data?.message);
      }
    } catch (error) {
      logger.error('Error deleting project', error);
    }
  };

  const disabledStartDate = useCallback(
    (current: dayjs.Dayjs) => {
      const endDate = form.getFieldValue('end_date');
      return current && endDate ? current > dayjs(endDate) : false;
    },
    [form]
  );

  const disabledEndDate = useCallback(
    (current: dayjs.Dayjs) => {
      const startDate = form.getFieldValue('start_date');
      return current && startDate ? current < dayjs(startDate) : false;
    },
    [form]
  );

  return (
    <Drawer
      title={
        <Typography.Text style={{ fontWeight: 500, fontSize: 16 }}>
          {projectId ? t('editProject') : t('createProject')}
        </Typography.Text>
      }
      open={isProjectDrawerOpen}
      onClose={handleDrawerClose}
      destroyOnClose
      afterOpenChange={handleVisibilityChange}
      footer={
        <Flex justify="space-between">
          <Space>
            {editMode && (isProjectManager || isOwnerorAdmin) && (
              <Popconfirm
                title={t('deleteConfirmation')}
                description={t('deleteConfirmationDescription')}
                onConfirm={handleDeleteProject}
                okText={t('yes')}
                cancelText={t('no')}
              >
                <Button danger type="dashed" loading={isDeletingProject}>
                  {t('delete')}
                </Button>
              </Popconfirm>
            )}
          </Space>
          <Space>
            <Button
              type="primary"
              onClick={() => form.submit()}
              loading={isCreatingProject || isUpdatingProject}
            >
              {editMode ? t('update') : t('create')}
            </Button>
          </Space>
        </Flex>
      }
    >
      {!isEditable && (
        <Alert
          message={t('noPermission')}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      <Skeleton active paragraph={{ rows: 12 }} loading={projectLoading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={defaultFormValues}
        >
          <ProjectBasicInfo
            editMode={editMode}
            project={project}
            form={form}
            disabled={!isProjectManager && !isOwnerorAdmin}
          />
          <ProjectStatusSection
            statuses={projectStatuses}
            form={form}
            t={t}
            disabled={!isProjectManager && !isOwnerorAdmin}
          />
          <ProjectHealthSection
            healths={projectHealths}
            form={form}
            t={t}
            disabled={!isProjectManager && !isOwnerorAdmin}
          />
          <ProjectCategorySection
            categories={projectCategories}
            form={form}
            t={t}
            disabled={!isProjectManager && !isOwnerorAdmin}
          />

          <Form.Item name="notes" label={t('notes')}>
            <Input.TextArea
              placeholder={t('enterNotes')}
              disabled={!isProjectManager && !isOwnerorAdmin}
            />
          </Form.Item>

          <ProjectClientSection
            clients={clients}
            form={form}
            t={t}
            project={project}
            loadingClients={loadingClients}
            disabled={!isProjectManager && !isOwnerorAdmin}
          />

          <Form.Item name="project_manager" label={t('projectManager')} layout="horizontal">
            <ProjectManagerDropdown
              selectedProjectManager={selectedProjectManager}
              setSelectedProjectManager={setSelectedProjectManager}
              disabled={!isProjectManager && !isOwnerorAdmin}
            />
          </Form.Item>

          <Form.Item name="date" layout="horizontal">
            <Flex gap={8}>
              <Form.Item name="start_date" label={t('startDate')}>
                <DatePicker
                  disabledDate={disabledStartDate}
                  disabled={!isProjectManager && !isOwnerorAdmin}
                />
              </Form.Item>
              <Form.Item name="end_date" label={t('endDate')}>
                <DatePicker
                  disabledDate={disabledEndDate}
                  disabled={!isProjectManager && !isOwnerorAdmin}
                />
              </Form.Item>
            </Flex>
          </Form.Item>

          <Form.Item name="working_days" label={t('estimateWorkingDays')}>
            <Input type="number" disabled={!isProjectManager && !isOwnerorAdmin} />
          </Form.Item>
          <Form.Item name="man_days" label={t('estimateManDays')}>
            <Input type="number" disabled={!isProjectManager && !isOwnerorAdmin} />
          </Form.Item>
          <Form.Item name="hours_per_day" label={t('hoursPerDay')}>
            <Input type="number" disabled={!isProjectManager && !isOwnerorAdmin} />
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
    </Drawer>
  );
};

export default ProjectDrawer;
