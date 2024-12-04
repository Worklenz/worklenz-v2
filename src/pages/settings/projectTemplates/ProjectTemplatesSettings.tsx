import { Button, Card, Popconfirm, Table, TableProps, Tooltip, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import jsonData from './ProjectTemplates.json';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../../hooks/useDoumentTItle';

const ProjectTemplatesSettings = () => {
  // localization
  const { t } = useTranslation('projectTemplatesSettings');
  const themeMode = useAppSelector((state) => state.themeReducer.mode);
  const navigate = useNavigate()

  useDocumentTitle('Project Templates');

  // table columns
  const columns: TableProps['columns'] = [
    {
      key: 'name',
      title: t('nameColumn'),
      dataIndex: 'name',
    },
    {
      key: 'button',
      render: (record) => (
        <div
          style={{ display: 'flex', gap: '10px', justifyContent: 'right' }}
          className="button-visibilty"
        >
          <Tooltip title={t('editToolTip')}>
            <Button size="small" onClick={() => navigate(`/worklenz/settings/project-templates/edit/${record.id}/${record.name}`)}>
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

  return (
    <Card style={{ width: '100%' }}>
      <Table columns={columns} dataSource={jsonData} size="small" pagination={{ size: 'small' }}  rowClassName={(_, index) =>
          `no-border-row ${index % 2 === 0 ? '' : themeMode === 'dark' ? 'dark-alternate-row-color' : 'alternate-row-color'}`
        } rowKey="id"/>
    </Card>
  );
};

export default ProjectTemplatesSettings;
