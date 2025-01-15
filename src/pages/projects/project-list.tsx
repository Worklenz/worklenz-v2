import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button, Card, Empty, Flex, Input, Segmented, Table, TablePaginationConfig, Tooltip } from 'antd';
import { PageHeader } from '@ant-design/pro-components';
import { SearchOutlined, SyncOutlined } from '@ant-design/icons';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';

import ProjectDrawer from '@/components/projects/project-drawer/project-drawer';
import CreateProjectButton from '@/components/projects/project-create-button/project-create-button';
import TableColumns from '@/components/project-list/TableColumns';

import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import {
  deleteProject,
  fetchProjects,
  toggleDrawer,
  setRequestParams,
} from '@/features/projects/projectsSlice';
import { getProject, setProjectId } from '@/features/project/project.slice';
import { fetchProjectHealth } from '@/features/projects/lookups/projectHealth/projectHealthSlice';
import { fetchProjectCategories } from '@/features/projects/lookups/projectCategories/projectCategoriesSlice';
import { fetchProjectStatuses } from '@/features/projects/lookups/projectStatuses/projectStatusesSlice';

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
import { IProjectCategory } from '@/types/project/projectCategory.types';
import { useAuthService } from '@/hooks/useAuth';

interface PaginationState {
  current: number;
  pageSize: number;
}

interface SorterState {
  order: string;
  columnKey: string;
}

const ProjectList: React.FC = () => {
  const { t } = useTranslation('all-project-list');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useDocumentTitle('Projects');
  const isOwnerOrAdmin = useAuthService().isOwnerOrAdmin();

  // Redux state
  const { loading, projects, filteredCategories, requestParams } = useAppSelector(state => state.projectsReducer);
  const { projectStatuses } = useAppSelector(state => state.projectStatusesReducer);
  const { projectHealths: healths } = useAppSelector(state => state.projectHealthReducer);
  const { projectCategories } = useAppSelector(state => state.projectCategoriesReducer);

  // Parallel data fetching on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      const promises = [
        dispatch(fetchProjectCategories()),
        !healths.length && dispatch(fetchProjectHealth()),
        !projectStatuses.length && dispatch(fetchProjectStatuses()),
      ].filter(Boolean);

      await Promise.all(promises);
    };

    fetchInitialData();
  }, []);

  // Callback functions
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

  // Memoized values
  const filters = useMemo(() => Object.values(IProjectFilter), []);

  const getProjects = useCallback(async () => {
    try {
      await dispatch(fetchProjects(requestParams)).unwrap();
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }, [dispatch, requestParams, filteredCategories]);

  const handleTableChange = useCallback(
    (
      newPagination: TablePaginationConfig,
      filters: Record<string, FilterValue | null>,
      sorter: SorterResult<IProjectViewModel> | SorterResult<IProjectViewModel>[]
    ) => {
      const newParams: Partial<typeof requestParams> = {};

      if (filters?.status_id) {
        newParams.statuses = filters.status_id.join('+');
      }
      
      if (filters?.category_id) {
        console.log('filters.category_id', filters.category_id);
        // dispatch(setFilteredCategories(filters.category_id.join('+')));
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
    [dispatch, setSortingValues]
  );

  const handleRefresh = useCallback(() => {
    getProjects();
  }, [getProjects]);

  const handleSegmentChange = useCallback(
    (value: IProjectFilter) => {
      const newFilterIndex = filters.indexOf(value);
      setFilterIndex(newFilterIndex);
      dispatch(setRequestParams({ filter: newFilterIndex }));
    },
    [filters, setFilterIndex, dispatch]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      dispatch(setRequestParams({ search: value }));
      // debouncedSearchTerm(value, (debouncedValue) => {
      //   dispatch(setRequestParams({ search: debouncedValue }));
      // });
    },
    [dispatch]
  );

  const setSelectedProjectId = useCallback(
    (id: string) => {
      if (id) {
        dispatch(setProjectId(id));
        dispatch(getProject(id));
        dispatch(toggleDrawer());
      }
    },
    [dispatch]
  );

  // Effects
  useEffect(() => {
    getProjects();
  }, [getProjects]);

  const filterCategories = (category: string) => {
    console.log('clicked', category);
  };

  const handleDeleteProject = async (id: string) => {
    await dispatch(deleteProject(id)).unwrap();
    handleRefresh();
  };

  const paginationConfig = useMemo(
    () => ({
      current: requestParams.index,
      pageSize: requestParams.size,
      showSizeChanger: true,
      defaultPageSize: DEFAULT_PAGE_SIZE,
      pageSizeOptions: PAGE_SIZE_OPTIONS,
      size: 'small' as const,
      total: projects.total,
    }),
    [requestParams.index, requestParams.size, projects.total]
  );

  return (
    <div style={{ marginBlock: 65, minHeight: '90vh' }}>
      <PageHeader
        className="site-page-header"
        title={`${projects.total} ${t('projects')}`}
        style={{ padding: '16px 0' }}
        extra={
          <Flex gap={8} align="center">
            <Tooltip title={t('refreshProjects')}>
              <Button
                shape="circle"
                icon={<SyncOutlined spin={loading} />}
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
          columns={TableColumns(navigate, projectStatuses, projectCategories, setSelectedProjectId, filteredCategories)}
          dataSource={projects.data}
          rowKey={record => record.id || ''}
          loading={loading}
          size="small"
          onChange={handleTableChange}
          pagination={paginationConfig}
          locale={{ emptyText: <Empty description={t('noProjects')} /> }}
        />
      </Card>

      <ProjectDrawer
        categories={projectCategories || []}
        statuses={projectStatuses || []}
        healths={healths || []}
        onDelete={handleDeleteProject}
      />
    </div>
  );
};

export default ProjectList;
