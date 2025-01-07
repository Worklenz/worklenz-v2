import { AppDispatch } from '@/app/store';
import { toggleArchiveProjectForAll, toggleArchiveProject } from '@/features/projects/projectsSlice';
import { IProjectViewModel } from '@/types/project/projectViewModel.types';
import logger from '@/utils/errorLogger';
import { SettingOutlined, InboxOutlined } from '@ant-design/icons';
import { Tooltip, Button, Popconfirm, Space } from 'antd';

interface ActionButtonsProps {
  t: (key: string) => string;
  record: IProjectViewModel;
  setProjectId: (id: string) => void;
  dispatch: AppDispatch;
  isOwnerOrAdmin: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  t,
  record,
  setProjectId,
  dispatch,
  isOwnerOrAdmin,
}) => {
  const handleSettingsClick = () => {
    if (record.id) {
      setProjectId(record.id);
    }
  };

  const handleArchiveClick = async () => {
    if (!record.id) return;
    try {
      if (isOwnerOrAdmin) {
        await dispatch(toggleArchiveProjectForAll(record.id));
      } else {
        await dispatch(toggleArchiveProject(record.id));
      }
    } catch (error) {
      logger.error('Failed to archive project:', error);
    }
  };

  return (
    <Space>
      <Tooltip title={t('setting')}>
        <Button
          className="action-button"
          size="small"
          onClick={handleSettingsClick}
          icon={<SettingOutlined />}
        />
      </Tooltip>
      <Tooltip title={record.archived ? t('unarchive') : t('archive')}>
        <Popconfirm
          title={record.archived ? t('unarchive') : t('archive')}
          description={record.archived ? t('unarchiveConfirm') : t('archiveConfirm')}
          onConfirm={handleArchiveClick}
          okText={t('yes')}
          cancelText={t('no')}
        >
          <Button className="action-button" size="small" icon={<InboxOutlined />} />
        </Popconfirm>
      </Tooltip>
    </Space>
  );
};
