import { fetchProjectStatuses } from '@/features/projects/lookups/projectStatuses/projectStatusesSlice';
import { setSelectedProjectStatuses } from '@/features/reporting/projectReports/project-reports-slice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { IProjectStatus } from '@/types/project/projectStatus.types';
import { CaretDownFilled } from '@ant-design/icons';
import { Button, Card, Checkbox, Dropdown, List, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ProjectStatusFilterDropdown = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('reporting-projects-filters');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { projectStatuses, loading: projectStatusesLoading } = useAppSelector(
    state => state.projectStatusesReducer
  );
  const { mode: themeMode } = useAppSelector(state => state.themeReducer);

  useEffect(() => {
    if (!projectStatusesLoading) dispatch(fetchProjectStatuses());
  }, [dispatch]);

  const handleProjectStatusClick = (status: IProjectStatus) => {
    dispatch(setSelectedProjectStatuses(status));
  };

  // custom dropdown content
  const projectStatusDropdownContent = (
    <Card className="custom-card" styles={{ body: { padding: 0 } }}>
      <List style={{ padding: 0 }}>
        {projectStatuses.map(item => (
          <List.Item
            className={`custom-list-item ${themeMode === 'dark' ? 'dark' : ''}`}
            key={item.id}
            style={{
              display: 'flex',
              gap: 8,
              padding: '4px 8px',
              border: 'none',
            }}
          >
            <Space>
              <Checkbox
                id={item.id}
                key={item.id}
                onChange={e => handleProjectStatusClick(item)}
              >
                {item.name}
              </Checkbox>
            </Space>
          </List.Item>
        ))}
      </List>
    </Card>
  );

  return (
    <Dropdown
      overlayClassName="custom-dropdown"
      trigger={['click']}
      dropdownRender={() => projectStatusDropdownContent}
      onOpenChange={open => setIsDropdownOpen(open)}
    >
      <Button
        type="default"
        icon={<CaretDownFilled />}
        iconPosition="end"
        loading={projectStatusesLoading}
        className={`transition-colors duration-300 ${
          isDropdownOpen
            ? 'border-[#1890ff] text-[#1890ff]'
            : 'hover:text-[#1890ff hover:border-[#1890ff]'
        }`}
      >
        {t('statusText')}
      </Button>
    </Dropdown>
  );
};

export default ProjectStatusFilterDropdown;
