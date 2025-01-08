import Avatars from '@/components/avatars/avatars';
import { getTeamMembers } from '@/features/team-members/team-members.slice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Dropdown, Flex, Input, InputRef, Space, theme } from 'antd';
import { useToken } from 'antd/es/theme/internal';
import React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ProjectManagerDropdown: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('project-drawer');
  const { teamMembers } = useAppSelector(state => state.teamMembersReducer);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const labelInputRef = useRef<InputRef>(null);
  const { token } = theme.useToken();

  useEffect(() => {
    if (!teamMembers?.data) {
      dispatch(getTeamMembers({ index: 1, size: 5, field: null, order: null, search: searchQuery }));
    }
  }, [dispatch, searchQuery]);

  const projectManagerOptions = [
    ...(teamMembers?.data?.map((member, index) => ({
      key: index,
      value: member.id,
      label: member.name,
    })) || []),
  ];

  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };

  const menuStyle: React.CSSProperties = {
    boxShadow: 'none',
  };

  const projectManagerOptionsDropdownRender = (menu: any) => {
    return (
      <div style={contentStyle}>
        <Input
          ref={labelInputRef}
          value={searchQuery}
          onChange={e => setSearchQuery(e.currentTarget.value)}
          placeholder={t('searchInputPlaceholder')}
        />
        <Divider style={{ margin: '8px 0' }} />
        <Avatars members={menu}/>
      </div>
      //   <Card>
      //     <Input
      //       ref={labelInputRef}
      //       value={searchQuery}
      //       onChange={e => setSearchQuery(e.currentTarget.value)}
      //       placeholder={t('searchInputPlaceholder')}
      //     />
      //     <Divider style={{ margin: '8px 0' }} />
      //     {menu}
      //   </Card>
    );
  };

  return (
    <Dropdown
      menu={{ items: projectManagerOptions }}
      trigger={['click']}
      dropdownRender={projectManagerOptionsDropdownRender}
    >
      <Button type="dashed" shape="circle" icon={<PlusCircleOutlined />} />
    </Dropdown>
  );
};

export default ProjectManagerDropdown;
