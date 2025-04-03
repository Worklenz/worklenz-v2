import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { IRPTOverviewProjectInfo } from '@/types/reporting/reporting.types';
import { reportingProjectsApiService } from '@/api/reporting/reporting-projects.api.service';
import ProjectReportsStatCard from './ProjectReportsStatCard';
import ProjectReportsStatusGraph from './ProjectReportsStatusGraph';
import ProjectReportsPriorityGraph from './ProjectReportsPriorityGraph';
import ProjectReportsDueDateGraph from './ProjectReportsDueDateGraph';
import logger from '@/utils/errorLogger';
import useOptimizedSelector from '@/hooks/useOptimizedSelector';

type ProjectReportsOverviewTabProps = { projectId: string | null };

// Use React.memo to prevent unnecessary re-renders
const ProjectReportsOverviewTab = React.memo(({ projectId = null }: ProjectReportsOverviewTabProps) => {
  const [overviewData, setOverviewData] = useState<IRPTOverviewProjectInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Use useCallback to prevent recreation of this function on each render
  const fetchOverviewData = useCallback(async () => {
    if (!projectId || loading) return;

    try {
      setLoading(true);
      const res = await reportingProjectsApiService.getProjectOverview(projectId);
      if (res.done) {
        setOverviewData(res.body);
      }
    } catch (error) {
      logger.error('Error fetching project overview data', error);
    } finally {
      setLoading(false);
    }
  }, [projectId, loading]);

  // Effect to fetch data when projectId changes
  useEffect(() => {
    fetchOverviewData();
  }, [fetchOverviewData]);

  // Memoize the default values to prevent recreation on each render
  const defaultStats = useMemo(() => ({
    completed: 0,
    incompleted: 0,
    overdue: 0,
    total_allocated: 0,
    total_logged: 0,
  }), []);

  const defaultStatusValues = useMemo(() => ({
    todo: 0,
    doing: 0,
    done: 0,
    all: 0,
    chart: [],
  }), []);

  const defaultPriorityValues = useMemo(() => ({
    high: 0,
    medium: 0,
    low: 0,
    all: 0,
    chart: [],
  }), []);

  const defaultDueValues = useMemo(() => ({
    completed: 0,
    upcoming: 0,
    overdue: 0,
    no_due: 0,
    all: 0,
    chart: [],
  }), []);

  // Memoize the values to pass to child components
  const statsValues = useMemo(() => overviewData?.stats || defaultStats, [overviewData, defaultStats]);
  const statusValues = useMemo(() => overviewData?.by_status || defaultStatusValues, [overviewData, defaultStatusValues]);
  const priorityValues = useMemo(() => overviewData?.by_priority || defaultPriorityValues, [overviewData, defaultPriorityValues]);
  const dueValues = useMemo(() => overviewData?.by_due || defaultDueValues, [overviewData, defaultDueValues]);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <ProjectReportsStatCard
        loading={loading}
        values={statsValues}
      />
      <ProjectReportsStatusGraph
        loading={loading}
        values={statusValues}
      />
      <ProjectReportsPriorityGraph
        loading={loading}
        values={priorityValues}
      />
      <ProjectReportsDueDateGraph
        loading={loading}
        values={dueValues}
      />
    </div>
  );
});

export default ProjectReportsOverviewTab;
