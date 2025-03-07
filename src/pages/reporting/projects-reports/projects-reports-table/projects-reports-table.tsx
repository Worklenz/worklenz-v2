import { useEffect, useState } from 'react';
import { Button, ConfigProvider, Flex, PaginationProps, Table, TableColumnsType } from 'antd';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import { ExpandAltOutlined } from '@ant-design/icons';

import { useAppSelector } from '@/hooks/useAppSelector';
import ProjectCell from '@/pages/reporting/projects-reports/projects-reports-table/table-cells/project-cell/project-cell';
import EstimatedVsActualCell from '@/pages/reporting/projects-reports/projects-reports-table/table-cells/estimated-vs-actual-cell/estimated-vs-actual-cell';
import TasksProgressCell from '@/pages/reporting/projects-reports/projects-reports-table/table-cells/tasks-progress-cell/tasks-progress-cell';
import LastActivityCell from '@/pages/reporting/projects-reports/projects-reports-table/table-cells/last-activity-cell/last-activity-cell';
import ProjectStatusCell from '@/pages/reporting/projects-reports/projects-reports-table/table-cells/project-status-cell/project-status-cell';
import ProjectClientCell from '@/pages/reporting/projects-reports/projects-reports-table/table-cells/project-client-cell/project-client-cell';
import ProjectTeamCell from '@/pages/reporting/projects-reports/projects-reports-table/table-cells/project-team-cell/project-team-cell';
import ProjectManagerCell from '@/pages/reporting/projects-reports/projects-reports-table/table-cells/project-manager-cell/project-manager-cell';
import ProjectDatesCell from '@/pages/reporting/projects-reports/projects-reports-table/table-cells/project-dates-cell/project-dates-cell';
import ProjectHealthCell from '@/pages/reporting/projects-reports/projects-reports-table/table-cells/project-health-cell/project-health-cell';
import ProjectCategoryCell from '@/pages/reporting/projects-reports/projects-reports-table/table-cells/project-category-cell/project-category-cell';
import ProjectDaysLeftAndOverdueCell from '@/pages/reporting/projects-reports/projects-reports-table/table-cells/project-days-left-and-overdue-cell/project-days-left-and-overdue-cell';
import ProjectUpdateCell from '@/pages/reporting/projects-reports/projects-reports-table/table-cells/project-update-cell/project-update-cell';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import {
  fetchProjectData,
  setIndex,
  setPageSize,
  toggleProjectReportsDrawer,
} from '@/features/reporting/projectReports/project-reports-slice';
import { colors } from '@/styles/colors';
import CustomTableTitle from '@/components/CustomTableTitle';
import { IRPTProject } from '@/types/reporting/reporting.types';
import ProjectReportsDrawer from '@/features/reporting/projectReports/projectReportsDrawer/ProjectReportsDrawer';
import { PAGE_SIZE_OPTIONS } from '@/shared/constants';
import './project-report-table.css';

