import { useAppSelector } from '@/hooks/useAppSelector';
import { useSelectedProject } from '@/hooks/useSelectedProject';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import {
  Checkbox,
  DatePicker,
  Flex,
  Input,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { HolderOutlined } from '@ant-design/icons';
import { colors } from '@/styles/colors';
import TaskContextMenu from './context-menu/task-context-menu';
import AddTaskListRow from './task-list-table-rows/add-task-list-row';
import AddSubTaskListRow from './task-list-table-rows/add-sub-task-list-row';
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
import PhaseDropdown from '@/components/taskListCommon/phaseDropdown/PhaseDropdown';
import AssigneeSelector from '@/components/taskListCommon/assigneeSelector/AssigneeSelector';
import { ITaskLabel } from '@/types/tasks/taskLabel.types';
import { IProjectTask } from '@/types/project/projectTasksViewModel.types';
import { CustomFieldsTypes } from '@/features/projects/singleProject/task-list-custom-columns/task-list-custom-columns-slice';
import { SelectionType } from './custom-columns/custom-column-modal/selection-type-column/selection-type-column';
import {
  deselectAll,
  selectTaskIds,
} from '@/features/projects/bulkActions/bulkActionSlice';
import StatusDropdown from '@/components/task-list-common/statusDropdown/StatusDropdown';
import PriorityDropdown from '@/components/task-list-common/priorityDropdown/PriorityDropdown';

const TaskListTable = ({
  taskList,
  tableId,
}: {
  taskList: IProjectTask[] | null;
  tableId: string;
}) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [expandedTasks, setExpandedTasks] = useState<string[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [scrollingTables, setScrollingTables] = useState<{
    [key: string]: boolean;
  }>({});

  const { t } = useTranslation('task-list-table');
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.themeReducer.mode);
  const selectedProject = useSelectedProject();
  const columnList = useAppSelector(
    (state) => state.projectViewTaskListColumnsReducer.columnList
  );
  const visibleColumns = columnList.filter((column) => column.isVisible);

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const toggleSelectAll = () => {
    if (isSelectAll) {
      setSelectedRows([]);
      dispatch(deselectAll());
    } else {
      const allTaskIds =
        taskList?.flatMap((task) => [
          task.id,
          ...(task.sub_tasks?.map((subtask: IProjectTask) => subtask.id) || []),
        ]) || [];

      setSelectedRows(allTaskIds);
      dispatch(selectTaskIds(allTaskIds));
    }
    setIsSelectAll(!isSelectAll);
  };

  const toggleRowSelection = (task: IProjectTask) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(task.id || '')
        ? prevSelectedRows.filter((id) => id !== task.id)
        : [...prevSelectedRows, task.id || '']
    );
  };

  useEffect(() => {
    // console.log('Selected tasks and subtasks:', selectedRows);
  }, [selectedRows]);

  const selectOneRow = (task: IProjectTask) => {
    if (!task.id) return;
    setSelectedRows([task.id]);

    // log the task object when selected
    if (!selectedRows.includes(task.id || '')) {
      // console.log('Selected task:', task);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, task: IProjectTask) => {
    if (!task.id) return;
    e.preventDefault();
    setSelectedTaskId(task.id);
    selectOneRow(task);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuVisible(true);
  };

  useEffect(() => {
    const tableContainer = document.querySelector(
      `.tasklist-container-${tableId}`
    );
    const handleScroll = () => {
      if (tableContainer) {
        setScrollingTables((prev) => ({
          ...prev,
          [tableId]: tableContainer.scrollLeft > 0,
        }));
      }
    };
    tableContainer?.addEventListener('scroll', handleScroll);
    return () => tableContainer?.removeEventListener('scroll', handleScroll);
  }, [tableId]);

  const customBorderColor = themeMode === 'dark' && ' border-[#303030]';

  const customHeaderColumnStyles = (key: string) =>
    `border px-2 text-left ${key === 'selector' && 'sticky left-0 z-10'} ${key === 'task' && `sticky left-[48px] z-10 after:content after:absolute after:top-0 after:-right-1 after:-z-10  after:h-[42px] after:w-1.5 after:bg-transparent ${scrollingTables[tableId] ? 'after:bg-gradient-to-r after:from-[rgba(0,0,0,0.12)] after:to-transparent' : ''}`} ${themeMode === 'dark' ? 'bg-[#1d1d1d] border-[#303030]' : 'bg-[#fafafa]'}`;

  const customBodyColumnStyles = (key: string) =>
    `border px-2 ${key === 'selector' && 'sticky left-0 z-10'} ${key === 'task' && `sticky left-[48px] z-10 after:content after:absolute after:top-0 after:-right-1 after:-z-10  after:min-h-[40px] after:w-1.5 after:bg-transparent ${scrollingTables[tableId] ? 'after:bg-gradient-to-r after:from-[rgba(0,0,0,0.12)] after:to-transparent' : ''}`} ${themeMode === 'dark' ? 'bg-[#141414] border-[#303030]' : 'bg-white'}`;

  const renderColumnContent = (
    columnKey: string,
    task: IProjectTask,
    isSubtask: boolean = false
  ) => {
    switch (columnKey) {
      case 'taskId':
        return <TaskListTaskIdCell taskId={task.id || ''} />;
      case 'task':
        return (
          <TaskListTaskCell
            task={task}
            isSubTask={isSubtask}
            expandedTasks={expandedTasks}
            setSelectedTaskId={setSelectedTaskId}
            toggleTaskExpansion={toggleTaskExpansion}
          />
        );
      case 'description':
        return (
          <TaskListDescriptionCell description={task?.description || ''} />
        );
      case 'progress': {
        return (
          <TaskListProgressCell
            progress={task?.progress || 0}
            numberOfSubTasks={task?.sub_tasks?.length || 0}
          />
        );
      }
      case 'members':
        return (
          <TaskListMembersCell
            members={task?.assignees || []}
            selectedTaskId={selectedTaskId}
          />
        );
      case 'labels':
        return (
          <TaskListLabelsCell
            labels={task?.labels || []}
            taskId={task.id || ''}
          />
        );
      case 'phases':
        return <PhaseDropdown projectId={selectedProject?.id || ''} />;
      case 'status':
        return <StatusDropdown task={task} teamId={selectedProject?.team_id || ''} />;
      case 'priority':
        return <PriorityDropdown task={task} teamId={selectedProject?.team_id || ''} />;
      case 'timeTracking':
        return (
          <TaskListTimeTrackerCell
            taskId={task.id || ''}
            initialTime={task?.time_spent || 0}
          />
        );
      case 'estimation':
        return <TaskListEstimationCell />;
      case 'startDate':
        return <TaskListStartDateCell startDate={task?.start_date || null} />;
      case 'dueDate':
        return <TaskListDueDateCell dueDate={task?.end_date || null} />;
      case 'dueTime':
        return <TaskListDueTimeCell />;
      case 'completedDate':
        return (
          <TaskListCompletedDateCell
            completedDate={task?.completed_at || null}
          />
        );
      case 'createdDate':
        return (
          <TaskListCreatedDateCell createdDate={task?.created_at || null} />
        );
      case 'lastUpdated':
        return (
          <TaskListLastUpdatedCell lastUpdated={task?.updated_at || null} />
        );
      case 'reporter':
        return <TaskListReporterCell />;
      default:
        return null;
    }
  };

  const renderCustomColumnContent = (
    columnObj: any,
    columnType: CustomFieldsTypes,
    task: IProjectTask
  ) => {
    switch (columnType) {
      case 'people':
        return <AssigneeSelector taskId={task.id || ''} />;
      case 'date':
        return (
          <DatePicker
            placeholder="Set  Date"
            format={'MMM DD, YYYY'}
            suffixIcon={null}
            style={{
              backgroundColor: colors.transparent,
              border: 'none',
              boxShadow: 'none',
            }}
          />
        );
      case 'checkbox':
        return <Checkbox />;
      case 'key':
        return (
          <Tooltip title={task.id || ''} className="flex justify-center">
            <Tag>{task.id || ''}</Tag>
          </Tooltip>
        );
      case 'number': {
        switch (columnObj?.numberType) {
          case 'formatted':
            return (
              <Input
                defaultValue={columnObj?.previewValue.toFixed(
                  columnObj?.decimals
                )}
                style={{
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                }}
              />
            );
          case 'withLabel':
            return (
              <Flex gap={4} align="center" justify="flex-start">
                {columnObj?.labelPosition === 'left' && columnObj?.label}
                <Input
                  defaultValue={columnObj?.previewValue.toFixed(
                    columnObj?.decimals
                  )}
                  style={{
                    padding: 0,
                    border: 'none',
                    background: 'transparent',
                    width: '100%',
                  }}
                />
                {columnObj?.labelPosition === 'right' && columnObj?.label}
              </Flex>
            );
          case 'unformatted':
            return (
              <Input
                defaultValue={columnObj?.previewValue}
                style={{
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                }}
              />
            );
          case 'percentage':
            return (
              <Input
                defaultValue={
                  columnObj?.previewValue.toFixed(columnObj?.decimals) + '%'
                }
                style={{
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                }}
              />
            );
          default:
            return null;
        }
      }
      case 'formula': {
        const firstColumnId = columnObj?.firstNumericColumn;
        const secondColumnId = columnObj?.secondNumericColumn;

        console.log('first column', firstColumnId);
        console.log('second column', secondColumnId);

        const calculateResult = () => {
          if (
            columnObj?.firstNumericColumn == null ||
            columnObj?.secondNumericColumn == null ||
            !columnObj?.expression
          ) {
            return null;
          }

          switch (columnObj.expression) {
            case 'add':
              return (
                columnObj.firstNumericColumn + columnObj.secondNumericColumn
              );
            case 'substract':
              return (
                columnObj.firstNumericColumn - columnObj.secondNumericColumn
              );
            case 'multiply':
              return (
                columnObj.firstNumericColumn * columnObj.secondNumericColumn
              );
            case 'divide':
              return columnObj.secondNumericColumn !== 0
                ? columnObj.firstNumericColumn / columnObj.secondNumericColumn
                : null;
            default:
              return null;
          }
        };
        return (
          <Typography.Text>
            {calculateResult() ?? 'Invalid Formula'}
          </Typography.Text>
        );
      }
      case 'labels': {
        const labelsList: ITaskLabel[] = columnObj?.labelsList || [];
        return <CustomColumnLabelCell labelsList={labelsList} />;
      }
      case 'selection': {
        const selectionsList: SelectionType[] = columnObj?.selectionsList || [];

        return <CustomColumnSelectionCell selectionsList={selectionsList} />;
      }

      default:
        return null;
    }
  };

  return (
    <div className={`border-x border-b ${customBorderColor}`}>
      <div
        className={`tasklist-container-${tableId} min-h-0 max-w-full overflow-x-auto`}
      >
        <table className={`rounded-2 w-full min-w-max border-collapse`}>
          <thead className="h-[42px]">
            <tr>
              <th
                key={'selector'}
                className={`${customHeaderColumnStyles('selector')}`}
                style={{ width: 56, fontWeight: 500 }}
              >
                <Flex justify="flex-start" style={{ marginInlineStart: 22 }}>
                  <Checkbox checked={isSelectAll} onChange={toggleSelectAll} />
                </Flex>
              </th>
              {visibleColumns.map((column) => (
                <th
                  key={column.key}
                  className={`${customHeaderColumnStyles(column.key)}`}
                  style={{ width: column.width, fontWeight: 500 }}
                >
                  {column.key === 'phases' ||
                  column.key === 'customColumn' ||
                  column.isCustomColumn
                    ? column.columnHeader
                    : t(`${column.columnHeader}Column`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {taskList?.map((task) => (
              <React.Fragment key={task.id}>
                <tr
                  key={task.id}
                  onContextMenu={(e) => handleContextMenu(e, task)}
                  className={`${taskList.length === 0 ? 'h-0' : 'h-[42px]'} task-row`}
                >
                  <td
                    key={'selector'}
                    className={customBodyColumnStyles('selector')}
                    style={{
                      width: 56,
                      backgroundColor: selectedRows.includes(task.id || '')
                        ? themeMode === 'dark'
                          ? colors.skyBlue
                          : '#dceeff'
                        : themeMode === 'dark'
                          ? '#181818'
                          : '#fff',
                    }}
                  >
                    <Flex gap={8} align="center">
                      <HolderOutlined />
                      <Checkbox
                        checked={selectedRows.includes(task.id || '')}
                        onChange={() => toggleRowSelection(task)}
                      />
                    </Flex>
                  </td>
                  {visibleColumns.map((column) => (
                    <td
                      key={column.key}
                      className={customBodyColumnStyles(column.key)}
                      style={{
                        width: column.width,
                        backgroundColor: selectedRows.includes(task.id || '')
                          ? themeMode === 'dark'
                            ? '#000'
                            : '#dceeff'
                          : themeMode === 'dark'
                            ? '#181818'
                            : '#fff',
                      }}
                    >
                      {column.isCustomColumn
                        ? renderCustomColumnContent(
                            column.customColumnObj,
                            column.customColumnObj.fieldType,
                            task
                          )
                        : renderColumnContent(column.key, task)}
                    </td>
                  ))}
                </tr>

                {expandedTasks.includes(task.id || '') &&
                  task?.sub_tasks?.map((subtask) => (
                    <tr
                      key={subtask.id}
                      onContextMenu={(e) => handleContextMenu(e, subtask)}
                      className={`${taskList.length === 0 ? 'h-0' : 'h-[42px]'} task-row`}
                    >
                      <td
                        key={'selector'}
                        className={customBodyColumnStyles('selector')}
                        style={{
                          width: 20,
                          backgroundColor: selectedRows.includes(subtask.id || '')
                            ? themeMode === 'dark'
                              ? colors.skyBlue
                              : '#dceeff'
                            : themeMode === 'dark'
                              ? '#181818'
                              : '#fff',
                        }}
                      >
                        <Flex style={{ marginInlineStart: 22 }}>
                          <Checkbox
                            checked={selectedRows.includes(subtask.id || '')}
                            onChange={() => toggleRowSelection(subtask)}
                          />
                        </Flex>
                      </td>

                      {/* other sub tasks cells  */}
                      {visibleColumns.map((column) => (
                        <td
                          key={column.key}
                          className={customBodyColumnStyles(column.key)}
                          style={{
                            width: column.width,
                            backgroundColor: selectedRows.includes(
                              subtask.id || ''
                            )
                              ? themeMode === 'dark'
                                ? '#000'
                                : '#dceeff'
                              // : hoverRow === subtask.id
                              //   ? themeMode === 'dark'
                              //     ? '#000'
                              //     : '#f8f7f9'
                                : themeMode === 'dark'
                                  ? '#181818'
                                  : '#fff',
                          }}
                        >
                          {renderColumnContent(column.key, subtask, true)}
                        </td>
                      ))}
                    </tr>
                  ))}

                {expandedTasks.includes(task.id || '') && (
                  <tr>
                    <td colSpan={visibleColumns.length}>
                      <AddSubTaskListRow />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* add a main task to the table  */}
      <AddTaskListRow groupId={tableId}/>

      {/* custom task context menu  */}
      <TaskContextMenu
        visible={contextMenuVisible}
        position={contextMenuPosition}
        selectedTask={selectedRows[0]}
        onClose={() => setContextMenuVisible(false)}
      />
    </div>
  );
};

export default TaskListTable;
