import {
  Badge,
  Button,
  Collapse,
  ConfigProvider,
  Dropdown,
  Flex,
  Input,
  Typography,
} from 'antd';
import React, { useState } from 'react';
import { TaskType } from '../../../../../types/task.types';
import {
  EditOutlined,
  EllipsisOutlined,
  RetweetOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { colors } from '../../../../../styles/colors';
import './taskListTableWrapper.css';
import TaskListTable from './TaskListTable';
import { MenuProps } from 'antd/lib';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { useTranslation } from 'react-i18next';
import { IProjectTask } from '@/types/project/projectTasksViewModel.types';

type TaskListTableWrapperProps = {
  taskList: IProjectTask[];
  tableId: string;
  groupBy: string;
  name: string;
  color: string;
  statusCategory?: string | null;
  priorityCategory?: string | null;
  onRename?: (name: string) => void;
  onStatusCategoryChange?: (category: string) => void;
};

const TaskListTableWrapper = ({
  taskList,
  tableId,
  name,
  groupBy,
  color,
  statusCategory = null,
  priorityCategory = null,
  onRename,
  onStatusCategoryChange,
}: TaskListTableWrapperProps) => {
  const [tableName, setTableName] = useState<string>(name);
  const [isRenaming, setIsRenaming] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [currentCategory, setCurrentCategory] = useState<string | null>(
    statusCategory
  );

  // localization
  const { t } = useTranslation('task-list-table');

  // function to handle toggle expand
  const handlToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  // function to handle rename this functionality only available for status type tables
  const handleRename = () => {
    if (onRename) {
      onRename(tableName);
    }
    setIsRenaming(false);
  };

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
    if (onStatusCategoryChange) {
      onStatusCategoryChange(category);
    }
  };

  const statusList = useAppSelector((state) => state.statusReducer.status);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return '#d8d7d8';
      case 'doing':
        return '#c0d5f6';
      case 'done':
        return '#c2e4d0';
      default:
        return '#d8d7d8';
    }
  };

  // dropdown options
  const items: MenuProps['items'] = [
    {
      key: '1',
      icon: <EditOutlined />,
      label: 'Rename',
      onClick: () => setIsRenaming(true),
    },
    {
      key: '2',
      icon: <RetweetOutlined />,
      label: 'Change category',
      children: statusList?.map((status) => ({
        key: status.id,
        label: (
          <Flex gap={8} onClick={() => handleCategoryChange(status.category)}>
            <Badge color={getStatusColor(status.category)} />
            {status.name}
          </Flex>
        ),
      })),
    },
  ];

  return (
    <ConfigProvider
      wave={{ disabled: true }}
      theme={{
        components: {
          Collapse: {
            headerPadding: 0,
            contentPadding: 0,
          },

          Select: {
            colorBorder: colors.transparent,
          },
        },
      }}
    >
      <Flex vertical>
        <Flex style={{ transform: 'translateY(6px)' }}>
          <Button
            className="custom-collapse-button"
            style={{
              backgroundColor: color,
              border: 'none',
              borderBottomLeftRadius: isExpanded ? 0 : 4,
              borderBottomRightRadius: isExpanded ? 0 : 4,
              color: colors.darkGray,
            }}
            icon={<RightOutlined rotate={isExpanded ? 90 : 0} />}
            onClick={handlToggleExpand}
          >
            {isRenaming ? (
              <Input
                size="small"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                onBlur={handleRename}
                onPressEnter={handleRename}
                autoFocus
              />
            ) : (
              <Typography.Text
                style={{
                  fontSize: 14,
                  color: colors.darkGray,
                }}
              >
                {/* check the default values available in the table names ==> this check for localization  */}
                {['todo', 'doing', 'done', 'low', 'medium', 'high'].includes(
                  tableName.replace(/\s+/g, '').toLowerCase()
                )
                  ? t(
                      `${tableName.replace(/\s+/g, '').toLowerCase()}SelectorText`
                    )
                  : tableName}{' '}
                ({taskList.length})
              </Typography.Text>
            )}
          </Button>
          {groupBy === 'status' && !isRenaming && (
            <Dropdown menu={{ items }}>
              <Button
                icon={<EllipsisOutlined />}
                className="borderless-icon-btn"
              />
            </Dropdown>
          )}
        </Flex>
        <Collapse
          collapsible="header"
          className="border-l-[4px]"
          bordered={false}
          ghost={true}
          expandIcon={() => null}
          activeKey={isExpanded ? '1' : undefined}
          onChange={handlToggleExpand}
          items={[
            {
              key: '1',
              className: `custom-collapse-content-box relative after:content after:absolute after:h-full after:w-1 after:bg-[${color}] after:z-10 after:top-0 after:left-0`,
              children: <TaskListTable taskList={taskList} tableId={tableId} />,
            },
          ]}
        />
      </Flex>
    </ConfigProvider>
  );
};

export default TaskListTableWrapper;