const ProjectsReportsTable = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('reporting-projects');

  const [selectedProject, setSelectedProject] = useState<IRPTProject | null>(null);
  const { projectList, isLoading, total, index, pageSize } = useAppSelector(
    state => state.projectReportsReducer
  );
  const {
    searchQuery,
    selectedProjectStatuses,
    selectedProjectHealths,
    selectedProjectCategories,
    selectedProjectManagers,
    archived,
  } = useAppSelector(state => state.projectReportsReducer);

  const columnsVisibility = useAppSelector(state => state.projectReportsTableColumnsReducer);

  const handleDrawerOpen = (record: IRPTProject) => {
    setSelectedProject(record);
    dispatch(toggleProjectReportsDrawer());
  };

  const columns: TableColumnsType = [
    {
      key: 'name',
      title: <CustomTableTitle title={t('projectColumn')} />,
      width: 300,
      onCell: record => {
        return {
          onClick: () => handleDrawerOpen(record),
        };
      },
      render: record => (
        <Flex gap={16} align="center" justify="space-between">
          <ProjectCell
            projectId={record.id}
            project={record.name}
            projectColor={record.color_code}
          />

          <Button
            className="hidden group-hover:flex"
            type="text"
            style={{
              backgroundColor: colors.transparent,
              padding: 0,
              height: 22,
              alignItems: 'center',
              gap: 8,
            }}
          >
            {t('openButton')} <ExpandAltOutlined />
          </Button>
        </Flex>
      ),
      sorter: true,
      fixed: 'left' as const,
    },
    {
      key: 'estimatedVsActual',
      title: <CustomTableTitle title={t('estimatedVsActualColumn')} />,
      render: record => (
        <EstimatedVsActualCell
          actualTime={record.actual_time || 0}
          actualTimeString={record.actual_time_string}
          estimatedTime={record.estimated_time * 60 || 0}
          estimatedTimeString={record.estimated_time_string}
        />
      ),
      width: 230,
    },
    {
      key: 'tasksProgress',
      title: <CustomTableTitle title={t('tasksProgressColumn')} />,
      render: record => <TasksProgressCell tasksStat={record.tasks_stat} />,
      width: 200,
    },
    {
      key: 'lastActivity',
      title: <CustomTableTitle title={t('lastActivityColumn')} />,
      render: record => <LastActivityCell activity={record.last_activity?.last_activity_string} />,
      width: 200,
    },
    {
      key: 'status',
      title: <CustomTableTitle title={t('statusColumn')} />,
      render: record => (
        <ProjectStatusCell currentStatus={record.status_id} projectId={record.id} />
      ),
      width: 200,
    },
    {
      key: 'dates',
      title: <CustomTableTitle title={t('datesColumn')} />,
      render: record => (
        <ProjectDatesCell
          projectId={record.id}
          startDate={record.start_date}
          endDate={record.end_date}
        />
      ),
      width: 275,
    },
    {
      key: 'daysLeft',
      title: <CustomTableTitle title={t('daysLeftColumn')} />,
      render: record => <ProjectDaysLeftAndOverdueCell daysLeft={record.days_left} />,
      width: 200,
    },
    {
      key: 'projectHealth',
      title: <CustomTableTitle title={t('projectHealthColumn')} />,
      render: (record: IRPTProject) => (
        <ProjectHealthCell
          value={record.project_health}
          label={record.health_name}
          color={record.health_color}
          projectId={record.id}
        />
      ),
      width: 200,
    },
    {
      key: 'category',
      title: <CustomTableTitle title="Category" />,
      render: (record: IRPTProject) => (
        <ProjectCategoryCell
          id={record.category_id || ''}
          name={record.category_name || ''}
          color_code={record.category_color || ''}
        />
      ),
      width: 200,
    },
    {
      key: 'projectUpdate',
      title: <CustomTableTitle title={t('projectUpdateColumn')} />,
      render: record => <ProjectUpdateCell updates={record.update} />,
      width: 200,
    },
    {
      key: 'client',
      title: <CustomTableTitle title={t('clientColumn')} />,
      render: record => <ProjectClientCell client={record.client} />,
      sorter: (a, b) => a.client.localeCompare(b.client),
      width: 200,
    },
    {
      key: 'team',
      title: <CustomTableTitle title={t('teamColumn')} />,
      render: record => <ProjectTeamCell team={record.team_name} />,
      sorter: (a, b) => a.team_name.localeCompare(b.team_name),
      width: 200,
    },
    {
      key: 'projectManager',
      title: <CustomTableTitle title={t('projectManagerColumn')} />,
      render: record => <ProjectManagerCell manager={record.project_manager} />,
      width: 200,
    },
  ];

  // filter columns based on the `hidden` state from Redux
  const visibleColumns = columns.filter(col => columnsVisibility[col.key as string]);

  const handleTableChange = (pagination: PaginationProps, filters: any, sorter: any) => {
    dispatch(setIndex(pagination.current));
    dispatch(setPageSize(pagination.pageSize));
  };

  useEffect(() => {
    if (!isLoading) dispatch(fetchProjectData());
  }, [
    searchQuery,
    selectedProjectStatuses,
    selectedProjectHealths,
    selectedProjectCategories,
    selectedProjectManagers,
    archived,
    index,
    pageSize,
  ]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            cellPaddingBlock: 12,
            cellPaddingInline: 10,
          },
        },
      }}
    >
      <Table
        columns={visibleColumns}
        dataSource={projectList}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 10,
          total: total,
          current: index,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
        }}
        scroll={{ x: 'max-content' }}
        loading={isLoading}
        onChange={handleTableChange}
        onRow={record => {
          return {
            style: { height: 56, cursor: 'pointer' },
            className: 'group even:bg-[#4e4e4e10]',
          };
        }}
      />
      {createPortal(<ProjectReportsDrawer selectedProject={selectedProject} />, document.body)}
    </ConfigProvider>
  );
};

export default ProjectsReportsTable;
