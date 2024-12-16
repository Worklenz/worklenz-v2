import {
  Button,
  Card,
  Popconfirm,
  Table,
  TableProps,
  Tooltip,
  Typography,
} from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNowStrict } from 'date-fns';
import jsonData from './TaskTemplates.json';
import './TaskTemplatesSettings.css';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setSelectedTemplate, toggleTaskTemplateDrawer } from '../../../features/settings/taskTemplates/taskTemplateSlice';
import TaskTemplateDrawer from '../../../features/settings/taskTemplates/TaskTemplateDrawer';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useDocumentTitle } from '../../../hooks/useDoumentTItle';

const TaskTemplatesSettings = () => {
  // localization
  const { t } = useTranslation('settings-task-templates');
  const dispatch = useAppDispatch()
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  useDocumentTitle('Task Templates');

  // table columns
  const columns: TableProps['columns'] = [
    {
      key: 'name',
      title: t('nameColumn'),
      dataIndex: 'name',
    },
    {
      key: 'created',
      title: t('createdColumn'),
      dataIndex: 'created_at',
      render: (date: string) =>
        formatDistanceToNowStrict(new Date(date), { addSuffix: true }),
    },
    {
      key: 'button',
      render: (record) => (
        <div
          style={{ display: 'flex', gap: '10px', justifyContent: 'right' }}
          className="button-visibilty"
        >
          <Tooltip title={t('editToolTip')}>
            <Button size="small" onClick={() => handleOnClick(record.id)}>
              <EditOutlined />
            </Button>
          </Tooltip>
          <Tooltip title={t('deleteToolTip')}>
            <Popconfirm
              title={
                <Typography.Text style={{ fontWeight: 400 }}>
                  {t('confirmText')}
                </Typography.Text>
              }
              okText={t('okText')}
              cancelText={t('cancelText')}
            >
              <Button size="small">
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleOnClick = (id: string) => {
    dispatch(setSelectedTemplate(id))
    dispatch(toggleTaskTemplateDrawer())
  }

  return (
    <Card style={{ width: '100%' }}>
      <Table
        size="small"
        pagination={{ size: 'small' }}
        columns={columns}
        dataSource={jsonData}
        rowKey="id"
        rowClassName={(_, index) =>
          `no-border-row ${index % 2 === 0 ? '' : themeMode === 'dark' ? 'dark-alternate-row-color' : 'alternate-row-color'}`
        }
      />
      <TaskTemplateDrawer />
    </Card>
  );
};

export default TaskTemplatesSettings;
