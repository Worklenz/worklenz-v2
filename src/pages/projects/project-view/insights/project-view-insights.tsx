import { DownloadOutlined } from '@ant-design/icons';
import { Badge, Button, Checkbox, Flex, Segmented } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { colors } from '@/styles/colors';
import InsightsMembers from './insights-members/insights-members';
import InsightsOverview from './insights-overview/insights-overview';
import InsightsTasks from './insights-tasks/insights-tasks';
import {
  setActiveSegment,
  setIncludeArchivedTasks,
  setProjectId,
} from '@/features/projects/insights/project-insights.slice';

type SegmentType = 'Overview' | 'Members' | 'Tasks';

const ProjectViewInsights = () => {
  const { projectId } = useParams();
  const { t } = useTranslation('project-view-insights');
  const themeMode = useAppSelector(state => state.themeReducer.mode);
  const dispatch = useAppDispatch();

  const [exportLoading, setExportLoading] = useState(false);
  const { activeSegment, includeArchivedTasks } = useAppSelector(
    state => state.projectInsightsReducer
  );

  const handleSegmentChange = (value: SegmentType) => {
    dispatch(setActiveSegment(value));
  };

  const toggleArchivedTasks = () => {
    dispatch(setIncludeArchivedTasks(!includeArchivedTasks));
  };

  useEffect(() => {
    if (projectId) {
      dispatch(setProjectId(projectId));
    }
  }, [projectId]);

  const renderSegmentContent = () => {
    if (!projectId) return null;

    switch (activeSegment) {
      case 'Overview':
        return <InsightsOverview t={t} />;
      case 'Members':
        return <InsightsMembers t={t} />;
      case 'Tasks':
        return <InsightsTasks t={t} />;
    }
  };

  const handleExport = async () => {
    if (!projectId) return;

    setExportLoading(true);
    try {
      await dispatch(setActiveSegment(activeSegment));
    } catch (error) {
      // Error handling could be added here
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <Flex vertical gap={24}>
      <Flex align="center" justify="space-between">
        <Segmented
          options={['Overview', 'Members', 'Tasks']}
          defaultValue={activeSegment}
          onChange={handleSegmentChange}
        />

        <Flex gap={8}>
          <Flex
            gap={8}
            align="center"
            style={{
              backgroundColor: themeMode === 'dark' ? '#141414' : '#f5f5f5',
              padding: '6px 15px',
              borderRadius: 4,
            }}
          >
            <Checkbox checked={includeArchivedTasks} onClick={toggleArchivedTasks} />
            <Badge color={includeArchivedTasks ? colors.limeGreen : colors.vibrantOrange} dot>
              {t('common.includeArchivedTasks')}
            </Badge>
          </Flex>

          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExport}
            loading={exportLoading}
          >
            {t('common.export')}
          </Button>
        </Flex>
      </Flex>

      {renderSegmentContent()}
    </Flex>
  );
};

export default ProjectViewInsights;
