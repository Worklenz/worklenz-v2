import { MoreOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Dropdown, List, Space } from 'antd';
import React from 'react';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import { toggleColumnVisibility } from '../../../../../features/projects/singleProject/taskListColumns/taskColumnsSlice';
import { useTranslation } from 'react-i18next';

const ShowFieldsFilterDropdown = () => {
  // localization
  const { t } = useTranslation('task-list-filters');

  const dispatch = useAppDispatch();

  // access the updated columnList with isVisible properties
  const columnList = useAppSelector(
    (state) => state.projectViewTaskListColumnsReducer.columnList
  );

  // remove the task and selector columns as they are fixed
  const visibilityChangableColumnList = columnList.filter(
    (column) =>
      column.key !== 'selector' &&
      column.key !== 'task' &&
      column.key !== 'customColumn'
  );

  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  const showFieldsDropdownContent = (
    <Card
      className="custom-card"
      style={{ height: 300, overflowY: 'scroll' }}
      styles={{ body: { padding: 0 } }}
    >
      <List style={{ padding: 0 }}>
        {visibilityChangableColumnList.map((col) => (
          <List.Item
            key={col.key}
            className={`custom-list-item ${themeMode === 'dark' ? 'dark' : ''}`}
            style={{
              display: 'flex',
              gap: 8,
              padding: '4px 8px',
              border: 'none',
            }}
          >
            <Space>
              <Checkbox
                checked={col.isVisible}
                onClick={() => dispatch(toggleColumnVisibility(col.key))}
              />
              {col.isCustomColumn
                ? col.name
                : t(
                    `${col.key === 'phases' ? 'phasesText' : col.columnHeader + 'Text'}`
                  )}
            </Space>
          </List.Item>
        ))}
      </List>
    </Card>
  );

  return (
    <Dropdown overlay={showFieldsDropdownContent} trigger={['click']}>
      <Button icon={<MoreOutlined />}>{t('showFieldsText')}</Button>
    </Dropdown>
  );
};

export default ShowFieldsFilterDropdown;
