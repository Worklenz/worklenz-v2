import { MoreOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import Button from 'antd/es/button';
import Checkbox from 'antd/es/checkbox';
import Dropdown from 'antd/es/dropdown';
import Space from 'antd/es/space';

import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { toggleColumnVisibility, updateColumnVisibility } from '@/features/tasks/tasks.slice';
import { ITaskListColumn } from '@/types/tasks/taskList.types';

const ShowFieldsFilterDropdown = () => {
  // localization
  const { t } = useTranslation('task-list-filters');

  const dispatch = useAppDispatch();

  const columnList = useAppSelector(state => state.taskReducer.columns);
  const {projectId, project} = useAppSelector(state => state.projectReducer);

  const visibilityChangableColumnList = columnList.filter(
    column => column.key !== 'selector' && column.key !== 'task' && column.key !== 'customColumn'
  );

  const themeMode = useAppSelector(state => state.themeReducer.mode);

  const handleColumnVisibilityChange = async (col: ITaskListColumn) => {
    if (!projectId) return;
    const column = { ...col, pinned: !col.pinned };
    await dispatch(updateColumnVisibility({ projectId, item: column }));
  };

  const menuItems = visibilityChangableColumnList.map(col => ({
    key: col.key,
    label: (
      <Space>
        <Checkbox checked={col.pinned} onChange={e => handleColumnVisibilityChange(col)}>
          {col.key === 'PHASE' ? project?.phase_label : ''}
          {col.key !== 'PHASE' && (col.custom_column
            ? col.name
            : t(`${col.key?.replace('_', '').toLowerCase() + 'Text'}`))}
        </Checkbox>
      </Space>
    )
  }));
  return (
    <Dropdown 
      menu={{ 
        items: menuItems,
        style: { maxHeight: '400px', overflowY: 'auto' } 
      }} 
      trigger={['click']}
    >
      <Button icon={<MoreOutlined />}>{t('showFieldsText')}</Button>
    </Dropdown>
  );
};

export default ShowFieldsFilterDropdown;
