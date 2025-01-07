// Core dependencies
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Ant Design components
import { Button, Card, Empty, Flex, Input, Segmented, Table, TablePaginationConfig, Tooltip } from 'antd';
import { PageHeader } from '@ant-design/pro-components';
import { SearchOutlined, SyncOutlined } from '@ant-design/icons';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';

// Components
import ProjectDrawer from '@/components/projects/project-drawer/project-drawer';
import CreateProjectButton from '@/components/projects/project-create-button/project-create-button';
import TableColumns from '@/components/project-list/TableColumns';

// Redux
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import {
  deleteProject,
  fetchProjects,
  setFilteredCategories,
  toggleArchiveProject,
  toggleDrawer,
} from '@/features/projects/projectsSlice';
import { getProject, setProjectId } from '@/features/project/project.slice';
import { fetchProjectHealth } from '@/features/projects/lookups/projectHealth/projectHealthSlice';
import { fetchProjectCategories } from '@/features/projects/lookups/projectCategories/projectCategoriesSlice';
import { fetchProjectStatuses } from '@/features/projects/lookups/projectStatuses/projectStatusesSlice';

// Constants and types
import {
  DEFAULT_PAGE_SIZE,
  FILTER_INDEX_KEY,
  PAGE_SIZE_OPTIONS,
  PROJECT_SORT_FIELD,
  PROJECT_SORT_ORDER,
} from '@/shared/constants';
import { IProjectFilter } from '@/types/project/project.types';
import { IProjectViewModel } from '@/types/project/projectViewModel.types';

// Hooks and styles
import { useDocumentTitle } from '@/hooks/useDoumentTItle';
import './project-list.css';
import { IProjectCategory } from '@/types/project/projectCategory.types';
import { useAuthService } from '@/hooks/useAuth';

// Interfaces
interface PaginationState {
  current: number;
  pageSize: number;
}

interface SorterState {
  order: string;
  columnKey: string;
}

const ProjectList: React.FC = () => {
  // Hooks
  const { t } = useTranslation('all-project-list');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useDocumentTitle('Projects');
  const isOwnerOrAdmin = useAuthService().isOwnerOrAdmin();

  // Redux state
  const { loading, projects, filteredCategories } = useAppSelector(state => state.projectsReducer);
  const { projectStatuses } = useAppSelector(state => state.projectStatusesReducer);
  const { projectHealths: healths } = useAppSelector(state => state.projectHealthReducer);
  const { projectCategories } = useAppSelector(state => state.projectCategoriesReducer);

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [sorter, setSorter] = useState<SorterState>(() => ({
    order: localStorage.getItem(PROJECT_SORT_ORDER) ?? 'ascend',
    columnKey: localStorage.getItem(PROJECT_SORT_FIELD) ?? 'name',
  }));
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Debounced search term
  const [debouncedSearchTerm] = useState(() => {
    let timeoutId: NodeJS.Timeout;
    return (value: string, callback: (value: string) => void) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => callback(value), 300);
    };
  });

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

  const setSortingValues = useCallback((sorter: SorterState) => {
    localStorage.setItem(PROJECT_SORT_FIELD, sorter.columnKey);
    localStorage.setItem(PROJECT_SORT_ORDER, sorter.order);
  }, []);

  // Memoized values
  const filters = useMemo(() => Object.values(IProjectFilter), []);

  const requestParams = useMemo(
    () => ({
      index: pagination.current,
      size: pagination.pageSize,
      field: sorter.columnKey,
      order: sorter.order,
      filter: getFilterIndex(),
      search: searchTerm,
      statuses: selectedStatus,
      categories: filteredCategories,
    }),
    [pagination, sorter, getFilterIndex, searchTerm, selectedStatus, filteredCategories]
  );

  const paginationConfig = useMemo(
    () => ({
      current: pagination.current,
      pageSize: pagination.pageSize,
      showSizeChanger: true,
      defaultPageSize: DEFAULT_PAGE_SIZE,
      pageSizeOptions: PAGE_SIZE_OPTIONS,
      size: 'small' as const,
      total: projects.total,
    }),
    [pagination, projects.total]
  );

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
      if (filters?.status_id) {
        setSelectedStatus(filters.status_id.join('+'));
      }
      if (filters?.category_id) {
        console.log('filters.category_id', filters.category_id);
        // dispatch(setFilteredCategories(filters.category_id.join('+')));
      }

      const newSorter = {
        order: (Array.isArray(sorter) ? sorter[0].order : sorter.order) ?? 'ascend',
        columnKey:
          ((Array.isArray(sorter) ? sorter[0].columnKey : sorter.columnKey) as string) ?? 'name',
      };

      setPagination({
        current: newPagination.current || 1,
        pageSize: newPagination.pageSize || DEFAULT_PAGE_SIZE,
      });

      setSorter(newSorter);
    },
    []
  );

  const handleRefresh = useCallback(() => {
    getProjects();
  }, [getProjects]);

  const handleSegmentChange = useCallback(
    (value: IProjectFilter) => {
      setFilterIndex(filters.indexOf(value));
      const newFilterIndex = filters.indexOf(value);
      dispatch(
        fetchProjects({
          ...requestParams,
          filter: newFilterIndex,
        })
      );
    },
    [filters, setFilterIndex, dispatch, requestParams]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      debouncedSearchTerm(value, setSearchTerm);
    },
    [debouncedSearchTerm]
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
    setSortingValues(sorter);
    getProjects();
  }, [
    searchTerm,
    selectedStatus,
    filteredCategories,
    pagination,
    sorter,
    setSortingValues,
    getProjects,
  ]);

  const filterCategories = (category: string) => {
    console.log('clicked', category);
  };

  const handleDeleteProject = async (id: string) => {
    await dispatch(deleteProject(id)).unwrap();
    handleRefresh();
  };

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
              value={searchTerm}
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
