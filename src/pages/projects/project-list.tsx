import React, { useEffect, useState } from 'react';
import { Button, Card, Flex, Input, Segmented, Table, TablePaginationConfig, Tooltip } from 'antd';
import { PageHeader } from '@ant-design/pro-components';
import { SearchOutlined, SyncOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './project-list.css';
import ProjectDrawer from '@components/projects/projectDrawer/ProjectDrawer';
import { useAppSelector } from '@/hooks/useAppSelector';
import {
  DEFAULT_PAGE_SIZE,
  FILTER_INDEX_KEY,
  PAGE_SIZE_OPTIONS,
  PROJECT_SORT_FIELD,
  PROJECT_SORT_ORDER,
} from '@/shared/constants';
import TableColumns from '@/components/ProjectList/TableColumns';
import { IProjectFilter } from '@/types/project/project.types';
import { fetchProjects } from '@/features/projects/projectsSlice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { IProjectViewModel } from '@/types/project/projectViewModel.types';
import CreateProjectButton from '@/components/projects/projectDrawer/CreateProjectButton';
import { FilterValue } from 'antd/es/table/interface';
import { SorterResult } from 'antd/es/table/interface';
import { useDocumentTitle } from '@/hooks/useDoumentTItle';

const ProjectList: React.FC = () => {
  const { t } = useTranslation('all-project-list');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useDocumentTitle('Projects')

  const { loading, projects } = useAppSelector(state => state.projectsReducer);

  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [sorter, setSorter] = useState({
    order: localStorage.getItem(PROJECT_SORT_ORDER) ?? 'ascend',
    columnKey: localStorage.getItem(PROJECT_SORT_FIELD) ?? 'name',
  });
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filters = Object.values(IProjectFilter);

  const getFilterIndex = () => {
    return +(localStorage.getItem(FILTER_INDEX_KEY) || 0);
  };

  const setFilterIndex = (index: number) => {
    localStorage.setItem(FILTER_INDEX_KEY, index.toString());
  };

  const setSortingValues = (sorter: { columnKey: string; order: string }) => {
    localStorage.setItem(PROJECT_SORT_FIELD, sorter.columnKey);
    localStorage.setItem(PROJECT_SORT_ORDER, sorter.order);
  };

  useEffect(() => {
    setSortingValues(sorter);
    getProjects();
  }, [searchTerm, selectedStatus, selectedCategory, pagination, sorter]); 
  
  // Handle pagination and sorting separately
  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<IProjectViewModel> | SorterResult<IProjectViewModel>[]
  ) => {
    if (filters?.status_id) {
      setSelectedStatus(filters.status_id.join('+'));
    }
    if (filters?.category_id) {
      setSelectedCategory(filters.category_id.join('+'));
    }
    
    const newSorter = {
      order: (Array.isArray(sorter) ? sorter[0].order : sorter.order) ?? 'ascend',
      columnKey: ((Array.isArray(sorter) ? sorter[0].columnKey : sorter.columnKey) as string) ?? 'name',
    };
    
    setPagination({
      current: pagination.current || 1,
      pageSize: pagination.pageSize || DEFAULT_PAGE_SIZE,
    });
    
    setSorter(newSorter);
  };

  const getProjects = async () => {
    try {
      const params = {
        index: pagination.current,
        size: pagination.pageSize,
        field: sorter.columnKey,
        order: sorter.order,
        filter: getFilterIndex(),
        search: searchTerm,
        statuses: selectedStatus,
        categories: selectedCategory,
      };
      await dispatch(fetchProjects(params)).unwrap();
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleRefresh = () => {
    getProjects();
  };

  const handleSegmentChange = (value: IProjectFilter) => {
    setFilterIndex(filters.indexOf(value));
    getProjects();
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
                onClick={() => handleRefresh()}
              />
            </Tooltip>
            <Segmented<IProjectFilter>
              options={filters}
              defaultValue={filters[getFilterIndex()] ?? filters[0]}
              onChange={(value: IProjectFilter) => handleSegmentChange(value)}
            />
            <Input
              placeholder={t('placeholder')}
              suffix={<SearchOutlined />}
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <CreateProjectButton />
          </Flex>
        }
      />
      <Card className="project-card">
        <Table<IProjectViewModel>
          columns={TableColumns(navigate)}
          dataSource={projects.data}
          rowKey={record => record.id || ''}
          loading={loading}
          size="small"
          onChange={handleTableChange}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            showSizeChanger: true,
            defaultPageSize: DEFAULT_PAGE_SIZE,
            pageSizeOptions: PAGE_SIZE_OPTIONS,
            size: 'small',
            total: projects.total,
          }}
        />
      </Card>

      <ProjectDrawer />
    </div>
  );
};

export default ProjectList;
