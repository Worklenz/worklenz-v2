import { IProjectViewModel } from '@/types/project/projectViewModel.types';
import { Tooltip, Tag } from 'antd';
import { TFunction } from 'i18next';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setFilteredCategories } from '@/features/projects/projectsSlice';
import '../../TableColumns.css';

export const CategoryCell: React.FC<{
  record: IProjectViewModel;
  t: TFunction;
}> = ({ record, t }) => {
  if (!record.category_name) return '-';

  const dispatch = useAppDispatch();

  const filterByCategory = (categoryId: string | undefined) => {
    if (!categoryId) return;
    dispatch(setFilteredCategories([categoryId]));
  };

  return (
    <Tooltip title={`${t('clickToFilter')} "${record.category_name}"`}>
      <Tag
        color={record.category_color}
        className="rounded-full table-tag"
        onClick={e => {
          e.stopPropagation();
          filterByCategory(record.category_id);
        }}
      >
        {record.category_name}
      </Tag>
    </Tooltip>
  );
};
