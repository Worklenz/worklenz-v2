import React, { useEffect, useState, useRef, useMemo } from 'react';
import DatePicker from 'antd/es/date-picker';
import Checkbox from 'antd/es/checkbox';
import Tag from 'antd/es/tag';
import Tooltip from 'antd/es/tooltip';
import Input, { InputRef } from 'antd/es/input';
import Typography from 'antd/es/typography';
import Flex from 'antd/es/flex';
import { HolderOutlined, SettingOutlined, UsergroupAddOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DraggableAttributes, UniqueIdentifier } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { DragEndEvent } from '@dnd-kit/core';
import { List, Card, Avatar, Dropdown, Empty, Divider, Button } from 'antd';
import dayjs from 'dayjs';

import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';

import { colors } from '@/styles/colors';
import TaskContextMenu from './context-menu/task-context-menu';
import AddTaskListRow from './task-list-table-rows/add-task-list-row';
import CustomColumnLabelCell from './custom-columns/custom-column-cells/custom-column-label-cell/custom-column-label-cell';
import CustomColumnSelectionCell from './custom-columns/custom-column-cells/custom-column-selection-cell/custom-column-selection-cell';
import TaskListProgressCell from './task-list-table-cells/task-list-progress-cell/task-list-progress-cell';
import TaskListStartDateCell from './task-list-table-cells/task-list-start-date-cell/task-list-start-date-cell';
import TaskListDueDateCell from './task-list-table-cells/task-list-due-date-cell/task-list-due-date-cell';
import TaskListMembersCell from './task-list-table-cells/task-list-members-cell/task-list-members-cell';
import TaskListLabelsCell from './task-list-table-cells/task-list-labels-cell/task-list-labels-cell';
import TaskListEstimationCell from './task-list-table-cells/task-list-estimation-cell/task-list-estimation-cell';
import TaskListTimeTrackerCell from './task-list-table-cells/task-list-time-tracker-cell/task-list-time-tracker-cell';
import TaskListTaskCell from './task-list-table-cells/task-list-task-cell/task-list-task-cell';
import TaskListTaskIdCell from './task-list-table-cells/task-list-task-id-cell/task-list-task-id-cell';
import TaskListDescriptionCell from './task-list-table-cells/task-list-description-cell/task-list-description-cell';
import TaskListCompletedDateCell from './task-list-table-cells/task-list-completed-date-cell/task-list-completed-date-cell';
import TaskListCreatedDateCell from './task-list-table-cells/task-list-created-date-cell/task-list-created-date-cell';
import TaskListLastUpdatedCell from './task-list-table-cells/task-list-last-updated-cell/task-list-last-updated-cell';
import TaskListReporterCell from './task-list-table-cells/task-list-reporter-cell/task-list-reporter-cell';
import TaskListDueTimeCell from './task-list-table-cells/task-list-due-time-cell/task-list-due-time-cell';
import AssigneeSelector from '@/components/taskListCommon/assignee-selector/assignee-selector';
import { IProjectTask } from '@/types/project/projectTasksViewModel.types';
import { CustomFieldsTypes, setCustomColumnModalAttributes, toggleCustomColumnModalOpen } from '@/features/projects/singleProject/task-list-custom-columns/task-list-custom-columns-slice';
import { selectTaskIds, selectTasks } from '@/features/projects/bulkActions/bulkActionSlice';
import StatusDropdown from '@/components/task-list-common/status-dropdown/status-dropdown';
import PriorityDropdown from '@/components/task-list-common/priorityDropdown/priority-dropdown';
import AddCustomColumnButton from './custom-columns/custom-column-modal/add-custom-column-button';
import { fetchSubTasks, reorderTasks, toggleTaskRowExpansion, updateCustomColumnValue } from '@/features/tasks/tasks.slice';
import { useAuthService } from '@/hooks/useAuth';
import ConfigPhaseButton from '@/features/projects/singleProject/phase/ConfigPhaseButton';
import PhaseDropdown from '@/components/taskListCommon/phase-dropdown/phase-dropdown';
import CustomColumnModal from './custom-columns/custom-column-modal/custom-column-modal';
import { toggleProjectMemberDrawer } from '@/features/projects/singleProject/members/projectMembersSlice';
import SingleAvatar from '@/components/common/single-avatar/single-avatar';
import { useSocket } from '@/socket/socketContext';
import { SocketEvents } from '@/shared/socket-events';

interface TaskListTableProps {
  taskList: IProjectTask[] | null;
  tableId: string;
  activeId?: string | null;
}

interface DraggableRowProps {
  task: IProjectTask;
  children: (attributes: DraggableAttributes, listeners: SyntheticListenerMap) => React.ReactNode;
  groupId: string;
}

// Add a simplified EmptyRow component that doesn't use hooks
const EmptyRow = () => null;

// Simplify DraggableRow to eliminate conditional hook calls
const DraggableRow = ({ task, children, groupId }: DraggableRowProps) => {
  // Return the EmptyRow component without using any hooks
  if (!task?.id) return <EmptyRow />;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id as UniqueIdentifier,
    data: {
      type: 'task',
      task,
      groupId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 1 : 'auto',
    backgroundColor: isDragging ? 'var(--dragging-bg)' : undefined,
  };

  // Handle border styling separately to avoid conflicts
  const borderStyle = {
    borderStyle: isDragging ? 'solid' : undefined,
    borderWidth: isDragging ? '1px' : undefined,
    borderColor: isDragging ? 'var(--border-color)' : undefined,
    borderBottomWidth: document.documentElement.getAttribute('data-theme') === 'light' && !isDragging ? '2px' : undefined
  };

  return (
    <tr
      ref={setNodeRef}
      style={{ ...style, ...borderStyle }}
      className={`task-row h-[42px] ${isDragging ? 'shadow-lg' : ''}`}
      data-is-dragging={isDragging ? 'true' : 'false'}
      data-group-id={groupId}
    >
      {children(attributes, listeners!)}
    </tr>
  );
};

const CustomColumnHeader: React.FC<{
  column: any;
  onSettingsClick: (columnId: string) => void;
}> = ({ column, onSettingsClick }) => {
  return (
    <Flex align="center" justify="space-between" className="w-full">
      <span>{column.name}</span>
      <SettingOutlined
        className="cursor-pointer hover:text-primary"
        onClick={e => {
          e.stopPropagation();
          onSettingsClick(column.key);
        }}
      />
    </Flex>
  );
};

