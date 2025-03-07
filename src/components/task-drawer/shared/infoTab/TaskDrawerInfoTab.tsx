import { Button, Collapse, CollapseProps, Flex, Skeleton, Tooltip, Typography, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { LoadingOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import DescriptionEditor from './DescriptionEditor';
import SubTaskTable from './SubTaskTable';
import DependenciesTable from './DependenciesTable';
import { useAppSelector } from '@/hooks/useAppSelector';
import TaskDetailsForm from './TaskDetailsForm';
import InfoTabFooter from './InfoTabFooter';
import { fetchTask } from '@/features/tasks/tasks.slice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { TFunction } from 'i18next';

interface TaskDrawerInfoTabProps {
  t: TFunction;
}

const TaskDrawerInfoTab = ({ t }: TaskDrawerInfoTabProps) => {
  const dispatch = useAppDispatch();
  const [refreshSubTask, setRefreshSubTask] = useState<boolean>(false);

  const { projectId } = useAppSelector(state => state.projectReducer);
  const { taskFormViewModel, loadingTask, selectedTaskId } = useAppSelector(
    state => state.taskDrawerReducer
  );

  const handleRefresh = () => {
    setRefreshSubTask(true);
    setTimeout(() => setRefreshSubTask(false), 500);
  };

  const fetchTaskData = () => {
    if (!loadingTask && selectedTaskId && projectId) {
      dispatch(fetchTask({ taskId: selectedTaskId, projectId }));
    }
  };

  const panelStyle: React.CSSProperties = {
    border: 'none',
    paddingBlock: 0,
  };

  const infoItems: CollapseProps['items'] = [
    {
      key: 'details',
      label: <Typography.Text strong>{t('taskInfoTab.details.title')}</Typography.Text>,
      children: <TaskDetailsForm taskFormViewModel={taskFormViewModel} />,
      style: panelStyle,
      className: 'custom-task-drawer-info-collapse',
    },
    {
      key: 'description',
      label: <Typography.Text strong>{t('taskInfoTab.description.title')}</Typography.Text>,
      children: (
        <DescriptionEditor
          description={taskFormViewModel?.task?.description || null}
          taskId={taskFormViewModel?.task?.id || ''}
          parentTaskId={taskFormViewModel?.task?.parent_task_id || ''}
        />
      ),
      style: panelStyle,
      className: 'custom-task-drawer-info-collapse',
    },
    {
      key: 'subTasks',
      label: <Typography.Text strong>{t('taskInfoTab.subTasks.title')}</Typography.Text>,
      extra: (
        <Tooltip title={t('taskInfoTab.subTasks.refreshSubTasks')} trigger={'hover'}>
          <Button
            shape="circle"
            icon={<ReloadOutlined spin={refreshSubTask} />}
            onClick={handleRefresh}
          />
        </Tooltip>
      ),
      children: <SubTaskTable datasource={taskFormViewModel?.task?.sub_tasks} />,
      style: panelStyle,
      className: 'custom-task-drawer-info-collapse',
    },
    {
      key: 'dependencies',
      label: <Typography.Text strong>{t('taskInfoTab.dependencies.title')}</Typography.Text>,
      children: <DependenciesTable />,
      style: panelStyle,
      className: 'custom-task-drawer-info-collapse',
    },
    {
      key: 'attachments',
      label: <Typography.Text strong>{t('taskInfoTab.attachments.title')}</Typography.Text>,
      children: (
        <Upload
          name="attachment"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
        >
          <button style={{ border: 0, background: 'none' }} type="button">
            <Flex vertical align="center" gap={4}>
              {loadingTask ? <LoadingOutlined /> : <PlusOutlined />}
              <Typography.Text style={{ fontSize: 12 }}>
                {t('taskInfoTab.attachments.chooseOrDropFileToUpload')}
              </Typography.Text>
            </Flex>
          </button>
        </Upload>
      ),
      style: panelStyle,
      className: 'custom-task-drawer-info-collapse',
    },
    {
      key: 'comments',
      label: <Typography.Text strong>{t('taskInfoTab.comments.title')}</Typography.Text>,
      style: panelStyle,
      className: 'custom-task-drawer-info-collapse',
    },
  ];

  useEffect(() => {
    fetchTaskData();
  }, [selectedTaskId, projectId]);

  return (
    <Skeleton active loading={loadingTask}>
      <Flex vertical justify="space-between" style={{ height: '78vh' }}>
        <Collapse
          items={infoItems}
          bordered={false}
          style={{ maxHeight: 600, overflow: 'auto' }}
          defaultActiveKey={[
            'details',
            'description',
            'subTasks',
            'dependencies',
            'attachments',
            'comments',
          ]}
        />
        <InfoTabFooter />
      </Flex>
    </Skeleton>
  );
};

export default TaskDrawerInfoTab;
