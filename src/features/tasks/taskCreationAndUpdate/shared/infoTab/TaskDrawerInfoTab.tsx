import {
  Button,
  Collapse,
  CollapseProps,
  Flex,
  Tooltip,
  Typography,
  Upload,
} from 'antd';
import React, { useState } from 'react';
import {
  LoadingOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import DescriptionEditor from './text-editor/description-editor';
import SubTaskTable from './SubTaskTable';
import DependenciesTable from './DependenciesTable';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import TaskDetailsForm from './TaskDetailsForm';
import InfoTabFooter from './InfoTabFooter';

const TaskDrawerInfoTab = ({ taskId = null }: { taskId: string | null }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshSubTask, setRefreshSubTask] = useState<boolean>(false);

  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  // get currently selected task if exist
  const selectedTask = useAppSelector((state) => state.taskReducer.tasks).find(
    (task) => task.taskId === taskId
  );

  // function for handle refresh
  const handleRefresh = () => {
    setRefreshSubTask(true);
    setTimeout(() => setRefreshSubTask(false), 500);
  };

  // collapase panel styles
  const panelStyle: React.CSSProperties = {
    border: 'none',
    paddingBlock: 0,
  };

  const infoItems: CollapseProps['items'] = [
    {
      key: 'details',
      label: <Typography.Text strong>Details</Typography.Text>,
      children: <TaskDetailsForm selectedTask={selectedTask || null} />,
      style: panelStyle,
      className: 'custom-task-drawer-info-collapse',
    },
    {
      key: 'description',
      label: <Typography.Text strong>Description</Typography.Text>,
      children: (
        <DescriptionEditor description={selectedTask?.description || null} />
      ),
      style: panelStyle,
      className: 'custom-task-drawer-info-collapse',
    },
    {
      key: 'subTasks',
      label: <Typography.Text strong>Sub Tasks</Typography.Text>,
      extra: (
        <Tooltip title={'Refresh project'} trigger={'hover'}>
          <Button
            shape="circle"
            icon={<ReloadOutlined spin={refreshSubTask} />}
            onClick={() => handleRefresh()}
          />
        </Tooltip>
      ),
      children: <SubTaskTable datasource={selectedTask?.subTasks || null} />,
      style: panelStyle,
      className: 'custom-task-drawer-info-collapse',
    },
    {
      key: 'dependencies',
      label: <Typography.Text strong>Dependencies</Typography.Text>,
      children: <DependenciesTable />,
      style: panelStyle,
      className: 'custom-task-drawer-info-collapse',
    },
    {
      key: 'attachments',
      label: <Typography.Text strong>Attachments (0)</Typography.Text>,
      children: (
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
        >
          <button style={{ border: 0, background: 'none' }} type="button">
            <Flex vertical align="center" gap={4}>
              {loading ? <LoadingOutlined /> : <PlusOutlined />}
              <Typography.Text style={{ fontSize: 12 }}>
                Choose or drop file to upload
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
      label: <Typography.Text strong>Comments</Typography.Text>,
      style: panelStyle,
      className: 'custom-task-drawer-info-collapse',
    },
  ];

  return (
    <Flex vertical justify="space-between" style={{ height: '78vh' }}>
      <Collapse
        items={infoItems}
        bordered={false}
        style={{
          maxHeight: 600,
          overflow: 'auto',
          backgroundColor: themeMode === 'dark' ? 'transparent' : 'white',
        }}
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
  );
};

export default TaskDrawerInfoTab;
