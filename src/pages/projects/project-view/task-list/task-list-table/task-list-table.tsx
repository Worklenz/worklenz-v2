import { useAppSelector } from '../../../../../hooks/useAppSelector';
import AddTaskListRow from './task-list-table-rows/add-task-list-row';
import { TaskType } from '../../../../../types/task.types';
import {
  Checkbox,
  DatePicker,
  Flex,
  Input,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelectedProject } from '../../../../../hooks/useSelectedProject';
import StatusDropdown from '../../../../../components/taskListCommon/statusDropdown/StatusDropdown';
import PriorityDropdown from '../../../../../components/taskListCommon/priorityDropdown/PriorityDropdown';
import PhaseDropdown from '../../../../../components/taskListCommon/phaseDropdown/PhaseDropdown';
import AssigneeSelector from '../../../../../components/taskListCommon/assigneeSelector/AssigneeSelector';
import AddSubTaskListRow from './task-list-table-rows/add-sub-task-list-row';
import { colors } from '../../../../../styles/colors';
import TaskContextMenu from './context-menu/task-context-menu';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import {
  deselectAll,
  selectTaskIds,
} from '../../../../../features/projects/bulkActions/bulkActionSlice';
import { useTranslation } from 'react-i18next';
import { IProjectTask } from '@/types/project/projectTasksViewModel.types';
import { ITaskListGroup } from '@/types/tasks/taskList.types';
import { HolderOutlined } from '@ant-design/icons';
import CustomColumnLabelCell from './custom-columns/custom-column-cells/custom-column-label-cell/custom-column-label-cell';
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
import { CustomFieldsTypes } from '../../../../../features/projects/singleProject/task-list-custom-columns/task-list-custom-columns-slice';
import { LabelType } from '../../../../../types/label.type';
import CustomColumnSelectionCell from './custom-columns/custom-column-cells/custom-column-selection-cell/custom-column-selection-cell';
import { SelectionType } from './custom-columns/custom-column-modal/selection-type-column/selection-type-column';

