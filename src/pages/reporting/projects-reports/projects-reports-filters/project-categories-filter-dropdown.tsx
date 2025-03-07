import { fetchProjectCategories } from '@/features/projects/lookups/projectCategories/projectCategoriesSlice';
import { setSelectedProjectCategories } from '@/features/reporting/projectReports/project-reports-slice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { IProjectCategoryViewModel } from '@/types/project/projectCategory.types';
import { CaretDownFilled } from '@ant-design/icons';
import { Badge, Button, Card, Checkbox, Dropdown, Empty, Flex, Input, InputRef, List } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ProjectCategoriesFilterDropdown = () => {
  const { t } = useTranslation('reporting-projects-filters');
  const dispatch = useAppDispatch();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const categoryInputRef = useRef<InputRef>(null);
  const { mode: themeMode } = useAppSelector(state => state.themeReducer);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { projectCategories, loading: projectCategoriesLoading } = useAppSelector(
    state => state.projectCategoriesReducer
  );

  const handleCategoryDropdownOpen = (open: boolean) => {
    setIsDropdownOpen(open);

    if (open) {
      setTimeout(() => {
        categoryInputRef.current?.focus();
      }, 0);
    }
  };

  // Add filtered categories memo
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return projectCategories;

    return projectCategories.filter(category =>
      category.name?.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  }, [projectCategories, searchQuery]);

  const handleCategoryChange = (category: IProjectCategoryViewModel) => {
    dispatch(setSelectedProjectCategories(category));
  };

  useEffect(() => {
    if (!projectCategoriesLoading) dispatch(fetchProjectCategories());
  }, [dispatch]);

  const projectCategoryDropdownContent = (
    <Card className="custom-card" styles={{ body: { padding: 8, width: 260 } }}>
      <Flex vertical gap={8}>
        <Input
          ref={categoryInputRef}
          value={searchQuery}
          onChange={e => setSearchQuery(e.currentTarget.value)}
          placeholder={t('searchByCategoryPlaceholder')}
        />

        <List style={{ padding: 0 }}>
          {filteredCategories.length ? (
            filteredCategories.map(category => (
              <List.Item
                className={`custom-list-item ${themeMode === 'dark' ? 'dark' : ''}`}
                key={category.id}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  gap: 8,
                  padding: '4px 8px',
                  border: 'none',
                }}
              >
                <Checkbox id={category.id} onChange={() => handleCategoryChange(category)}>
                  <Flex gap={8}>
                    <Badge color={category.color_code} />
                    {category.name}
                  </Flex>
                </Checkbox>
              </List.Item>
            ))
          ) : (
            <Empty />
          )}
        </List>
      </Flex>
    </Card>
  );

  return (
    <Dropdown
      overlayClassName="custom-dropdown"
      trigger={['click']}
      dropdownRender={() => projectCategoryDropdownContent}
      onOpenChange={handleCategoryDropdownOpen}
    >
      <Button
        icon={<CaretDownFilled />}
        iconPosition="end"
        loading={projectCategoriesLoading}
        className={`transition-colors duration-300 ${
          isDropdownOpen
            ? 'border-[#1890ff] text-[#1890ff]'
            : 'hover:text-[#1890ff hover:border-[#1890ff]'
        }`}
      >
        {t('categoryText')}
      </Button>
    </Dropdown>
  );
};

export default ProjectCategoriesFilterDropdown;
