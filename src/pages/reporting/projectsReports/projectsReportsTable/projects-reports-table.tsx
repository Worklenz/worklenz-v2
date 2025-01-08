import React, { memo, useState } from 'react';
import { Button, ConfigProvider, Flex, PaginationProps, Table, TableColumnsType } from 'antd';
import { useAppSelector } from '@/hooks/useAppSelector';
import './project-report-table.css';
import ProjectCell from '@/pages/reporting/projectsReports/projectsReportsTable/tableCells/project-cell/project-cell';
import EstimatedVsActualCell from '@/pages/reporting/projectsReports/projectsReportsTable/tableCells/estimated-vs-actual-cell/estimated-vs-actual-cell';
import TasksProgressCell from '@/pages/reporting/projectsReports/projectsReportsTable/tableCells/tasks-progress-cell/tasks-progress-cell';
import LastActivityCell from '@/pages/reporting/projectsReports/projectsReportsTable/tableCells/last-activity-cell/last-activity-cell';
import ProjectStatusCell from '@/pages/reporting/projectsReports/projectsReportsTable/tableCells/project-status-cell/project-status-cell';
import ProjectClientCell from '@/pages/reporting/projectsReports/projectsReportsTable/tableCells/project-client-cell/project-client-cell';
import ProjectTeamCell from '@/pages/reporting/projectsReports/projectsReportsTable/tableCells/project-team-cell/project-team-cell';
import ProjectManagerCell from '@/pages/reporting/projectsReports/projectsReportsTable/tableCells/project-manager-cell/project-manager-cell';
import ProjectDatesCell from '@/pages/reporting/projectsReports/projectsReportsTable/tableCells/project-dates-cell/project-dates-cell';
import ProjectHealthCell from '@/pages/reporting/projectsReports/projectsReportsTable/tableCells/project-health-cell/project-health-cell';
import ProjectCategoryCell from '@/pages/reporting/projectsReports/projectsReportsTable/tableCells/project-category-cell/project-category-cell';
import ProjectDaysLeftAndOverdueCell from '@/pages/reporting/projectsReports/projectsReportsTable/tableCells/project-days-left-and-overdue-cell/project-days-left-and-overdue-cell';
import ProjectUpdateCell from '@/pages/reporting/projectsReports/projectsReportsTable/tableCells/project-update-cell/project-update-cell';
import ProjectReportsDrawer from '@features/reporting/projectReports/projectReportsDrawer/ProjectReportsDrawer';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { toggleProjectReportsDrawer } from '@features/reporting/projectReports/projectReportsSlice';
import { ExpandAltOutlined } from '@ant-design/icons';
import { colors } from '@/styles/colors';
import CustomTableTitle from '@/components/CustomTableTitle';
import { useTranslation } from 'react-i18next';

type ProjectReportsTableProps = {
  projectList: any[];
  loading: boolean;
  pagination: PaginationProps;
  setPagination: (pagination: PaginationProps) => void;
};

