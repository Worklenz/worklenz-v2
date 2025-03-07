import React, { useEffect, useRef, useState } from 'react';
import { Button, Dropdown, Flex, Input, InputRef, Popconfirm, Tooltip, Typography } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  LoadingOutlined,
  MoreOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';

import ChangeCategoryDropdown from '@/components/board/changeCategoryDropdown/ChangeCategoryDropdown';
import { useAppSelector } from '@/hooks/useAppSelector';
import { colors } from '@/styles/colors';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { deleteSection, setEditableSection } from '@features/board/board-slice';
import { themeWiseColor } from '@/utils/themeWiseColor';
import { useAuthService } from '@/hooks/useAuth';
import useIsProjectManager from '@/hooks/useIsProjectManager';

interface BoardSectionCardHeaderProps {
  id: string;
  name: string;
  tasksCount: number;
  isLoading: boolean;
  setName: (newName: string) => void;
  colorCode: string;
  onHoverChange: (hovered: boolean) => void;
  setShowNewCard: (x: boolean) => void;
}

const BoardSectionCardHeader: React.FC<BoardSectionCardHeaderProps> = ({
  id,
  name,
  tasksCount,
  isLoading,
  setName,
  colorCode,
  onHoverChange,
  setShowNewCard,
}) => {
  const [isEditable, setIsEditable] = useState(false);
  const [isEllipsisActive, setIsEllipsisActive] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const isOwnerOrAdmin = useAuthService().isOwnerOrAdmin();
  const isProjectMember = useIsProjectManager();

  const editableSectionId = useAppSelector(state => state.boardReducer.editableSectionId);

  const { t } = useTranslation('kanban-board');

  const themeMode = useAppSelector(state => state.themeReducer.mode);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isEditable && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditable]);

  useEffect(() => {
    if (editableSectionId === id) {
      setIsEditable(true);
      dispatch(setEditableSection(null));
    }
  }, [editableSectionId, id, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleBlur = () => {
    if (name === 'Untitled section') {
      dispatch(deleteSection({ sectionId: id }));
    }
    setIsEditable(false);
  };

  const handlePressEnter = () => {
    setShowNewCard(true);
    setIsEditable(false);
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            width: '100%',
            padding: '5px 12px',
            gap: '8px',
          }}
          onClick={() => setIsEditable(true)}
        >
          <EditOutlined /> <span>{t('rename')}</span>
        </div>
      ),
    },
    {
      key: '2',
      label: <ChangeCategoryDropdown id={''} />,
    },
    {
      key: '3',
      label: (
        <Popconfirm
          title={t('deleteConfirmationTitle')}
          icon={<ExclamationCircleFilled style={{ color: colors.vibrantOrange }} />}
          okText={t('deleteConfirmationOk')}
          cancelText={t('deleteConfirmationCancel')}
          onConfirm={() => dispatch(deleteSection({ sectionId: id }))}
        >
          <Flex gap={8} align="center" style={{ width: '100%', padding: '5px 12px' }}>
            <DeleteOutlined />
            {t('delete')}
          </Flex>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Flex
      align="center"
      justify="space-between"
      style={{
        fontWeight: 600,
        padding: '8px',
        backgroundColor: colorCode,
        borderRadius: 6,
      }}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      <Flex
        gap={8}
        align="center"
        style={{ cursor: 'pointer' }}
        onClick={() => setIsEditable(true)}
      >
        <Flex
          align="center"
          justify="center"
          style={{
            minWidth: 26,
            height: 26,
            borderRadius: 120,
            backgroundColor: themeWiseColor('white', '#1e1e1e', themeMode),
          }}
        >
          {tasksCount}
        </Flex>

        {isLoading && <LoadingOutlined style={{ color: colors.darkGray }} />}
        {isEditable ? (
          <Input
            ref={inputRef}
            value={name}
            variant="borderless"
            style={{
              backgroundColor: themeWiseColor('white', '#1e1e1e', themeMode),
            }}
            onChange={handleChange}
            onBlur={handleBlur}
            onPressEnter={handlePressEnter}
          />
        ) : (
          <Tooltip title={isEllipsisActive ? name : null}>
            <Typography.Text
              ellipsis={{
                tooltip: false,
                onEllipsis: ellipsed => setIsEllipsisActive(ellipsed),
              }}
              style={{
                minWidth: 200,
                textTransform: 'capitalize',
                color: themeMode === 'dark' ? '#383838' : '',
                display: 'inline-block',
                overflow: 'hidden',
              }}
            >
              {name}
            </Typography.Text>
          </Tooltip>
        )}
      </Flex>

      <div style={{ display: 'flex' }}>
        <Button
          type="text"
          size="small"
          shape="circle"
          style={{ color: themeMode === 'dark' ? '#383838' : '' }}
          onClick={() => setShowNewCard(true)}
        >
          <PlusOutlined />
        </Button>

        {(isOwnerOrAdmin || isProjectMember) && (
          <Dropdown
            overlayClassName="todo-threedot-dropdown"
            trigger={['click']}
            menu={{ items }}
            placement="bottomLeft"
          >
            <Button type="text" size="small" shape="circle">
              <MoreOutlined
                style={{
                  rotate: '90deg',
                  fontSize: '25px',
                  color: themeMode === 'dark' ? '#383838' : '',
                }}
              />
            </Button>
          </Dropdown>
        )}
      </div>
    </Flex>
  );
};

export default BoardSectionCardHeader;
