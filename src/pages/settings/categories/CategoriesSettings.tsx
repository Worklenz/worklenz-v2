import {
  DeleteOutlined,
  ExclamationCircleFilled,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Flex,
  Input,
  Popconfirm,
  Table,
  TableProps,
  Tooltip,
  Typography,
} from 'antd';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { colors } from '../../../styles/colors';
import { CategoryType } from '../../../types/categories.types';
import CustomColordCategoryTag from '../../../features/settings/categories/color-changed-category';
import { deleteCategory } from '../../../features/settings/categories/categoriesSlice';
import { useDocumentTitle } from '../../../hooks/useDoumentTItle';

const CategoriesSettings = () => {
  // localization
  const { t } = useTranslation('categoriesSettings');

  useDocumentTitle('Manage Categories');

  // get currently hover row
  const [hoverRow, setHoverRow] = useState<string | null>(null);

  // get category data from category slice
  const categoriesList = useAppSelector(
    (state) => state.categoriesReducer.categoriesList
  );
  const dispatch = useAppDispatch();

  // this is for get the current string that type on search bar
  const [searchQuery, setSearchQuery] = useState<string>('');

  // used useMemo hook for re render the list when searching
  const filteredCategoriesData = useMemo(() => {
    return categoriesList.filter((item) =>
      item.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categoriesList, searchQuery]);

  // table columns
  const columns: TableProps['columns'] = [
    {
      key: 'category',
      title: t('categoryColumn'),
      render: (record: CategoryType) => (
        <CustomColordCategoryTag category={record} />
      ),
    },
    {
      key: 'associatedTask',
      title: t('associatedTaskColumn'),
      render: () => <Typography.Text>0</Typography.Text>,
    },
    {
      key: 'actionBtns',
      width: 60,
      render: (record: CategoryType) =>
        hoverRow === record.categoryId && (
          <Popconfirm
            title={t('deleteConfirmationTitle')}
            icon={
              <ExclamationCircleFilled
                style={{ color: colors.vibrantOrange }}
              />
            }
            okText={t('deleteConfirmationOk')}
            cancelText={t('deleteConfirmationCancel')}
            onConfirm={() => dispatch(deleteCategory(record.categoryId))}
          >
            <Tooltip title= 'Delete'>
              <Button shape="default" icon={<DeleteOutlined />} size="small" />
            </Tooltip>
          </Popconfirm>
        ),
    },
  ];

  return (
    <Card
      style={{ width: '100%' }}
      title={
        <Flex justify="flex-end">
          <Flex
            gap={8}
            align="center"
            justify="flex-end"
            style={{ width: '100%', maxWidth: 400 }}
          >
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              placeholder={t('searchPlaceholder')}
              style={{ maxWidth: 232 }}
              suffix={<SearchOutlined />}
            />
          </Flex>
        </Flex>
      }
    >
      <Table
        locale={{
          emptyText: <Typography.Text>{t('emptyText')}</Typography.Text>,
        }}
        className="custom-two-colors-row-table"
        dataSource={filteredCategoriesData}
        columns={columns}
        rowKey={(record) => record.categoryId}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 20,
          pageSizeOptions: ['5', '10', '15', '20', '50', '100'],
          size: 'small',
        }}
        onRow={(record) => {
          return {
            onMouseEnter: () => setHoverRow(record.categoryId),
            onMouseLeave: () => setHoverRow(null),
            style: {
              cursor: 'pointer',
              height: 36,
            },
          };
        }}
      />
    </Card>
  );
};

export default CategoriesSettings;