const ProjectsReportsTable = ({
  projectList,
  loading = false,
  pagination,
  setPagination,
}: ProjectReportsTableProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // localization
  const { t } = useTranslation('reporting-projects');

  const dispatch = useAppDispatch();

  const columnsVisibility = useAppSelector(
    (state) => state.projectReportsTableColumnsReducer,
  );

  // function to handle drawer toggle
  const handleDrawerOpen = (id: string) => {
    setSelectedId(id);
    dispatch(toggleProjectReportsDrawer());
  };

  const columns: TableColumnsType = [
    {
      key: 'project',
      title: <CustomTableTitle title={t('projectColumn')} />,
      width: 300,
      onCell: (record) => {
        return {
          onClick: () => handleDrawerOpen(record.id),
        };
      },
      render: (record) => (
        <Flex gap={16} align="center" justify="space-between">
          <ProjectCell
            projectId={record.id}
            project={record.name}
            projectColor={record.color_code}
          />

          {/* used tailwind class to display this button only if hover the row  */}
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
      sorter: (a, b) => a.name.localeCompare(b.name),
      fixed: 'left' as const,
    },
    {
      key: 'estimatedVsActual',
      title: <CustomTableTitle title={t('estimatedVsActualColumn')} />,
      render: (record) => (
        <EstimatedVsActualCell
          actualTime={record.actual_time}
          actualTimeString={record.actual_time_string}
          estimatedTime={record.estimated_time}
          estimatedTimeString={record.estimated_time_string}
        />
      ),
      width: 230,
    },
    {
      key: 'tasksProgress',
      title: <CustomTableTitle title={t('tasksProgressColumn')} />,
      render: (record) => <TasksProgressCell tasksStat={record.tasks_stat} />,
      width: 200,
    },
    {
      key: 'lastActivity',
      title: <CustomTableTitle title={t('lastActivityColumn')} />,
      render: (record) => (
        <LastActivityCell
          activity={record.last_activity?.last_activity_string}
        />
      ),
      width: 200,
    },
    {
      key: 'status',
      title: <CustomTableTitle title={t('statusColumn')} />,
      render: (record) => <ProjectStatusCell status={record.status_name} />,
      sorter: (a, b) => a.status_name.localeCompare(b.status_name),
      width: 200,
    },
    {
      key: 'dates',
      title: <CustomTableTitle title={t('datesColumn')} />,
      render: (record) => (
        <ProjectDatesCell
          startDate={record.start_date}
          endDate={record.end_date}
        />
      ),
      width: 275,
    },
    {
      key: 'daysLeft',
      title: <CustomTableTitle title={t('daysLeftColumn')} />,
      render: (record) => (
        <ProjectDaysLeftAndOverdueCell daysLeft={record.days_left} />
      ),
      width: 200,
    },
    {
      key: 'projectHealth',
      title: <CustomTableTitle title={t('projectHealthColumn')} />,
      render: (record) => <ProjectHealthCell />,
      width: 200,
    },
    {
      key: 'category',
      title: <CustomTableTitle title="Category" />,
      render: (record) => (
        <ProjectCategoryCell
          categoryId={record.category_id}
          categoryName={record.category_name}
          categoryColor={record.category_color}
        />
      ),
      width: 200,
    },
    {
      key: 'projectUpdate',
      title: <CustomTableTitle title={t('projectUpdateColumn')} />,
      render: (record) => <ProjectUpdateCell updates={record.update} />,
      width: 200,
    },
    {
      key: 'client',
      title: <CustomTableTitle title={t('clientColumn')} />,
      render: (record) => <ProjectClientCell client={record.client} />,
      sorter: (a, b) => a.client.localeCompare(b.client),
      width: 200,
    },
    {
      key: 'team',
      title: <CustomTableTitle title={t('teamColumn')} />,
      render: (record) => <ProjectTeamCell team={record.team_name} />,
      sorter: (a, b) => a.team_name.localeCompare(b.team_name),
      width: 200,
    },
    {
      key: 'projectManager',
      title: <CustomTableTitle title={t('projectManagerColumn')} />,
      render: (record) => (
        <ProjectManagerCell manager={record.project_manager} />
      ),
      width: 200,
    },
  ];

  // filter columns based on the `hidden` state from Redux
  const visibleColumns = columns.filter(
    (col) => columnsVisibility[col.key as string],
  );

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
        pagination={{ showSizeChanger: true, defaultPageSize: 10 }}
        scroll={{ x: 'max-content' }}
        loading={loading}
        onRow={(record) => {
          return {
            style: { height: 56, cursor: 'pointer' },
            className: 'group even:bg-[#4e4e4e10]',
          };
        }}
      />

      <ProjectReportsDrawer projectId={selectedId} />
    </ConfigProvider>
  );
};

export default memo(ProjectsReportsTable);
