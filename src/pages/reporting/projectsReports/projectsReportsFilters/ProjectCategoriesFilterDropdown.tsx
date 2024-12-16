import { CaretDownFilled } from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Dropdown,
  Empty,
  Flex,
  Input,
  InputRef,
  List,
} from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ProjectCategoriesFilterDropdown = () => {
  // state to track dropdown open status
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const categoryInputRef = useRef<InputRef>(null);
  // this is for get the current string that type on search bar
  const [searchQuery, setSearchQuery] = useState<string>('');

  // localization
  const { t } = useTranslation('reporting-projects-filters');

  // mock category list------------> Temperory
  type CategoryType = {
    categoryId: string;
    categoryName: string;
    categoryColor: string;
  };

  const categoryList: CategoryType[] = [
    {
      categoryId: 'category1',
      categoryName: 'Development',
      categoryColor: '#dcbfe3',
    },
    {
      categoryId: 'category2',
      categoryName: 'Testing',
      categoryColor: '#dcbfe3',
    },
    {
      categoryId: 'category3',
      categoryName: 'Management',
      categoryColor: '#dcbfe3',
    },
  ];

  // used useMemo hook for re render the list when searching
  const filteredCategoryData = useMemo(() => {
    return categoryList.filter((category) =>
      category.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categoryList, searchQuery]);

  // function to focus category input
  const handleCategoryDropdownOpen = (open: boolean) => {
    setIsDropdownOpen(open);

    if (open) {
      setTimeout(() => {
        categoryInputRef.current?.focus();
      }, 0);
    }
  };

  // custom dropdown content
  const projectCategoryDropdownContent = (
    <Card className="custom-card" styles={{ body: { padding: 8, width: 260 } }}>
      <Flex vertical gap={8}>
        <Input
          ref={categoryInputRef}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          placeholder={t('searchByCategoryPlaceholder')}
        />

        <List style={{ padding: 0 }}>
          {filteredCategoryData.length ? (
            filteredCategoryData.map((category) => (
              <List.Item
                className="custom-list-item"
                key={category.categoryId}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  gap: 8,
                  padding: '4px 8px',
                  border: 'none',
                }}
              >
                <Checkbox id={category.categoryId} />

                <Flex gap={8}>
                  <Badge color={category.categoryColor} />
                  {category.categoryName}
                </Flex>
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