// Fix the CustomCell component to handle nullable column keys
const CustomCell = React.memo(({ 
  column, 
  task, 
  isSubtask, 
  renderCustomColumnContent, 
  renderColumnContent,
  updateTaskCustomColumnValue
}: { 
  column: any; 
  task: IProjectTask; 
  isSubtask: boolean; 
  renderCustomColumnContent: any; 
  renderColumnContent: any;
  updateTaskCustomColumnValue: (taskId: string, columnKey: string, value: string) => void;
}) => {
  if (column.custom_column && column.key) {
    return renderCustomColumnContent(
      column.custom_column_obj || {},
      column.custom_column_obj?.fieldType,
      task,
      column.key,
      updateTaskCustomColumnValue
    );
  }
  return renderColumnContent(column.key || '', task, isSubtask);
});

// First, let's extract the custom column cell to a completely separate component
// This component will be responsible for rendering the appropriate cell based on field type
// Moving this outside of the render flow of DraggableRow will prevent hook order issues

// Add this before the TaskListTable component
const CustomColumnCell: React.FC<{
  columnObj: any;
  columnType: CustomFieldsTypes;
  task: IProjectTask;
  columnKey: string;
  updateTaskCustomColumnValue: (taskId: string, columnKey: string, value: string) => void;
}> = React.memo(({ columnObj, columnType, task, columnKey, updateTaskCustomColumnValue }) => {
  // Get the custom column value from the task
  const customValue = task.custom_column_values?.[columnKey];

  // If columnType is not provided, try to determine it from columnObj
  const fieldType = columnType || columnObj?.fieldType;

  if (!fieldType) {
    return <span className="text-gray-400">No field type</span>;
  }

  // Process all potential values regardless of field type to keep hook order consistent
  const selectedMemberIds = useMemo(() => {
    if (customValue && typeof customValue === 'string') {
      try {
        return JSON.parse(customValue);
      } catch (e) {
        return [];
      }
    }
    return [];
  }, [customValue]);

  // Create cell components based on field type
  switch (fieldType) {
    case 'people':
      return <PeopleFieldCell 
        selectedMemberIds={selectedMemberIds} 
        task={task} 
        columnKey={columnKey} 
        updateValue={updateTaskCustomColumnValue} 
      />;
    case 'date':
      return <DateFieldCell 
        value={customValue} 
        task={task} 
        columnKey={columnKey} 
        updateValue={updateTaskCustomColumnValue} 
      />;
    case 'checkbox':
      return <CheckboxFieldCell 
        value={customValue} 
        task={task} 
        columnKey={columnKey} 
        updateValue={updateTaskCustomColumnValue} 
      />;
    case 'key':
      return <KeyFieldCell taskId={task.id || ''} />;
    case 'number':
      return <NumberFieldCell 
        value={customValue} 
        task={task} 
        columnKey={columnKey} 
        columnObj={columnObj} 
        updateValue={updateTaskCustomColumnValue} 
      />;
    case 'formula':
      return <FormulaFieldCell columnObj={columnObj} />;
    case 'labels':
      return <LabelsFieldCell 
        labelsList={columnObj?.labelsList || []} 
        selectedLabels={selectedMemberIds} 
        task={task} 
        columnKey={columnKey} 
        updateValue={updateTaskCustomColumnValue} 
      />;
    case 'selection':
      return <SelectionFieldCell 
        selectionsList={columnObj?.selectionsList || []} 
        value={customValue || ''} 
        task={task} 
        columnKey={columnKey} 
        updateValue={updateTaskCustomColumnValue} 
      />;
    default:
      return <span>Unsupported field type: {fieldType}</span>;
  }
});

