/* eslint-disable react-hooks/exhaustive-deps */
import { CloseCircleFilled, DownOutlined } from '@ant-design/icons';
import {
  Badge,
  Card,
  Dropdown,
  Flex,
  Input,
  InputRef,
  Menu,
  MenuProps,
  Typography,
} from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { useAppSelector } from '../../../../../../hooks/useAppSelector';
import { colors } from '../../../../../../styles/colors';
import { CategoryType } from '../../../../../../types/categories.types';
import './projectCategoryCell.css';
import { nanoid } from '@reduxjs/toolkit';
import { useAppDispatch } from '../../../../../../hooks/useAppDispatch';
import { addCategory } from '../../../../../../features/settings/categories/categoriesSlice';
import { themeWiseColor } from '../../../../../../utils/themeWiseColor';
import { useTranslation } from 'react-i18next';

const ProjectCategoryCell = ({
  categoryId,
  categoryName,
  categoryColor,
}: CategoryType) => {
  const [projectCategory, setProjectCategory] = useState<CategoryType>({
    categoryId,
    categoryName,
    categoryColor,
  });

  const categoryInputRef = useRef<InputRef>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // localization
  const { t } = useTranslation('reportingProjects');

  //   get theme from theme slice
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  // get categories list from the categories reducer
  const categoriesList = useAppSelector(
    (state) => state.categoriesReducer.categoriesList
  );
  const dispatch = useAppDispatch();

  // filter categories based on search query
  const filteredCategoriesData = useMemo(() => {
    return categoriesList.filter((category) =>
      category.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categoriesList, searchQuery]);

  // category selection options
  const categoryOptions = filteredCategoriesData.map((category) => ({
    key: category.categoryId,
    label: (
      <Typography.Text
        style={{ display: 'flex', alignItems: 'center', gap: 4 }}
      >
        <Badge color={category.categoryColor} /> {category.categoryName}
      </Typography.Text>
    ),
  }));

  // handle category select
  const onClick: MenuProps['onClick'] = (e) => {
    const selectedCategory = filteredCategoriesData.find(
      (category) => category.categoryId === e.key
    );
    if (selectedCategory) {
      setProjectCategory(selectedCategory);
    }
  };

  //   function to handle add a new category
  const handleCreateCategory = (categoryName: string) => {
    if (categoryName.length > 0) {
      const newCategory: CategoryType = {
        categoryId: nanoid(),
        categoryName,
        categoryColor: '#1E90FF',
      };

      dispatch(addCategory(newCategory));
      setSearchQuery('');
    }
  };

  // dropdown items
  const projectCategoryCellItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Card className="project-category-dropdown-card" bordered={false}>
          <Flex vertical gap={4}>
            <Input
              ref={categoryInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              placeholder={t('searchByNameInputPlaceholder')}
              onKeyDown={(e) => {
                const isCategory = filteredCategoriesData.findIndex(
                  (category) =>
                    category.categoryName.toLowerCase() ===
                    searchQuery.toLowerCase()
                );
                if (isCategory === -1 && e.key === 'Enter') {
                  // handle category creation logic
                  handleCreateCategory(searchQuery);
                }
              }}
            />
            {filteredCategoriesData.length === 0 && (
              <Typography.Text style={{ color: colors.lightGray }}>
                Hit enter to create!
              </Typography.Text>
            )}
          </Flex>

          <Menu
            className="project-category-menu"
            items={categoryOptions}
            onClick={onClick}
          />
        </Card>
      ),
    },
  ];

  // function to focus the category input when the dropdown is opened
  const handleCategoryDropdownOpen = (open: boolean) => {
    if (open) {
      setTimeout(() => {
        categoryInputRef.current?.focus();
      }, 0);
    }
  };

  return (
    <Dropdown
      overlayClassName="custom-dropdown"
      menu={{ items: projectCategoryCellItems }}
      placement="bottomRight"
      trigger={['click']}
      onOpenChange={handleCategoryDropdownOpen}
    >
      <Flex
        gap={6}
        align="center"
        style={{
          width: 'fit-content',
          borderRadius: 24,
          paddingInline: 8,
          textTransform: 'capitalize',
          fontSize: 13,
          height: 22,
          backgroundColor: projectCategory.categoryId
            ? projectCategory.categoryColor
            : colors.transparent,
          color: projectCategory.categoryId
            ? themeWiseColor(colors.white, colors.darkGray, themeMode)
            : themeWiseColor(colors.darkGray, colors.white, themeMode),
          border: projectCategory.categoryId
            ? 'none'
            : `1px solid ${colors.deepLightGray}`,
          cursor: 'pointer',
        }}
      >
        {projectCategory.categoryId
          ? projectCategory.categoryName
          : t('setCategoryText')}

        {/* Conditionally render the close icon */}
        {projectCategory.categoryId ? (
          <CloseCircleFilled
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the dropdown
              setProjectCategory({
                categoryId: '',
                categoryName: '',
                categoryColor: '',
              }); // Reset the category
            }}
            style={{ cursor: 'pointer' }}
          />
        ) : (
          <DownOutlined />
        )}
      </Flex>
    </Dropdown>
  );
};

export default ProjectCategoryCell;