const TaskListTable = ({
  taskList,
  tableId,
}: {
  taskList: ITaskListGroup;
  tableId: string | undefined;
}) => {
  // these states manage the necessary states
  const [hoverRow, setHoverRow] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [expandedTasks, setExpandedTasks] = useState<string[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  // context menu state
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  // state to check scroll
  const [scrollingTables, setScrollingTables] = useState<{
    [key: string]: boolean;
  }>({});

  // localization
  const { t } = useTranslation('task-list-table');

  const dispatch = useAppDispatch();

  // get data theme data from redux
  const themeMode = useAppSelector(state => state.themeReducer.mode);

  // get the selected project details
  const selectedProject = useSelectedProject();

  // get columns list details
  const columnList = useAppSelector(
    (state) => state.projectViewTaskListColumnsReducer.columnList
  );
  const visibleColumns = columnList.filter((column) => column.isVisible);

  // toggle subtasks visibility
  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks(prev =>
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  // toggle all task select  when header checkbox click
  const toggleSelectAll = () => {
    if (isSelectAll) {
      setSelectedRows([]);
      dispatch(deselectAll());
    } else {
      const allTaskIds =
        taskList?.flatMap((task) => [
          task.taskId,
          ...(task.subTasks?.map((subtask) => subtask.taskId) || []),
        ]) || [];

      setSelectedRows(allTaskIds);
      dispatch(selectTaskIds(allTaskIds));
      // console.log('selected tasks and subtasks (all):', allTaskIds);
    }
    setIsSelectAll(!isSelectAll);
  };

  // toggle selected row
  const toggleRowSelection = (task: IProjectTask) => {
    setSelectedRows(prevSelectedRows =>
      prevSelectedRows.includes(task.id || '')
        ? prevSelectedRows.filter(id => id !== task.id)
        : [...prevSelectedRows, task.id || '']
    );
  };

  // this use effect for realtime update the selected rows
  useEffect(() => {
    // console.log('Selected tasks and subtasks:', selectedRows);
  }, [selectedRows]);

  // select one row this triggers only in handle the context menu ==> righ click mouse event
  const selectOneRow = (task: IProjectTask) => {
    setSelectedRows([task.id || '']);

    // log the task object when selected
    if (!selectedRows.includes(task.taskId)) {
      // console.log('Selected task:', task);
    }
  };

  // handle custom task context menu
  const handleContextMenu = (e: React.MouseEvent, task: IProjectTask) => {
    e.preventDefault();
    setSelectedTaskId(task.id || '');
    selectOneRow(task);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuVisible(true);
  };

  // trigger the table scrolling
  useEffect(() => {
    const tableContainer = document.querySelector(`.tasklist-container-${tableId}`);
    const handleScroll = () => {
      if (tableContainer) {
        setScrollingTables(prev => ({
          ...prev,
          [tableId]: tableContainer.scrollLeft > 0,
        }));
      }
    };
    tableContainer?.addEventListener('scroll', handleScroll);
    return () => tableContainer?.removeEventListener('scroll', handleScroll);
  }, [tableId]);

  // layout styles for table and the columns
  const customBorderColor = themeMode === 'dark' && ' border-[#303030]';

  const customHeaderColumnStyles = (key: string) =>
    `border px-2 text-left ${key === 'selector' && 'sticky left-0 z-10'} ${key === 'task' && `sticky left-[48px] z-10 after:content after:absolute after:top-0 after:-right-1 after:-z-10  after:h-[42px] after:w-1.5 after:bg-transparent ${scrollingTables[tableId] ? 'after:bg-gradient-to-r after:from-[rgba(0,0,0,0.12)] after:to-transparent' : ''}`} ${themeMode === 'dark' ? 'bg-[#1d1d1d] border-[#303030]' : 'bg-[#fafafa]'}`;

  const customBodyColumnStyles = (key: string) =>
    `border px-2 ${key === 'selector' && 'sticky left-0 z-10'} ${key === 'task' && `sticky left-[48px] z-10 after:content after:absolute after:top-0 after:-right-1 after:-z-10  after:min-h-[40px] after:w-1.5 after:bg-transparent ${scrollingTables[tableId] ? 'after:bg-gradient-to-r after:from-[rgba(0,0,0,0.12)] after:to-transparent' : ''}`} ${themeMode === 'dark' ? 'bg-[#141414] border-[#303030]' : 'bg-white'}`;

  // function to render the column content based on column key===================================================================================
  const renderColumnContent = (
    columnKey: string,
    task: IProjectTask,
    isSubtask: boolean = false
  ) => {
    switch (columnKey) {
      // task ID column
      case 'taskId':
        return <TaskListTaskIdCell taskId={task.taskId} />;
      // task column
      case 'task':
        return (
          // custom task cell component
          <TaskListTaskCell
            task={task}
            isSubTask={isSubtask}
            expandedTasks={expandedTasks}
            hoverRow={hoverRow}
            setSelectedTaskId={setSelectedTaskId}
            toggleTaskExpansion={toggleTaskExpansion}
          />
        );
      // description column
      case 'description':
        return (
          <TaskListDescriptionCell description={task?.description || ''} />
        );
      // progress column
      case 'progress': {
        return (
          <TaskListProgressCell
            progress={task?.progress || 0}
            numberOfSubTasks={task?.subTasks?.length || 0}
          />
        );
      }
      // members column
      case 'members':
        return (
          <TaskListMembersCell
            members={task?.members || []}
            selectedTaskId={selectedTaskId}
          />
        );
      // labels column
      case 'labels':
        return (
          <TaskListLabelsCell
            labels={task?.labels || []}
            taskId={task.taskId}
          />
        );
      // phase column
      case 'phases':
        return <PhaseDropdown projectId={selectedProject?.projectId || ''} />; // this is from a common component
      // status column
      case 'status':
        return <StatusDropdown currentStatus={task?.status} />; // this is from a common component
      // priority column
      case 'priority':
        return <PriorityDropdown currentPriority={task?.priority} />; // this is from a common component
      // time tracking column
      case 'timeTracking':
        return (
          <TaskListTimeTrackerCell
            taskId={task.taskId}
            initialTime={task?.timeTracking || 0}
          />
        );
      // estimation column
      case 'estimation':
        return <TaskListEstimationCell />;
      // start date column
      case 'startDate':
        return <TaskListStartDateCell startDate={task?.startDate || null} />;
      // due date column
      case 'dueDate':
        return <TaskListDueDateCell dueDate={task?.dueDate || null} />;
      // completed date column
      case 'completedDate':
        return (
          <TaskListCompletedDateCell
            completedDate={task?.completedDate || null}
          />
        );
      // created date column
      case 'createdDate':
        return (
          <TaskListCreatedDateCell createdDate={task?.createdDate || null} />
        );
      // last updated column
      case 'lastUpdated':
        return (
          <TaskListLastUpdatedCell lastUpdated={task?.lastUpdated || null} />
        );
      // recorder column
      case 'reporter':
        return <TaskListReporterCell />;
      // default case for unsupported columns
      default:
        return null;
    }
  };

  // function to render custom column cells =======================================================================================================
  const renderCustomColumnContent = (
    columnObj: any,
    columnType: CustomFieldsTypes,
    task: TaskType
  ) => {
    switch (columnType) {
      case 'people':
        return <AssigneeSelector taskId={task.taskId} />;
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
          <Tooltip title={task.taskId} className="flex justify-center">
            <Tag>{task.taskId}</Tag>
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
        const labelsList: LabelType[] = columnObj?.labelsList || [];

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

  // table structure==============================================================================================================
  return (
    <div className={`border-x border-b ${customBorderColor}`}>
      <div className={`tasklist-container-${tableId} min-h-0 max-w-full overflow-x-auto`}>
        <table className={`rounded-2 w-full min-w-max border-collapse`}>
          <thead className="h-[42px]">
            <tr>
              {/* this cell render the select all task checkbox  */}
              <th
                key={'selector'}
                className={`${customHeaderColumnStyles('selector')}`}
                style={{ width: 20, fontWeight: 500 }}
              >
                <Flex justify="flex-start" style={{ marginInlineStart: 22 }}>
                  <Checkbox checked={isSelectAll} onChange={toggleSelectAll} />
                </Flex>
              </th>
              {/* other header cells  */}
              {visibleColumns.map(column => (
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
            {taskList?.tasks?.map(task => (
              <React.Fragment key={task.id}>
                <tr
                  key={task.id}
                  onContextMenu={e => handleContextMenu(e, task)}
                  className={`${taskList.tasks.length === 0 ? 'h-0' : 'h-[42px]'}`}
                >
                  {/* this cell render the select the related task checkbox  */}
                  <td
                    key={'selector'}
                    className={customBodyColumnStyles('selector')}
                    style={{
                      width: 20,
                      backgroundColor: selectedRows.includes(task.id || '')
                        ? themeMode === 'dark'
                          ? colors.skyBlue
                          : '#dceeff'
                        : hoverRow === task.id
                          ? themeMode === 'dark'
                            ? '#000'
                            : '#f8f7f9'
                          : themeMode === 'dark'
                            ? '#181818'
                            : '#fff',
                    }}
                  >
                    <Checkbox
                      checked={selectedRows.includes(task.id || '')}
                      onChange={() => toggleRowSelection(task)}
                    />
                  </td>
                  {/* other cells  */}
                  {visibleColumns.map(column => (
                    <td
                      key={column.key}
                      className={customBodyColumnStyles(column.key)}
                      style={{
                        width: column.width,
                        backgroundColor: selectedRows.includes(task.id || '')
                          ? themeMode === 'dark'
                            ? '#000'
                            : '#dceeff'
                          : hoverRow === task.id
                            ? themeMode === 'dark'
                              ? '#000'
                              : '#f8f7f9'
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

                {/* this is for sub tasks  */}
                {expandedTasks.includes(task.id || '') &&
                  task?.sub_tasks?.map(subtask => (
                    <tr
                      key={subtask.id}
                      onContextMenu={e => handleContextMenu(e, subtask)}
                      className={`${taskList.tasks.length === 0 ? 'h-0' : 'h-[42px]'}`}
                    >
                      {/* this cell render the select the related task checkbox  */}
                      <td
                        key={'selector'}
                        className={customBodyColumnStyles('selector')}
                        style={{
                          width: 20,
                          backgroundColor: selectedRows.includes(subtask.id || '')
                            ? themeMode === 'dark'
                              ? colors.skyBlue
                              : '#dceeff'
                            : hoverRow === subtask.id
                              ? themeMode === 'dark'
                                ? '#000'
                                : '#f8f7f9'
                              : themeMode === 'dark'
                                ? '#181818'
                                : '#fff',
                        }}
                      >
                        <Flex style={{ marginInlineStart: 22 }}>
                          <Checkbox
                            checked={selectedRows.includes(subtask.taskId)}
                            onChange={() => toggleRowSelection(subtask)}
                          />
                        </Flex>
                      </td>

                      {/* other sub tasks cells  */}
                      {visibleColumns.map(column => (
                        <td
                          key={column.key}
                          className={customBodyColumnStyles(column.key)}
                          style={{
                            width: column.width,
                            backgroundColor: selectedRows.includes(subtask.id || '')
                              ? themeMode === 'dark'
                                ? '#000'
                                : '#dceeff'
                              : hoverRow === subtask.id || ''
                                ? themeMode === 'dark'
                                  ? '#000'
                                  : '#f8f7f9'
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
      <AddTaskListRow />

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
