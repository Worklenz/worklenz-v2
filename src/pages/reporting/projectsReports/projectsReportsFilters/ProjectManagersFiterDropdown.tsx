import { CaretDownFilled } from '@ant-design/icons';
import {
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

const ProjectManagersFilterDropdown = () => {
  // state to track dropdown open status
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const projectManagerInputRef = useRef<InputRef>(null);
  // this is for get the current string that type on search bar
  const [searchQuery, setSearchQuery] = useState<string>('');

  // localization
  const { t } = useTranslation('reporting-projects-filters');

  // mock projectManager list------------> Temperory
  type ProjectManagerType = {
    projectManagerId: string;
    projectManagerName: string;
  };

  const projectManagerList: ProjectManagerType[] = [
    {
      projectManagerId: 'projectManager1',
      projectManagerName: 'Amal Perera',
    },
    {
      projectManagerId: 'projectManager2',
      projectManagerName: 'Raveesha Dilanks',
    },
    {
      projectManagerId: 'projectManager3',
      projectManagerName: 'Sachintha Prasad',
    },
  ];

  // used useMemo hook for re render the list when searching
  const filteredProjectManagerData = useMemo(() => {
    return projectManagerList.filter((projectManager) =>
      projectManager.projectManagerName
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [projectManagerList, searchQuery]);

  // function to focus projectManager input
  const handleProjectManagerDropdownOpen = (open: boolean) => {
    setIsDropdownOpen(open);

    if (open) {
      setTimeout(() => {
        projectManagerInputRef.current?.focus();
      }, 0);
    }
  };

  // custom dropdown content
  const projectManagerDropdownContent = (
    <Card className="custom-card" styles={{ body: { padding: 8, width: 260 } }}>
      <Flex vertical gap={8}>
        <Input
          ref={projectManagerInputRef}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          placeholder={t('searchByNamePlaceholder')}
        />

        <List style={{ padding: 0 }}>
          {filteredProjectManagerData.length ? (
            filteredProjectManagerData.map((projectManager) => (
              <List.Item
                className="custom-list-item"
                key={projectManager.projectManagerId}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  gap: 8,
                  padding: '4px 8px',
                  border: 'none',
                }}
              >
                <Checkbox id={projectManager.projectManagerId} />
                {projectManager.projectManagerName}
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
      dropdownRender={() => projectManagerDropdownContent}
      onOpenChange={handleProjectManagerDropdownOpen}
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
        {t('projectManagerText')}
      </Button>
    </Dropdown>
  );
};

export default ProjectManagersFilterDropdown;
