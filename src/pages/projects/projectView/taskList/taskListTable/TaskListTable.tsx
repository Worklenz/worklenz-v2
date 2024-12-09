import { useAppSelector } from '../../../../../hooks/useAppSelector';
// import { columnList } from './columns/columnList';
import AddTaskListRow from './taskListTableRows/AddTaskListRow';
import { TaskType } from '../../../../../types/task.types';
import {
  Avatar,
  Checkbox,
  DatePicker,
  Flex,
  Input,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import CustomAvatar from '../../../../../components/CustomAvatar';
import LabelsSelector from '../../../../../components/taskListCommon/labelsSelector/LabelsSelector';
import { useSelectedProject } from '../../../../../hooks/useSelectedProject';
import StatusDropdown from '../../../../../components/taskListCommon/statusDropdown/StatusDropdown';
import PriorityDropdown from '../../../../../components/taskListCommon/priorityDropdown/PriorityDropdown';
import { simpleDateFormat } from '../../../../../utils/simpleDateFormat';
import { durationDateFormat } from '../../../../../utils/durationDateFormat';
import CustomColordLabel from '../../../../../components/taskListCommon/labelsSelector/CustomColordLabel';
import CustomNumberLabel from '../../../../../components/taskListCommon/labelsSelector/CustomNumberLabel';
import PhaseDropdown from '../../../../../components/taskListCommon/phaseDropdown/PhaseDropdown';
import AssigneeSelector from '../../../../../components/taskListCommon/assigneeSelector/AssigneeSelector';
import TaskCell from './taskListTableCells/task-cell/TaskCell';
import AddSubTaskListRow from './taskListTableRows/AddSubTaskListRow';
import { colors } from '../../../../../styles/colors';
import TaskContextMenu from './contextMenu/TaskContextMenu';
import TaskProgress from './taskListTableCells/task-progress-cell/TaskProgress';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import {
  deselectAll,
  selectTaskIds,
} from '../../../../../features/projects/bulkActions/bulkActionSlice';
import { useTranslation } from 'react-i18next';
import { HolderOutlined } from '@ant-design/icons';
import TimeTracker from './taskListTableCells/time-tracker-cell/TimeTracker';
import { CustomColumnType } from '../../../../../features/projects/singleProject/taskListColumns/taskColumnsSlice';
import CustomColumnLabelCell from './custom-columns/custom-column-cells/label-cell/custom-column-label-cell';

const TaskListTable = ({
  taskList,
  tableId,
}: {
  taskList: TaskType[] | null;
  tableId: string;
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
  const { t } = useTranslation('taskListTable');

  const dispatch = useAppDispatch();

  // get data theme data from redux
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  // get the selected project details
  const selectedProject = useSelectedProject();

  // get columns list details
  const columnList = useAppSelector(
    (state) => state.projectViewTaskListColumnsReducer.columnList
  );
  const visibleColumns = columnList.filter((column) => column.isVisible);

  // toggle subtasks visibility
  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
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
  const toggleRowSelection = (task: TaskType) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(task.taskId)
        ? prevSelectedRows.filter((id) => id !== task.taskId)
        : [...prevSelectedRows, task.taskId]
    );
  };

  // this use effect for realtime update the selected rows
  useEffect(() => {
    // console.log('Selected tasks and subtasks:', selectedRows);
  }, [selectedRows]);

  // select one row this triggers only in handle the context menu ==> righ click mouse event
  const selectOneRow = (task: TaskType) => {
    setSelectedRows([task.taskId]);

    // log the task object when selected
    if (!selectedRows.includes(task.taskId)) {
      // console.log('Selected task:', task);
    }
  };

  // handle custom task context menu
  const handleContextMenu = (e: React.MouseEvent, task: TaskType) => {
    e.preventDefault();
    setSelectedTaskId(task.taskId);
    selectOneRow(task);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuVisible(true);
  };

  // trigger the table scrolling
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

  // layout styles for table and the columns
  const customBorderColor = themeMode === 'dark' && ' border-[#303030]';

  const customHeaderColumnStyles = (key: string) =>
    `border px-2 text-left ${key === 'selector' && 'sticky left-0 z-10'} ${key === 'task' && `sticky left-[48px] z-10 after:content after:absolute after:top-0 after:-right-1 after:-z-10  after:h-[42px] after:w-1.5 after:bg-transparent ${scrollingTables[tableId] ? 'after:bg-gradient-to-r after:from-[rgba(0,0,0,0.12)] after:to-transparent' : ''}`} ${themeMode === 'dark' ? 'bg-[#1d1d1d] border-[#303030]' : 'bg-[#fafafa]'}`;

  const customBodyColumnStyles = (key: string) =>
    `border px-2 ${key === 'selector' && 'sticky left-0 z-10'} ${key === 'task' && `sticky left-[48px] z-10 after:content after:absolute after:top-0 after:-right-1 after:-z-10  after:min-h-[40px] after:w-1.5 after:bg-transparent ${scrollingTables[tableId] ? 'after:bg-gradient-to-r after:from-[rgba(0,0,0,0.12)] after:to-transparent' : ''}`} ${themeMode === 'dark' ? 'bg-[#141414] border-[#303030]' : 'bg-white'}`;

  // function to render the column content based on column key
  const renderColumnContent = (
    columnKey: string,
    task: TaskType,
    isSubtask: boolean = false
  ) => {
    switch (columnKey) {
      // task ID column
      case 'taskId':
        return (
          <Tooltip title={task.taskId} className="flex justify-center">
            <Tag>{task.taskId}</Tag>
          </Tooltip>
        );

      // task column
      case 'task':
        return (
          // custom task cell component
          <TaskCell
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
          <Typography.Paragraph
            ellipsis={{ expandable: false }}
            style={{ width: 260, marginBlockEnd: 0 }}
          >
            {task.description}
          </Typography.Paragraph>
        );

      // progress column
      case 'progress': {
        return task?.progress || task?.progress === 0 ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TaskProgress
              progress={task?.progress}
              numberOfSubTasks={task?.subTasks?.length || 0}
            />
          </div>
        ) : (
          <div></div>
        );
      }

      // members column
      case 'members':
        return (
          <Flex gap={4} align="center">
            <Avatar.Group>
              {task.members?.map((member) => (
                <CustomAvatar
                  key={member.memberId}
                  avatarName={member.memberName}
                  size={26}
                />
              ))}
            </Avatar.Group>
            <AssigneeSelector taskId={selectedTaskId || '0'} />
          </Flex>
        );

      // labels column
      case 'labels':
        return (
          <Flex>
            {task?.labels && task?.labels?.length <= 2 ? (
              task?.labels?.map((label) => <CustomColordLabel label={label} />)
            ) : (
              <Flex>
                <CustomColordLabel
                  label={task?.labels ? task.labels[0] : null}
                />
                <CustomColordLabel
                  label={task?.labels ? task.labels[1] : null}
                />
                {/* this component show other label names  */}
                <CustomNumberLabel
                  // this label list get the labels without 1, 2 elements
                  labelList={task?.labels ? task.labels : null}
                />
              </Flex>
            )}
            <LabelsSelector taskId={task.taskId} />
          </Flex>
        );

      // phase column
      case 'phases':
        return <PhaseDropdown projectId={selectedProject?.projectId || ''} />;

      // status column
      case 'status':
        return <StatusDropdown currentStatus={task.status} />;

      // priority column
      case 'priority':
        return <PriorityDropdown currentPriority={task.priority} />;

      // time tracking column
      case 'timeTracking':
        return (
          <TimeTracker
            taskId={task.taskId}
            initialTime={task.timeTracking || 0}
          />
        );

      // estimation column
      case 'estimation':
        return <Typography.Text>0h 0m</Typography.Text>;

      // start date column
      case 'startDate':
        return task.startDate ? (
          <Typography.Text>{simpleDateFormat(task.startDate)}</Typography.Text>
        ) : (
          <DatePicker
            placeholder="Set a start date"
            suffixIcon={null}
            style={{ border: 'none', width: '100%', height: '100%' }}
          />
        );

      // due date column
      case 'dueDate':
        return task.dueDate ? (
          <Typography.Text>{simpleDateFormat(task.dueDate)}</Typography.Text>
        ) : (
          <DatePicker
            placeholder="Set a due date"
            suffixIcon={null}
            style={{ border: 'none', width: '100%', height: '100%' }}
          />
        );

      // completed date column
      case 'completedDate':
        return (
          <Typography.Text>
            {durationDateFormat(task.completedDate || null)}
          </Typography.Text>
        );

      // created date column
      case 'createdDate':
        return (
          <Typography.Text>
            {durationDateFormat(task.createdDate || null)}
          </Typography.Text>
        );

      // last updated column
      case 'lastUpdated':
        return (
          <Typography.Text>
            {durationDateFormat(task.lastUpdated || null)}
          </Typography.Text>
        );

      // recorder column
      case 'reporter':
        return <Typography.Text>Sachintha Prasad</Typography.Text>;

      // default case for unsupported columns
      default:
        return null;
    }
  };

  // function to render custom column cells
  const renderCustomColumnContent = (
    columnObj: any,
    columnType: CustomColumnType,
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
        const decimal = columnObj?.decimal || 2;
        const label = columnObj?.label || 'LKR';
        const labelPosition = columnObj?.position || 'left';
        const value = 1000;

        switch (columnObj?.numberType) {
          case 'formatted':
            return (
              <Input
                defaultValue={value.toFixed(decimal)}
                style={{
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                }}
              />
            );
          case 'withLabel':
            return (
              <Flex align="center">
                <Typography.Text style={{ width: 'fit-content', minWidth: 30 }}>
                  {labelPosition === 'left' && label}
                </Typography.Text>
                <Input
                  defaultValue={value.toFixed(decimal)}
                  style={{
                    padding: 0,
                    border: 'none',
                    background: 'transparent',
                  }}
                />
                <Typography.Text style={{ width: 'fit-content', minWidth: 30 }}>
                  {labelPosition === 'right' && label}
                </Typography.Text>
              </Flex>
            );
          case 'unformatted':
            return (
              <Input
                defaultValue={value}
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
                defaultValue={value + '%'}
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
      case 'labels': {
        const labelsList = columnObj?.labelsList || [
          {
            labelId: '1',
            labelName: 'Label 1',
            labelColor: '#154b99',
          },
          {
            labelId: '2',
            labelName: 'Label 2',
            labelColor: '#bd4848',
          },
        ];

        return <CustomColumnLabelCell labelsList={labelsList} />;
      }
      case 'selection':
      case 'formula':
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
              {/* this cell render the select all task checkbox  */}
              <th
                key={'selector'}
                className={`${customHeaderColumnStyles('selector')}`}
                style={{ width: 56, fontWeight: 500 }}
              >
                <Flex justify="flex-start" style={{ marginInlineStart: 22 }}>
                  <Checkbox checked={isSelectAll} onChange={toggleSelectAll} />
                </Flex>
              </th>
              {/* other header cells  */}
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
              <React.Fragment key={task.taskId}>
                <tr
                  key={task.taskId}
                  onContextMenu={(e) => handleContextMenu(e, task)}
                  onMouseEnter={() => setHoverRow(task.taskId)}
                  onMouseLeave={() => setHoverRow(null)}
                  className={`${taskList.length === 0 ? 'h-0' : 'h-[42px]'}`}
                >
                  {/* this cell render the select the related task checkbox  */}
                  <td
                    key={'selector'}
                    className={customBodyColumnStyles('selector')}
                    style={{
                      width: 56,
                      backgroundColor: selectedRows.includes(task.taskId)
                        ? themeMode === 'dark'
                          ? colors.skyBlue
                          : '#dceeff'
                        : hoverRow === task.taskId
                          ? themeMode === 'dark'
                            ? '#000'
                            : '#f8f7f9'
                          : themeMode === 'dark'
                            ? '#181818'
                            : '#fff',
                    }}
                  >
                    <Flex gap={8} align="center">
                      <HolderOutlined />
                      <Checkbox
                        checked={selectedRows.includes(task.taskId)}
                        onChange={() => toggleRowSelection(task)}
                      />
                    </Flex>
                  </td>
                  {/* other cells  */}
                  {visibleColumns.map((column) => (
                    <td
                      key={column.key}
                      className={customBodyColumnStyles(column.key)}
                      style={{
                        width: column.width,
                        backgroundColor: selectedRows.includes(task.taskId)
                          ? themeMode === 'dark'
                            ? '#000'
                            : '#dceeff'
                          : hoverRow === task.taskId
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
                {expandedTasks.includes(task.taskId) &&
                  task?.subTasks?.map((subtask) => (
                    <tr
                      key={subtask.taskId}
                      onContextMenu={(e) => handleContextMenu(e, subtask)}
                      onMouseEnter={() => setHoverRow(subtask.taskId)}
                      onMouseLeave={() => setHoverRow(null)}
                      className={`${taskList.length === 0 ? 'h-0' : 'h-[42px]'}`}
                    >
                      {/* this cell render the select the related task checkbox  */}
                      <td
                        key={'selector'}
                        className={customBodyColumnStyles('selector')}
                        style={{
                          width: 20,
                          backgroundColor: selectedRows.includes(subtask.taskId)
                            ? themeMode === 'dark'
                              ? colors.skyBlue
                              : '#dceeff'
                            : hoverRow === subtask.taskId
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
                      {visibleColumns.map((column) => (
                        <td
                          key={column.key}
                          className={customBodyColumnStyles(column.key)}
                          style={{
                            width: column.width,
                            backgroundColor: selectedRows.includes(
                              subtask.taskId
                            )
                              ? themeMode === 'dark'
                                ? '#000'
                                : '#dceeff'
                              : hoverRow === subtask.taskId
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

                {expandedTasks.includes(task.taskId) && (
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
