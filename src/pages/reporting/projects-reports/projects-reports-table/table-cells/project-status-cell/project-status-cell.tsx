import { ConfigProvider, Select, Typography } from 'antd';
import { colors } from '@/styles/colors';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/hooks/useAppSelector';
import { getStatusIcon } from '@/utils/projectUtils';
import { useEffect } from 'react';
import { useSocket } from '@/socket/socketContext';
import { SocketEvents } from '@/shared/socket-events';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setProjectStatus } from '@/features/reporting/projectReports/project-reports-slice';
import logger from '@/utils/errorLogger';

interface ProjectStatusCellProps {
  currentStatus: string;
  projectId: string;
}

const ProjectStatusCell = ({ currentStatus, projectId }: ProjectStatusCellProps) => {
  const { t } = useTranslation('reporting-projects');
  const dispatch = useAppDispatch();
  const { socket } = useSocket();
  const { projectStatuses } = useAppSelector(state => state.projectStatusesReducer);

  const statusOptions = [
    ...projectStatuses.map((status, index) => ({
      key: index,
      value: status.id,
      label: (
        <Typography.Text
          style={{ display: 'flex', alignItems: 'center', gap: 4 }}
          className="group-hover:text-[#1890ff]"
        >
          {getStatusIcon(status.icon || '', status.color_code || '')}
          {t(`${status.name}`)}
        </Typography.Text>
      ),
    })),
  ];

  const handleStatusChange = (value: string) => {
    try {
      if (!value || !projectId) {
        throw new Error('Invalid status value or project ID');
      }

      if (!socket) {
        throw new Error('Socket connection not available');
      }

      socket.emit(
        SocketEvents.PROJECT_STATUS_CHANGE.toString(),
        JSON.stringify({
          project_id: projectId,
          status_id: value,
        })
      );
    } catch (error) {
      logger.error('Error changing project status:', error);
    }
  };

  const handleStatusChangeResponse = (data: any) => {
    try {
      if (!data || !data.id) {
        throw new Error('Invalid status change response data');
      }
      dispatch(setProjectStatus(data));
    } catch (error) {
      logger.error('Error handling status change response:', error);
    }
  };

  useEffect(() => {
    if (!socket) {
      logger.warning('Socket connection not available for status updates');
      return;
    }

    socket.on(SocketEvents.PROJECT_STATUS_CHANGE.toString(), handleStatusChangeResponse);

    return () => {
      socket.removeListener(
        SocketEvents.PROJECT_STATUS_CHANGE.toString(),
        handleStatusChangeResponse
      );
    };
  }, [socket]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            selectorBg: colors.transparent,
          },
        },
      }}
    >
      <Select
        variant="borderless"
        options={statusOptions}
        defaultValue={currentStatus}
        onChange={handleStatusChange}
      />
    </ConfigProvider>
  );
};

export default ProjectStatusCell;
