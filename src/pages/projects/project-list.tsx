import React, { Suspense, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Card,
  Empty,
  Flex,
  Input,
  Segmented,
  Skeleton,
  Table,
  TablePaginationConfig,
  Tooltip,
} from 'antd';
import { PageHeader } from '@ant-design/pro-components';
import { SearchOutlined, SyncOutlined } from '@ant-design/icons';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';

import ProjectDrawer from '@/components/projects/project-drawer/project-drawer';
import CreateProjectButton from '@/components/projects/project-create-button/project-create-button';
import TableColumns from '@/components/project-list/TableColumns';

import {
  useGetProjectsQuery,
  useDeleteProjectMutation,
} from '@/api/projects/projects.v1.api.service';

import {
  DEFAULT_PAGE_SIZE,
  FILTER_INDEX_KEY,
  PAGE_SIZE_OPTIONS,
  PROJECT_SORT_FIELD,
  PROJECT_SORT_ORDER,
} from '@/shared/constants';
import { IProjectFilter } from '@/types/project/project.types';
import { IProjectViewModel } from '@/types/project/projectViewModel.types';

import { useDocumentTitle } from '@/hooks/useDoumentTItle';
import './project-list.css';
import { useAuthService } from '@/hooks/useAuth';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setFilteredCategories, setFilteredStatuses, setRequestParams } from '@/features/projects/projectsSlice';
import { fetchProjectStatuses } from '@/features/projects/lookups/projectStatuses/projectStatusesSlice';
import { fetchProjectCategories } from '@/features/projects/lookups/projectCategories/projectCategoriesSlice';
import { fetchProjectHealth } from '@/features/projects/lookups/projectHealth/projectHealthSlice';

const ProjectList: React.FC = () => {
  const { t } = useTranslation('all-project-list');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useDocumentTitle('Projects');
  const isOwnerOrAdmin = useAuthService().isOwnerOrAdmin();

  const getFilterIndex = useCallback(() => {
    return +(localStorage.getItem(FILTER_INDEX_KEY) || 0);
  }, []);

  const setFilterIndex = useCallback((index: number) => {
    localStorage.setItem(FILTER_INDEX_KEY, index.toString());
  }, []);

  const setSortingValues = useCallback((field: string, order: string) => {
    localStorage.setItem(PROJECT_SORT_FIELD, field);
    localStorage.setItem(PROJECT_SORT_ORDER, order);
  }, []);

  const { requestParams, filteredCategories, filteredStatuses } = useAppSelector(state => state.projectsReducer);

  const { projectStatuses } = useAppSelector(state => state.projectStatusesReducer);
  const { projectHealths } = useAppSelector(state => state.projectHealthReducer);
  const { projectCategories } = useAppSelector(state => state.projectCategoriesReducer);

  const {
    data: projectsData,
    isLoading: loadingProjects,
    isFetching: isFetchingProjects,
    refetch: refetchProjects,
  } = useGetProjectsQuery(requestParams);

  const filters = useMemo(() => Object.values(IProjectFilter), []);

  const handleTableChange = useCallback(
    (
      newPagination: TablePaginationConfig,
      filters: Record<string, FilterValue | null>,
      sorter: SorterResult<IProjectViewModel> | SorterResult<IProjectViewModel>[]
    ) => {
      const newParams: Partial<typeof requestParams> = {};

      if (!filters?.status_id) {
        newParams.statuses = null;
        dispatch(setFilteredStatuses([]));
      } else {
        newParams.statuses = filters.status_id.join(' ');
      }

      if (!filters?.category_id) {
        newParams.categories = null;
        dispatch(setFilteredCategories([]));
      } else {
        newParams.categories = filters.category_id.join(' ');
      }

      const newOrder = Array.isArray(sorter) ? sorter[0].order : sorter.order;
      const newField = (Array.isArray(sorter) ? sorter[0].columnKey : sorter.columnKey) as string;

      if (newOrder && newField) {
        newParams.order = newOrder ?? 'ascend';
        newParams.field = newField ?? 'name';
        setSortingValues(newParams.field, newParams.order);
      }

      newParams.index = newPagination.current || 1;
      newParams.size = newPagination.pageSize || DEFAULT_PAGE_SIZE;

      dispatch(setRequestParams(newParams));
    },
    [setSortingValues]
  );

  const handleRefresh = useCallback(() => {
    refetchProjects();
  }, [refetchProjects, requestParams]);

  const handleSegmentChange = useCallback(
    (value: IProjectFilter) => {
      const newFilterIndex = filters.indexOf(value);
      setFilterIndex(newFilterIndex);
      dispatch(setRequestParams({ filter: newFilterIndex }));
      refetchProjects();
    },
    [filters, setFilterIndex, refetchProjects]
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setRequestParams({ search: value }));
  }, []);

  const paginationConfig = useMemo(
    () => ({
      current: requestParams.index,
      pageSize: requestParams.size,
      showSizeChanger: true,
      defaultPageSize: DEFAULT_PAGE_SIZE,
      pageSizeOptions: PAGE_SIZE_OPTIONS,
      size: 'small' as const,
      total: projectsData?.body?.total,
    }),
    [requestParams.index, requestParams.size, projectsData?.body?.total]
  );

  useEffect(() => {
    if (projectStatuses.length === 0) dispatch(fetchProjectStatuses());
    if (projectCategories.length === 0) dispatch(fetchProjectCategories());
    if (projectHealths.length === 0) dispatch(fetchProjectHealth());
  }, [requestParams]);

  return (
    <div style={{ marginBlock: 65, minHeight: '90vh' }}>
      <PageHeader
        className="site-page-header"
        title={`${projectsData?.body?.total || 0} ${t('projects')}`}
        style={{ padding: '16px 0' }}
        extra={
          <Flex gap={8} align="center">
            <Tooltip title={t('refreshProjects')}>
              <Button
                shape="circle"
                icon={<SyncOutlined spin={isFetchingProjects} />}
                onClick={handleRefresh}
                aria-label="Refresh projects"
              />
            </Tooltip>
            <Segmented<IProjectFilter>
              options={filters}
              defaultValue={filters[getFilterIndex()] ?? filters[0]}
              onChange={handleSegmentChange}
            />
            <Input
              placeholder={t('placeholder')}
              suffix={<SearchOutlined />}
              type="text"
              value={requestParams.search}
              onChange={handleSearchChange}
              aria-label="Search projects"
            />
            {isOwnerOrAdmin && <CreateProjectButton />}
          </Flex>
        }
      />
      <Card className="project-card">
        <Table<IProjectViewModel>
          columns={TableColumns({
            navigate,
            statuses: projectStatuses || [],
            categories: projectCategories || [],
            filteredCategories,
            filteredStatuses,
          })}
          dataSource={projectsData?.body?.data || []}
          rowKey={record => record.id || ''}
          loading={loadingProjects}
          size="small"
          onChange={handleTableChange}
          pagination={paginationConfig}
          locale={{ emptyText: <Empty description={t('noProjects')} /> }}
        />
      </Card>

      <ProjectDrawer
        categories={projectCategories || []}
        statuses={projectStatuses || []}
        healths={projectHealths || []}
      />
    </div>
  );
};

export default ProjectList;