// Define each field type component separately
const PeopleFieldCell: React.FC<{ 
  selectedMemberIds: string[]; 
  task: IProjectTask; 
  columnKey: string; 
  updateValue: (taskId: string, columnKey: string, value: string) => void;
}> = ({ selectedMemberIds, task, columnKey, updateValue }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const membersInputRef = useRef<InputRef>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const members = useAppSelector(state => state.teamMembersReducer.teamMembers);
  const themeMode = useAppSelector(state => state.themeReducer.mode);
  const { t } = useTranslation('task-list-table');
  const dispatch = useAppDispatch();

  const filteredMembersData = useMemo(() => {
    return members?.data?.filter(member =>
      member.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [members, searchQuery]);

  const handleInviteProjectMemberDrawer = () => {
    dispatch(toggleProjectMemberDrawer());
  };

  const handleMembersDropdownOpen = (open: boolean) => {
    setIsDropdownOpen(open);
    if (open) {
      setTimeout(() => {
        membersInputRef.current?.focus();
      }, 0);
    }
  };

  const handleMemberSelection = (memberId: string) => {
    // Toggle the selection of this member
    const newSelectedIds = selectedMemberIds.includes(memberId)
      ? selectedMemberIds.filter((id: string) => id !== memberId)
      : [...selectedMemberIds, memberId];
    
    // Update the custom column value
    if (task.id) {
      updateValue(
        task.id,
        columnKey,
        JSON.stringify(newSelectedIds)
      );
    }
  };

  const membersDropdownContent = (
    <Card className="custom-card" styles={{ body: { padding: 8 } }}>
      <Flex vertical>
        <Input
          ref={membersInputRef}
          value={searchQuery}
          onChange={e => setSearchQuery(e.currentTarget.value)}
          placeholder={t('searchInputPlaceholder')}
        />

        <List style={{ padding: 0, height: 250, overflow: 'auto' }}>
          {filteredMembersData?.length ? (
            filteredMembersData.map(member => (
              <List.Item
                className={`${themeMode === 'dark' ? 'custom-list-item dark' : 'custom-list-item'}`}
                key={member.id || ''}
                style={{
                  display: 'flex',
                  gap: 8,
                  justifyContent: 'flex-start',
                  padding: '4px 8px',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onClick={() => member.id && handleMemberSelection(member.id)}
              >
                <Checkbox 
                  checked={member.id ? selectedMemberIds.includes(member.id) : false} 
                  onClick={e => e.stopPropagation()}
                  onChange={() => member.id && handleMemberSelection(member.id)}
                />
                <div>
                  <SingleAvatar
                    avatarUrl={member.avatar_url}
                    name={member.name}
                    email={member.email}
                  />
                </div>
                <Flex vertical>
                  <Typography.Text>{member.name}</Typography.Text>
                  <Typography.Text
                    style={{
                      fontSize: 12,
                      color: colors.lightGray,
                    }}
                  >
                    {member.email}
                  </Typography.Text>
                </Flex>
              </List.Item>
            ))
          ) : (
            <Empty />
          )}
        </List>

        <Divider style={{ marginBlock: 0 }} />

        <Button
          icon={<UsergroupAddOutlined />}
          type="text"
          style={{
            color: colors.skyBlue,
            border: 'none',
            backgroundColor: colors.transparent,
            width: '100%',
          }}
          onClick={handleInviteProjectMemberDrawer}
        >
          {t('assigneeSelectorInviteButton')}
        </Button>
      </Flex>
    </Card>
  );

  // Display selected members as avatars
  const selectedMembers = useMemo(() => {
    if (!members?.data || !selectedMemberIds.length) return [];
    return members.data.filter(member => selectedMemberIds.includes(member.id || ''));
  }, [members, selectedMemberIds]);

  return (
    <Dropdown
      overlayClassName="custom-dropdown"
      trigger={['click']}
      dropdownRender={() => membersDropdownContent}
      onOpenChange={handleMembersDropdownOpen}
    >
      <Flex align="center" gap={4}>
        {selectedMembers.length > 0 ? (
          <Avatar.Group max={{count: 3}} size="small">
            {selectedMembers.map(member => (
              <Tooltip key={member.id} title={member.name}>
                <Avatar 
                  src={member.avatar_url} 
                  style={{ fontSize: '14px' }}
                >
                  {!member.avatar_url && member.name ? member.name.charAt(0).toUpperCase() : null}
                </Avatar>
              </Tooltip>
            ))}
          </Avatar.Group>
        ) : null}
        <Button
          type="dashed"
          shape="circle"
          size="small"
          icon={
            <PlusOutlined
              style={{
                fontSize: 12,
                width: 22,
                height: 22,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          }
        />
      </Flex>
    </Dropdown>
  );
};

const DateFieldCell: React.FC<{
  value: any;
  task: IProjectTask;
  columnKey: string;
  updateValue: (taskId: string, columnKey: string, value: string) => void;
}> = ({ value, task, columnKey, updateValue }) => {
  const dateValue = value ? dayjs(value) : undefined;
  
  return (
    <DatePicker
      placeholder="Set Date"
      format="MMM DD, YYYY"
      suffixIcon={null}
      value={dateValue}
      onChange={(date) => {
        if (task.id) {
          // Format as ISO string for storage
          updateValue(
            task.id,
            columnKey,
            date ? date.toISOString() : ''
          );
        }
      }}
      style={{
        backgroundColor: colors.transparent,
        border: 'none',
        boxShadow: 'none',
      }}
    />
  );
};

const CheckboxFieldCell: React.FC<{
  value: any;
  task: IProjectTask;
  columnKey: string;
  updateValue: (taskId: string, columnKey: string, value: string) => void;
}> = ({ value, task, columnKey, updateValue }) => {
  const isChecked = value === true || value === 'true';
  
  return (
    <Checkbox 
      checked={isChecked}
      onChange={(e) => {
        if (task.id) {
          updateValue(
            task.id,
            columnKey,
            e.target.checked.toString()
          );
        }
      }}
    />
  );
};

const KeyFieldCell: React.FC<{ taskId: string }> = ({ taskId }) => {
  return (
    <Tooltip title={taskId} className="flex justify-center">
      <Tag>{taskId}</Tag>
    </Tooltip>
  );
};

const NumberFieldCell: React.FC<{
  value: any;
  task: IProjectTask;
  columnKey: string;
  columnObj: any;
  updateValue: (taskId: string, columnKey: string, value: string) => void;
}> = ({ value, task, columnKey, columnObj, updateValue }) => {
  const initialNumberValue = value !== undefined ? Number(value) : undefined;
  const [localValue, setLocalValue] = useState<string>(
    initialNumberValue !== undefined ? 
      initialNumberValue.toString() : 
      ''
  );
  
  // Track if this is the initial render to avoid unnecessary updates
  const isInitialMount = useRef(true);
  
  useEffect(() => {
    // Skip the first render to avoid unnecessary updates
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Update local value when the prop value changes (from external sources)
    if (value !== undefined && value !== null) {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        setLocalValue(numValue.toString());
      }
    } else {
      setLocalValue('');
    }
  }, [value]);
  
  const handleLocalChange = (value: string) => {
    // Validate input to allow only numeric values
    // Allow: empty string, numbers, one decimal point, and minus sign at the beginning
    const isValidInput = /^-?\d*\.?\d*$/.test(value);
    
    if (!isValidInput && value !== '') {
      return; // Reject invalid input
    }
    
    // Only update local state on keystroke
    setLocalValue(value);
  };
  
  const commitValueChange = () => {
    // Only commit the value to the server when the user completes their input
    if (task.id) {
      // Store as a number (or empty string if invalid)
      const numValue = localValue.trim() === '' ? '' : localValue;
      updateValue(
        task.id,
        columnKey,
        numValue
      );
    }
  };

  const numberType = columnObj?.numberType || 'formatted';
  const decimals = columnObj?.decimals || 0;
  const label = columnObj?.label || '';
  const labelPosition = columnObj?.labelPosition || 'left';
  
  // Format the display value based on number type
  const getDisplayValue = () => {
    if (localValue === '') return '';
    const num = Number(localValue);
    if (isNaN(num)) return localValue;
    
    switch (numberType) {
      case 'formatted':
      case 'withLabel':
        return num.toFixed(decimals);
      case 'percentage':
        return `${num.toFixed(decimals)}%`;
      case 'unformatted':
      default:
        return localValue;
    }
  };

  switch (numberType) {
    case 'formatted':
      return (
        <Input
          value={getDisplayValue()}
          onChange={(e) => handleLocalChange(e.target.value)}
          onBlur={commitValueChange}
          onPressEnter={commitValueChange}
          style={{ padding: 0, border: 'none', background: 'transparent' }}
          onKeyDown={(e) => {
            // Allow: backspace, delete, tab, escape, enter, decimal point, minus sign
            if (
              ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', '.', '-'].includes(e.key) ||
              // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
              (['a', 'c', 'v', 'x'].includes(e.key) && (e.ctrlKey || e.metaKey)) ||
              // Allow: home, end, left, right, up, down
              ['Home', 'End', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)
            ) {
              // Allow these keys
              // For decimal point, only allow one
              if (e.key === '.' && (e.currentTarget.value.includes('.'))) {
                e.preventDefault();
              }
              // For minus sign, only allow at the beginning
              if (e.key === '-' && e.currentTarget.selectionStart !== 0) {
                e.preventDefault();
              }
              return;
            }
            
            // Block non-numeric keys
            if (!/^\d$/.test(e.key)) {
              e.preventDefault();
            }
          }}
        />
      );
    case 'withLabel':
      return (
        <Flex gap={4} align="center" justify="flex-start">
          {labelPosition === 'left' && label}
          <Input
            value={getDisplayValue()}
            onChange={(e) => handleLocalChange(e.target.value)}
            onBlur={commitValueChange}
            onPressEnter={commitValueChange}
            style={{
              padding: 0,
              border: 'none',
              background: 'transparent',
              width: '100%',
            }}
            onKeyDown={(e) => {
              // Allow: backspace, delete, tab, escape, enter, decimal point, minus sign
              if (
                ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', '.', '-'].includes(e.key) ||
                // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (['a', 'c', 'v', 'x'].includes(e.key) && (e.ctrlKey || e.metaKey)) ||
                // Allow: home, end, left, right, up, down
                ['Home', 'End', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)
              ) {
                // Allow these keys
                // For decimal point, only allow one
                if (e.key === '.' && (e.currentTarget.value.includes('.'))) {
                  e.preventDefault();
                }
                // For minus sign, only allow at the beginning
                if (e.key === '-' && e.currentTarget.selectionStart !== 0) {
                  e.preventDefault();
                }
                return;
              }
              
              // Block non-numeric keys
              if (!/^\d$/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
          {labelPosition === 'right' && label}
        </Flex>
      );
    case 'unformatted':
      return (
        <Input
          value={localValue}
          onChange={(e) => handleLocalChange(e.target.value)}
          onBlur={commitValueChange}
          onPressEnter={commitValueChange}
          style={{ padding: 0, border: 'none', background: 'transparent' }}
          onKeyDown={(e) => {
            // Allow: backspace, delete, tab, escape, enter, decimal point, minus sign
            if (
              ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', '.', '-'].includes(e.key) ||
              // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
              (['a', 'c', 'v', 'x'].includes(e.key) && (e.ctrlKey || e.metaKey)) ||
              // Allow: home, end, left, right, up, down
              ['Home', 'End', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)
            ) {
              // Allow these keys
              // For decimal point, only allow one
              if (e.key === '.' && (e.currentTarget.value.includes('.'))) {
                e.preventDefault();
              }
              // For minus sign, only allow at the beginning
              if (e.key === '-' && e.currentTarget.selectionStart !== 0) {
                e.preventDefault();
              }
              return;
            }
            
            // Block non-numeric keys
            if (!/^\d$/.test(e.key)) {
              e.preventDefault();
            }
          }}
        />
      );
    case 'percentage':
      return (
        <Input
          value={getDisplayValue()}
          onChange={(e) => {
            // Remove the % sign if present
            const value = e.target.value.replace('%', '');
            handleLocalChange(value);
          }}
          onBlur={commitValueChange}
          onPressEnter={commitValueChange}
          style={{ padding: 0, border: 'none', background: 'transparent' }}
          onKeyDown={(e) => {
            // Allow: backspace, delete, tab, escape, enter, decimal point
            if (
              ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', '.'].includes(e.key) ||
              // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
              (['a', 'c', 'v', 'x'].includes(e.key) && (e.ctrlKey || e.metaKey)) ||
              // Allow: home, end, left, right, up, down
              ['Home', 'End', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)
            ) {
              // Allow these keys
              // For decimal point, only allow one
              if (e.key === '.' && (e.currentTarget.value.includes('.'))) {
                e.preventDefault();
              }
              return;
            }
            
            // Block non-numeric keys
            if (!/^\d$/.test(e.key)) {
              e.preventDefault();
            }
          }}
        />
      );
    default:
      return <Typography.Text>Invalid number type</Typography.Text>;
  }
};

const FormulaFieldCell: React.FC<{ columnObj: any }> = ({ columnObj }) => {
  const calculateResult = () => {
    if (
      !columnObj?.firstNumericColumn ||
      !columnObj?.secondNumericColumn ||
      !columnObj?.expression
    ) {
      return null;
    }

    const operations = {
      add: () => columnObj?.firstNumericColumn + columnObj?.secondNumericColumn,
      subtract: () => columnObj?.firstNumericColumn - columnObj?.secondNumericColumn,
      multiply: () => columnObj?.firstNumericColumn * columnObj?.secondNumericColumn,
      divide: () =>
        columnObj?.secondNumericColumn !== 0
          ? columnObj?.firstNumericColumn / columnObj?.secondNumericColumn
          : null,
    };

    return operations[columnObj.expression as keyof typeof operations]?.() || null;
  };

  return <Typography.Text>{calculateResult() ?? 'Invalid Formula'}</Typography.Text>;
};

const LabelsFieldCell: React.FC<{ 
  labelsList: any[]; 
  selectedLabels: any[];
  task: IProjectTask;
  columnKey: string;
  updateValue: (taskId: string, columnKey: string, value: string) => void;
}> = ({ labelsList, selectedLabels, task, columnKey, updateValue }) => {
  return (
    <CustomColumnLabelCell 
      labelsList={labelsList} 
      selectedLabels={selectedLabels}
      onChange={(labels) => {
        if (task.id) {
          updateValue(
            task.id,
            columnKey,
            JSON.stringify(labels)
          );
        }
      }}
    />
  );
};

const SelectionFieldCell: React.FC<{ 
  selectionsList: any[]; 
  value: string;
  task: IProjectTask;
  columnKey: string;
  updateValue: (taskId: string, columnKey: string, value: string) => void;
}> = ({ selectionsList, value, task, columnKey, updateValue }) => {
  // Debug the selectionsList data
  const [loggedInfo, setLoggedInfo] = useState(false);

  useEffect(() => {
    if (!loggedInfo) {
      console.log('Selection column data:', {
        columnKey,
        selectionsList,
      });
      setLoggedInfo(true);
    }
  }, [columnKey, selectionsList, loggedInfo]);

  return (
    <CustomColumnSelectionCell 
      selectionsList={selectionsList} 
      value={value}
      onChange={(value) => {
        if (task.id) {
          updateValue(
            task.id,
            columnKey,
            value
          );
        }
      }}
    />
  );
};

// Now modify the renderCustomColumnContent function to use our new components
const renderCustomColumnContent = (
  columnObj: any,
  columnType: CustomFieldsTypes,
  task: IProjectTask,
  columnKey: string,
  updateTaskCustomColumnValue: (taskId: string, columnKey: string, value: string) => void
) => {
  // Get the custom column value from the task
  const customValue = task.custom_column_values?.[columnKey];

  // If columnType is not provided, try to determine it from columnObj
  const fieldType = columnType || columnObj?.fieldType;

  if (!fieldType) {
    console.warn('No field type provided for custom column', columnKey);
    return null;
  }

  // Pre-process values that need hooks - always call these hooks for all field types
  // This ensures hooks are always called in the same order
  const selectedMemberIds = useMemo(() => {
    if (fieldType === 'people' && customValue) {
      try {
        return customValue ? JSON.parse(customValue) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  }, [customValue, fieldType]);

  const selectedLabels = useMemo(() => {
    if (fieldType === 'labels' && customValue) {
      try {
        return customValue ? JSON.parse(customValue) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  }, [customValue, fieldType]);

  // Always use this memo regardless of field type to maintain consistent hook order
  const memoizedValue = useMemo(() => {
    return customValue || '';
  }, [customValue]);

  const customComponents: Record<CustomFieldsTypes, () => React.ReactNode> = {
    people: () => {
      // People component that uses the pre-processed selectedMemberIds
      const PeopleSelector = () => {
        const [isDropdownOpen, setIsDropdownOpen] = useState(false);
        const membersInputRef = useRef<InputRef>(null);
        const [searchQuery, setSearchQuery] = useState<string>('');
        const members = useAppSelector(state => state.teamMembersReducer.teamMembers);
        const themeMode = useAppSelector(state => state.themeReducer.mode);
        const { t } = useTranslation('task-list-table');
        const dispatch = useAppDispatch();

        const filteredMembersData = useMemo(() => {
          return members?.data?.filter(member =>
            member.name?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }, [members, searchQuery]);

        const handleInviteProjectMemberDrawer = () => {
          dispatch(toggleProjectMemberDrawer());
        };

        const handleMembersDropdownOpen = (open: boolean) => {
          setIsDropdownOpen(open);
          if (open) {
            setTimeout(() => {
              membersInputRef.current?.focus();
            }, 0);
          }
        };

        const handleMemberSelection = (memberId: string) => {
          // Toggle the selection of this member
          const newSelectedIds = selectedMemberIds.includes(memberId)
            ? selectedMemberIds.filter((id: string) => id !== memberId)
            : [...selectedMemberIds, memberId];
          
          // Update the custom column value
          if (task.id) {
            updateTaskCustomColumnValue(
              task.id,
              columnKey,
              JSON.stringify(newSelectedIds)
            );
          }
        };

        const membersDropdownContent = (
          <Card className="custom-card" styles={{ body: { padding: 8 } }}>
            <Flex vertical>
              <Input
                ref={membersInputRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.currentTarget.value)}
                placeholder={t('searchInputPlaceholder')}
              />

              <List style={{ padding: 0, height: 250, overflow: 'auto' }}>
                {filteredMembersData?.length ? (
                  filteredMembersData.map(member => (
                    <List.Item
                      className={`${themeMode === 'dark' ? 'custom-list-item dark' : 'custom-list-item'}`}
                      key={member.id || ''}
                      style={{
                        display: 'flex',
                        gap: 8,
                        justifyContent: 'flex-start',
                        padding: '4px 8px',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      onClick={() => member.id && handleMemberSelection(member.id)}
                    >
                      <Checkbox 
                        checked={member.id ? selectedMemberIds.includes(member.id) : false} 
                        onClick={e => e.stopPropagation()}
                        onChange={() => member.id && handleMemberSelection(member.id)}
                      />
                      <div>
                        <SingleAvatar
                          avatarUrl={member.avatar_url}
                          name={member.name}
                          email={member.email}
                        />
                      </div>
                      <Flex vertical>
                        <Typography.Text>{member.name}</Typography.Text>
                        <Typography.Text
                          style={{
                            fontSize: 12,
                            color: colors.lightGray,
                          }}
                        >
                          {member.email}
                        </Typography.Text>
                      </Flex>
                    </List.Item>
                  ))
                ) : (
                  <Empty />
                )}
              </List>

              <Divider style={{ marginBlock: 0 }} />

              <Button
                icon={<UsergroupAddOutlined />}
                type="text"
                style={{
                  color: colors.skyBlue,
                  border: 'none',
                  backgroundColor: colors.transparent,
                  width: '100%',
                }}
                onClick={handleInviteProjectMemberDrawer}
              >
                {t('assigneeSelectorInviteButton')}
              </Button>
            </Flex>
          </Card>
        );

        // Display selected members as avatars
        const selectedMembers = useMemo(() => {
          if (!members?.data || !selectedMemberIds.length) return [];
          return members.data.filter(member => selectedMemberIds.includes(member.id));
        }, [members, selectedMemberIds]);

        return (
          <Dropdown
            overlayClassName="custom-dropdown"
            trigger={['click']}
            dropdownRender={() => membersDropdownContent}
            onOpenChange={handleMembersDropdownOpen}
          >
            <Flex align="center" gap={4}>
              {selectedMembers.length > 0 ? (
                <Avatar.Group max={{count: 3}} size="small">
                  {selectedMembers.map(member => (
                    <Tooltip key={member.id} title={member.name}>
                      <Avatar 
                        src={member.avatar_url} 
                        style={{ fontSize: '14px' }}
                      >
                        {!member.avatar_url && member.name ? member.name.charAt(0).toUpperCase() : null}
                      </Avatar>
                    </Tooltip>
                  ))}
                </Avatar.Group>
              ) : null}
              <Button
                type="dashed"
                shape="circle"
                size="small"
                icon={
                  <PlusOutlined
                    style={{
                      fontSize: 12,
                      width: 22,
                      height: 22,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  />
                }
              />
            </Flex>
          </Dropdown>
        );
      };
      return <PeopleSelector />;
    },
    date: () => {
      const dateValue = customValue ? dayjs(customValue) : undefined;
      
      return (
        <DatePicker
          placeholder="Set Date"
          format="MMM DD, YYYY"
          suffixIcon={null}
          value={dateValue}
          onChange={(date) => {
            if (task.id) {
              // Format as ISO string for storage
              updateTaskCustomColumnValue(
                task.id,
                columnKey,
                date ? date.toISOString() : ''
              );
            }
          }}
          style={{
            backgroundColor: colors.transparent,
            border: 'none',
            boxShadow: 'none',
          }}
        />
      );
    },
    checkbox: () => {
      const isChecked = customValue === true || customValue === 'true';
      
      return (
        <Checkbox 
          checked={isChecked}
          onChange={(e) => {
            if (task.id) {
              updateTaskCustomColumnValue(
                task.id,
                columnKey,
                e.target.checked.toString()
              );
            }
          }}
        />
      );
    },
    key: () => {
      return (
        <Tooltip title={task.id} className="flex justify-center">
          <Tag>{task.id}</Tag>
        </Tooltip>
      );
    },
    number: () => {
      return (
        <NumberFieldCell 
          value={customValue} 
          task={task} 
          columnKey={columnKey} 
          columnObj={columnObj} 
          updateValue={updateTaskCustomColumnValue} 
        />
      );
    },
    formula: () => {
      return (
        <FormulaFieldCell columnObj={columnObj} />
      );
    },
    labels: () => {
      return (
        <LabelsFieldCell 
          labelsList={columnObj?.labelsList || []} 
          selectedLabels={selectedLabels}
          task={task} 
          columnKey={columnKey} 
          updateValue={updateTaskCustomColumnValue} 
        />
      );
    },
    selection: () => {
      // Debug the selectionsList data
      const [loggedInfo, setLoggedInfo] = useState(false);
    
      useEffect(() => {
        if (!loggedInfo) {
          console.log('Selection column data:', {
            columnKey,
            selectionsList: columnObj?.selectionsList,
          });
          setLoggedInfo(true);
        }
      }, [columnKey, loggedInfo]);
    
      return (
        <SelectionFieldCell 
          selectionsList={columnObj?.selectionsList || []} 
          value={memoizedValue}
          task={task} 
          columnKey={columnKey} 
          updateValue={updateTaskCustomColumnValue} 
        />
      );
    }
  };

  return customComponents[fieldType] ? customComponents[fieldType]() : null;
};

const TaskListTable: React.FC<TaskListTableProps> = ({ taskList, tableId, activeId }) => {
  const { t } = useTranslation('task-list-table');
  const dispatch = useAppDispatch();
  const currentSession = useAuthService().getCurrentSession();
  const { socket } = useSocket();

  const themeMode = useAppSelector(state => state.themeReducer.mode);
  const columnList = useAppSelector(state => state.taskReducer.columns);
  const visibleColumns = columnList.filter(column => column.pinned);
  const taskGroups = useAppSelector(state => state.taskReducer.taskGroups);
  const { project } = useAppSelector(state => state.projectReducer);
  const { selectedTaskIdsList, selectedTasks } = useAppSelector(state => state.bulkActionReducer);

  // Function to update custom column values
  const updateTaskCustomColumnValue = (taskId: string, columnKey: string, value: string) => {
    try {
      const projectId = project?.id;
      if (!projectId) {
        console.error('Project ID is missing');
        return;
      }

      // Prepare the data to send via socket
      const body = {
        task_id: taskId,
        column_key: columnKey,
        value: value,
        project_id: projectId,
      };

      // Emit socket event to update the custom column value
      if (socket) {
        socket.emit(SocketEvents.TASK_CUSTOM_COLUMN_UPDATE.toString(), JSON.stringify(body));
        console.log('Socket event emitted:', SocketEvents.TASK_CUSTOM_COLUMN_UPDATE.toString(), body);
      } else {
        console.warn('Socket not connected, unable to emit TASK_CUSTOM_COLUMN_UPDATE event');
      }

      // Update the task in the Redux store
      dispatch(
        updateCustomColumnValue({
          taskId,
          columnKey,
          value: String(value),
        })
      );
    } catch (error) {
      console.error('Error updating custom column value:', error);
    }
  };

  const isDarkMode = themeMode === 'dark';
  const customBorderColor = isDarkMode ? 'border-[#303030]' : '';

  const [isSelectAll, setIsSelectAll] = useState(false);
  const [scrollingTables, setScrollingTables] = useState<Record<string, boolean>>({});
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editColumnKey, setEditColumnKey] = useState<string | null>(null);

  const toggleTaskExpansion = (taskId: string) => {
    const task = displayTasks.find(t => t.id === taskId);
    if (task) {
      if (task.show_sub_tasks) {
        // If already expanded, just collapse it
        dispatch(toggleTaskRowExpansion(taskId));
      } else {
        // Only fetch subtasks if the task has subtasks
        if (task.sub_tasks && task.sub_tasks.length > 0) {
          dispatch(fetchSubTasks({ taskId, projectId: project?.id || '' }));
        }
        // Toggle expansion regardless of whether we fetch subtasks
        dispatch(toggleTaskRowExpansion(taskId));
      }
    }
  };

  const toggleSelectAll = () => {
    if (!taskList) return;
    const allTaskIds = taskList
      .flatMap(task => [task.id, ...(task.sub_tasks?.map(subtask => subtask.id) || [])])
      .filter(Boolean) as string[];

    if (isSelectAll) {
      const remainingTaskIds = selectedTaskIdsList.filter(id => !allTaskIds.includes(id));
      const remainingTasks = remainingTaskIds
        .map(id => findTaskInGroups(id) || taskList.find(t => t.id === id))
        .filter(Boolean) as IProjectTask[];
      dispatch(selectTaskIds(remainingTaskIds));
      dispatch(selectTasks(remainingTasks));
    } else {
      const updatedTaskIds = [...selectedTaskIdsList, ...allTaskIds];
      const uniqueTaskIds = Array.from(new Set(updatedTaskIds));
      const updatedTasks = uniqueTaskIds
        .map(id => findTaskInGroups(id) || taskList.find(t => t.id === id))
        .filter(Boolean) as IProjectTask[];
      dispatch(selectTaskIds(uniqueTaskIds));
      dispatch(selectTasks(updatedTasks));
    }
    setIsSelectAll(!isSelectAll);
  };

  const toggleRowSelection = (task: IProjectTask) => {
    if (!task.id) return;
    const taskIdsSet = new Set(selectedTaskIdsList);
    const selectedTasksSet = new Set(
      selectedTaskIdsList
        .map(id => findTaskInGroups(id) || taskList?.find(t => t.id === id))
        .filter(Boolean)
    );

    if (taskIdsSet.has(task.id)) {
      taskIdsSet.delete(task.id);
      selectedTasksSet.delete(task);
    } else {
      taskIdsSet.add(task.id);
      selectedTasksSet.add(task);
    }

    const taskIds = Array.from(taskIdsSet);
    const selectedTasks = Array.from(selectedTasksSet) as IProjectTask[];

    dispatch(selectTaskIds(taskIds));
    dispatch(selectTasks(selectedTasks));
  };

  const handleContextMenu = (e: React.MouseEvent, task: IProjectTask) => {
    if (!task.id) return;
    e.preventDefault();
    dispatch(selectTaskIds([task.id]));
    dispatch(selectTasks([task]));
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuVisible(true);
  };

  useEffect(() => {
    const tableContainer = document.querySelector<HTMLElement>(`.tasklist-container-${tableId}`);
    if (!tableContainer) return;

    const handleScroll = () => {
      if (tableContainer.scrollLeft > 0) {
        tableContainer.classList.add('scrolled');
      } else {
        tableContainer.classList.remove('scrolled');
      }
    };

    tableContainer.addEventListener('scroll', handleScroll);
    return () => tableContainer.removeEventListener('scroll', handleScroll);
  }, [tableId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if click is outside of any task cell
      if (!target.closest('[data-task-cell]')) {
        setEditingTaskId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getColumnStyles = (key: string | undefined, isHeader: boolean) => {
    if (!key) return '';

    const baseStyles = `border px-2 text-left`;
    const stickyStyles = (() => {
      switch (key) {
        case 'selector':
          return 'sticky left-0 z-20';
        case 'TASK':
          return `sticky left-[48px] z-10 after:content after:absolute after:top-0 after:-right-1 after:h-full after:-z-10 after:w-1.5 after:bg-transparent ${
            scrollingTables[tableId]
              ? 'after:bg-gradient-to-r after:from-[rgba(0,0,0,0.12)] after:to-transparent'
              : ''
          }`;
        default:
          return '';
      }
    })();

    const widthStyles = key === 'TASK' ? 'w-[474px]' : '';
    const heightStyles = isHeader ? 'after:h-[42px]' : 'after:min-h-[40px]';
    const themeStyles = isDarkMode
      ? `bg-${isHeader ? '[#1d1d1d]' : '[#141414]'} border-[#303030]`
      : `bg-${isHeader ? '[#fafafa]' : 'white'}`;

    return `${baseStyles} ${stickyStyles} ${heightStyles} ${themeStyles} ${widthStyles}`;
  };

  const renderColumnContent = (
    columnKey: string | undefined,
    task: IProjectTask,
    isSubtask: boolean = false
  ) => {
    if (!columnKey || !task) return null;
    const columnComponents = {
      KEY: () => <TaskListTaskIdCell taskId={task.task_key || ''} />,
      TASK: () => (
        <TaskListTaskCell
          task={task}
          isSubTask={isSubtask}
          projectId={project?.id || ''}
          toggleTaskExpansion={toggleTaskExpansion}
        />
      ),
      DESCRIPTION: () => <TaskListDescriptionCell description={task.description || ''} />,
      PROGRESS: () => <TaskListProgressCell task={task} />,
      ASSIGNEES: () => <TaskListMembersCell groupId={tableId} task={task} />,
      LABELS: () => <TaskListLabelsCell task={task} />,
      PHASE: () => <PhaseDropdown task={task} />,
      STATUS: () => <StatusDropdown task={task} teamId={currentSession?.team_id || ''} />,
      PRIORITY: () => <PriorityDropdown task={task} teamId={currentSession?.team_id || ''} />,
      TIME_TRACKING: () => <TaskListTimeTrackerCell task={task} />,
      ESTIMATION: () => <TaskListEstimationCell task={task} />,
      START_DATE: () => <TaskListStartDateCell task={task} />,
      DUE_DATE: () => <TaskListDueDateCell task={task} />,
      DUE_TIME: () => <TaskListDueTimeCell />,
      COMPLETED_DATE: () => <TaskListCompletedDateCell completedDate={task.completed_at || null} />,
      CREATED_DATE: () => <TaskListCreatedDateCell createdDate={task.created_at || null} />,
      LAST_UPDATED: () => <TaskListLastUpdatedCell lastUpdated={task.updated_at || null} />,
      REPORTER: () => <TaskListReporterCell task={task} />,
    };

    const component = columnComponents[columnKey as keyof typeof columnComponents]?.();
    return component;
  };

  const getRowBackgroundColor = (taskId: string | undefined) => {
    if (!taskId) return isDarkMode ? '#181818' : '#fff';
    return selectedTaskIdsList.includes(taskId)
      ? isDarkMode
        ? '#000'
        : '#dceeff'
      : isDarkMode
        ? '#181818'
        : '#fff';
  };

  const findTaskInGroups = (taskId: string) => {
    for (const group of taskGroups) {
      const task = group.tasks.find(t => t.id === taskId);
      if (task) return task;
    }
    return null;
  };

  // Now update the renderTaskRow function to use our memoized component
  const renderTaskRow = (task: IProjectTask | undefined, isSubtask = false) => {
    if (!task?.id) return null;

    return (
      <DraggableRow key={task.id} task={task} groupId={tableId}>
        {(attributes, listeners) => (
          <>
            <td
              className={getColumnStyles('selector', false)}
              style={{
                width: 56,
                backgroundColor: selectedTaskIdsList.includes(task.id || '')
                  ? isDarkMode
                    ? colors.skyBlue
                    : '#dceeff'
                  : isDarkMode
                    ? '#181818'
                    : '#fff',
              }}
            >
              <Flex gap={8} align="center" justify={isSubtask ? 'flex-end' : 'flex-start'}>
                {!isSubtask && (
                  <div {...attributes} {...listeners}>
                    <HolderOutlined style={{ cursor: 'grab' }} />
                  </div>
                )}
                <Checkbox
                  checked={selectedTaskIdsList.includes(task.id || '')}
                  onChange={() => toggleRowSelection(task)}
                />
              </Flex>
            </td>
            {visibleColumns.map(column => (
              <td
                key={column.key}
                className={getColumnStyles(column.key, false)}
                style={{
                  backgroundColor: getRowBackgroundColor(task.id),
                  minWidth: column.custom_column ? '120px' : undefined,
                }}
                data-task-cell
                onContextMenu={e => handleContextMenu(e, task)}
              >
                <CustomCell 
                  column={column} 
                  task={task} 
                  isSubtask={isSubtask} 
                  renderCustomColumnContent={renderCustomColumnContent} 
                  renderColumnContent={renderColumnContent}
                  updateTaskCustomColumnValue={updateTaskCustomColumnValue}
                />
              </td>
            ))}
          </>
        )}
      </DraggableRow>
    );
  };

  // Get the tasks from the taskGroups state
  const currentGroup = taskGroups.find(group => group.id === tableId);

  // Use the tasks from the current group if available, otherwise fall back to taskList prop
  const displayTasks = currentGroup?.tasks || taskList || [];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIndex = displayTasks.findIndex(task => task.id === active.id);
    const overIndex = displayTasks.findIndex(task => task.id === over.id);

    if (activeIndex !== -1 && overIndex !== -1) {
      dispatch(
        reorderTasks({
          activeGroupId: tableId,
          overGroupId: tableId,
          fromIndex: activeIndex,
          toIndex: overIndex,
          task: displayTasks[activeIndex],
          updatedSourceTasks: displayTasks,
          updatedTargetTasks: displayTasks,
        })
      );
    }
  };

  const handleCustomColumnSettings = (columnKey: string) => {   
    console.log('columnKey', columnKey);
    if (!columnKey) return;
    setEditColumnKey(columnKey);
    dispatch(setCustomColumnModalAttributes({modalType: 'edit', columnId: columnKey}));
    dispatch(toggleCustomColumnModalOpen(true));
  };

  return (
    <div className={`border-x border-b ${customBorderColor}`}>
      <SortableContext
        items={(displayTasks?.map(t => t.id).filter(Boolean) || []) as string[]}
        strategy={verticalListSortingStrategy}
      >
        <div className={`tasklist-container-${tableId} min-h-0 max-w-full overflow-x-auto`}>
          <table className="rounded-2 w-full min-w-max border-collapse relative">
            <thead className="h-[42px]">
              <tr>
                <th
                  className={getColumnStyles('selector', true)}
                  style={{ width: 56, fontWeight: 500 }}
                >
                  <Flex justify="flex-start" style={{ marginInlineStart: 22 }}>
                    <Checkbox checked={isSelectAll} onChange={toggleSelectAll} />
                  </Flex>
                </th>
                {visibleColumns.map(column => (
                  <th
                    key={column.key}
                    className={getColumnStyles(column.key, true)}
                    style={{ fontWeight: 500 }}
                  >
                    <Flex align="center" gap={4}>
                      {column.key === 'PHASE' && (
                        <Flex
                          align="center"
                          gap={4}
                          justify="space-between"
                          className="w-full min-w-[120px]"
                        >
                          {project?.phase_label}
                          <ConfigPhaseButton />
                        </Flex>
                      )}
                      {column.key !== 'PHASE' &&
                        (column.custom_column ? (
                          <CustomColumnHeader
                            column={column}
                            onSettingsClick={() => handleCustomColumnSettings(column.id || '')}
                          />
                        ) : (
                          t(`${column.key?.replace('_', '').toLowerCase()}Column`)
                        ))}
                    </Flex>
                  </th>
                ))}
                <th className={getColumnStyles('customColumn', true)}>
                  <Flex justify="flex-start" style={{ marginInlineStart: 22 }}>
                    <AddCustomColumnButton />
                  </Flex>
                </th>
              </tr>
            </thead>
            <tbody>
              {displayTasks && displayTasks.length > 0 ? (
                displayTasks.map(task => {
                  const updatedTask = findTaskInGroups(task.id || '') || task;

                  return (
                    <React.Fragment key={updatedTask.id}>
                      {renderTaskRow(updatedTask)}
                      {updatedTask.show_sub_tasks && (
                        <>
                          {updatedTask?.sub_tasks?.map(subtask => renderTaskRow(subtask, true))}
                            <tr>
                            <td colSpan={visibleColumns.length + 1}>
                              <AddTaskListRow groupId={tableId} parentTask={updatedTask.id} />
                            </td>
                            </tr>
                        </>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={visibleColumns.length + 1} className="ps-2 py-2">
                    {t('noTasksAvailable', 'No tasks available')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SortableContext>

      <DragOverlay
        dropAnimation={{
          duration: 200,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}
      >
        {activeId && displayTasks?.length ? (
          <table className="w-full">
            <tbody>{renderTaskRow(displayTasks.find(t => t.id === activeId))}</tbody>
          </table>
        ) : null}
      </DragOverlay>

      <AddTaskListRow groupId={tableId} />

      {createPortal(
        <TaskContextMenu
          visible={contextMenuVisible}
          position={contextMenuPosition}
          selectedTask={selectedTasks[0]}
          onClose={() => setContextMenuVisible(false)}
          t={t}
        />,
        document.body,
        'task-context-menu'
      )}
      {createPortal(<CustomColumnModal />, document.body, 'custom-column-modal')}
    </div>
  );
};

export default TaskListTable;
