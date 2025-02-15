import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  IGroupByOption,
  ILabelsChangeResponse,
  ITaskListColumn,
  ITaskListConfigV2,
  ITaskListGroup,
  ITaskListSortableColumn,
} from '@/types/tasks/taskList.types';
import { tasksApiService } from '@/api/tasks/tasks.api.service';
import logger from '@/utils/errorLogger';
import { ITaskListMemberFilter } from '@/types/tasks/taskListFilters.types';
import { ITaskAssignee, ITaskFormViewModel } from '@/types/tasks/task.types';
import { ITeamMemberViewModel } from '@/types/teamMembers/teamMembersGetResponse.types';
import { IProjectTask } from '@/types/project/projectTasksViewModel.types';
import { ITaskStatusViewModel } from '@/types/tasks/taskStatusGetResponse.types';
import { ITaskListStatusChangeResponse } from '@/types/tasks/task-list-status.component';

export enum IGroupBy {
  STATUS = 'status',
  PRIORITY = 'priority', 
  PHASE = 'phase',
  MEMBERS = 'members'
}

interface ITaskState {
  search: string | null;
  archived: boolean;
  group: IGroupBy;
  isSubtasksInclude: boolean;
  fields: ITaskListSortableColumn[];
  tasks: IProjectTask[];
  taskGroups: ITaskListGroup[];
  loadingColumns: boolean;
  columns: ITaskListColumn[];
  loadingGroups: boolean;
  error: string | null;
  taskAssignees: ITaskListMemberFilter[];
  loadingAssignees: boolean;
  statuses: ITaskStatusViewModel[];
  labels: string[];
  priorities: string[];
  members: string[];

  // task drawer
  selectedTaskId: string | null;
  showTaskDrawer: boolean;
  taskFormViewModel: ITaskFormViewModel | null;
  loadingTask: boolean;
}

const initialState: ITaskState = {
  search: null,
  archived: false,
  group: IGroupBy.STATUS,
  isSubtasksInclude: false,
  fields: [],
  tasks: [],
  loadingColumns: false,
  columns: [],
  taskGroups: [],
  loadingGroups: false,
  error: null,
  taskAssignees: [],
  loadingAssignees: false,
  statuses: [],
  labels: [],
  priorities: [],
  members: [],

  // task drawer
  selectedTaskId: null,
  showTaskDrawer: false,
  taskFormViewModel: null,
  loadingTask: false,
};

export const GROUP_BY_STATUS_VALUE = IGroupBy.STATUS;
export const GROUP_BY_PRIORITY_VALUE = IGroupBy.PRIORITY;
export const GROUP_BY_PHASE_VALUE = IGroupBy.PHASE;

export const GROUP_BY_OPTIONS: IGroupByOption[] = [
  { label: 'Status', value: GROUP_BY_STATUS_VALUE },
  { label: 'Priority', value: GROUP_BY_PRIORITY_VALUE },
  { label: 'Phase', value: GROUP_BY_PHASE_VALUE },
];

export const COLUMN_KEYS = {
  KEY: 'KEY',
  NAME: 'NAME', 
  DESCRIPTION: 'DESCRIPTION',
  PROGRESS: 'PROGRESS',
  ASSIGNEES: 'ASSIGNEES',
  LABELS: 'LABELS',
  STATUS: 'STATUS',
  PRIORITY: 'PRIORITY',
  TIME_TRACKING: 'TIME_TRACKING',
  ESTIMATION: 'ESTIMATION',
  START_DATE: 'START_DATE',
  DUE_DATE: 'DUE_DATE',
  DUE_TIME: 'DUE_TIME',
  COMPLETED_DATE: 'COMPLETED_DATE',
  CREATED_DATE: 'CREATED_DATE',
  LAST_UPDATED: 'LAST_UPDATED',
  REPORTER: 'REPORTER',
  PHASE: 'PHASE',
} as const;

export const COLUMN_KEYS_LIST = Object.values(COLUMN_KEYS).map(key => ({
  key,
  show: true,
}));

const LOCALSTORAGE_GROUP_KEY = 'worklenz.tasklist.group_by';

export const getCurrentGroup = (): IGroupByOption => {
  const key = localStorage.getItem(LOCALSTORAGE_GROUP_KEY);
  if (key) {
    const group = GROUP_BY_OPTIONS.find(option => option.value === key);
    if (group) return group;
  }
  return GROUP_BY_OPTIONS[0];
};

export const setCurrentGroup = (group: IGroupByOption): void => {
  localStorage.setItem(LOCALSTORAGE_GROUP_KEY, group.value);
};

export const fetchTaskGroups = createAsyncThunk(
  'tasks/fetchTaskGroups',
  async (projectId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { taskReducer: ITaskState };
      const { taskReducer } = state;

      const selectedMembers = taskReducer.taskAssignees
        .filter(member => member.selected)
        .map(member => member.id)
        .join(' ');

      const config: ITaskListConfigV2 = {
        id: projectId,
        archived: taskReducer.archived,
        group: taskReducer.group,
        field: taskReducer.fields.map(field => `${field.key} ${field.sort_order}`).join(','),
        order: '',
        search: taskReducer.search || '',
        statuses: '',
        members: selectedMembers,
        projects: '',
        isSubtasksInclude: true,
        labels: taskReducer.labels.join(' '),
        priorities: taskReducer.priorities.join(' '),
      };

      const response = await tasksApiService.getTaskList(config);
      return response.body;
    } catch (error) {
      logger.error('Fetch Task Groups', error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch task groups');
    }
  }
);

export const fetTaskListColumns = createAsyncThunk(
  'tasks/fetTaskListColumns',
  async (projectId: string) => {
    const response = await tasksApiService.fetchTaskListColumns(projectId);
    return response.body;
  }
);

export const fetchTaskAssignees = createAsyncThunk(
  'tasks/fetchTaskAssignees',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await tasksApiService.fetchTaskAssignees(projectId);
      return response.body;
    } catch (error) {
      logger.error('Fetch Task Assignees', error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch task assignees');
    }
  }
);

export const fetchTask = createAsyncThunk(
  'tasks/fetchTask',
  async ({taskId, projectId}: {taskId: string, projectId: string}, { rejectWithValue }) => {
    const response = await tasksApiService.getFormViewModel(taskId, projectId);
    return response.body;
  }
);

const getGroupIdByGroupedColumn = (task: IProjectTask): string | null => {
  const groupBy = getCurrentGroup().value;
  switch (groupBy) {
    case GROUP_BY_STATUS_VALUE:
      return task.status as string;
    case GROUP_BY_PRIORITY_VALUE:
      return task.priority as string;
    case GROUP_BY_PHASE_VALUE:
      return task.phase_id as string;
    default:
      return null;
  }
};

const deleteTaskFromGroup = (
  taskGroups: ITaskListGroup[],
  task: IProjectTask,
  groupId: string,
  index: number | null = null
): void => {
  const group = taskGroups.find(g => g.id === groupId);
  if (!group || !task.id) return;

  if (task.is_sub_task) {
    const parentTask = group.tasks.find(t => t.id === task.parent_task_id);
    if (parentTask) {
      const subTaskIndex = parentTask.sub_tasks?.findIndex(t => t.id === task.id);
      if (typeof subTaskIndex !== 'undefined' && subTaskIndex !== -1) {
        parentTask.sub_tasks_count = Math.max((parentTask.sub_tasks_count || 0) - 1, 0);
        parentTask.sub_tasks?.splice(subTaskIndex, 1);
      }
    }
  } else {
    const taskIndex = index ?? group.tasks.findIndex(t => t.id === task.id);
    if (taskIndex !== -1) {
      group.tasks.splice(taskIndex, 1);
    }
  }
};

const addTaskToGroup = (
  taskGroups: ITaskListGroup[],
  task: IProjectTask,
  groupId: string,
  insert = false
): void => {
  const group = taskGroups.find(g => g.id === groupId);
  if (!group || !task.id) return;

  if (task.parent_task_id) {
    const parentTask = group.tasks.find(t => t.id === task.parent_task_id);
    if (parentTask) {
      parentTask.sub_tasks_count = (parentTask.sub_tasks_count || 0) + 1;
      if (!parentTask.sub_tasks) parentTask.sub_tasks = [];
      parentTask.sub_tasks.push({...task});
    }
  } else {
    insert ? group.tasks.unshift({...task}) : group.tasks.push({...task});
  }
};

const updateTaskGroup = (
  taskGroups: ITaskListGroup[],
  task: IProjectTask,
  insert = true
): void => {
  if (!task.id) return;
  
  const groupId = getGroupIdByGroupedColumn(task);
  if (groupId) {
    deleteTaskFromGroup(taskGroups, task, groupId);
    addTaskToGroup(taskGroups, {...task}, groupId, insert);
  }
};

const taskSlice = createSlice({
  name: 'taskReducer',
  initialState,
  reducers: {
    toggleTaskDrawer: state => {
      state.showTaskDrawer = !state.showTaskDrawer;
    },

    toggleArchived: state => {
      state.archived = !state.archived;
    },

    setGroup: (state, action: PayloadAction<IGroupBy>) => {
      state.group = action.payload;
    },

    setLabels: (state, action: PayloadAction<string[]>) => {
      state.labels = action.payload;
    },

    setMembers: (state, action: PayloadAction<ITaskListMemberFilter[]>) => {
      state.taskAssignees = action.payload;
    },

    setPriorities: (state, action: PayloadAction<string[]>) => {
      state.priorities = action.payload;
    },

    setStatuses: (state, action: PayloadAction<ITaskStatusViewModel[]>) => {
      state.statuses = action.payload;
    },

    setFields: (state, action: PayloadAction<ITaskListSortableColumn[]>) => {
      state.fields = action.payload;
    },

    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },

    setShowTaskDrawer: (state, action: PayloadAction<boolean>) => {
      state.showTaskDrawer = action.payload;
    },

    setSelectedTaskId: (state, action: PayloadAction<string | null>) => {
      state.selectedTaskId = action.payload;
    },

    addTask: (
      state,
      action: PayloadAction<{
        task: IProjectTask;
        groupId: string;
        insert?: boolean;
      }>
    ) => {
      const { task, groupId, insert = false } = action.payload;
      const group = state.taskGroups.find(g => g.id === groupId);
      if (!group || !task.id) return;

      if (task.parent_task_id) {
        const parentTask = group.tasks.find(t => t.id === task.parent_task_id);
        if (parentTask) {
          parentTask.sub_tasks_count = (parentTask.sub_tasks_count || 0) + 1;
          if (!parentTask.sub_tasks) parentTask.sub_tasks = [];
          parentTask.sub_tasks.push(task);
        }
      } else {
        insert ? group.tasks.unshift(task) : group.tasks.push(task);
      }
    },

    deleteTask: (
      state,
      action: PayloadAction<{
        taskId: string;
        index?: number;
      }>
    ) => {
      const { taskId, index } = action.payload;

      for (const group of state.taskGroups) {
        const taskIndex = index ?? group.tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) continue;

        const task = group.tasks[taskIndex];
        if (task.is_sub_task) {
          const parentTask = group.tasks.find(t => t.id === task.parent_task_id);
          if (parentTask?.sub_tasks) {
            const subTaskIndex = parentTask.sub_tasks.findIndex(t => t.id === task.id);
            if (subTaskIndex !== -1) {
              parentTask.sub_tasks_count = Math.max((parentTask.sub_tasks_count || 0) - 1, 0);
              parentTask.sub_tasks.splice(subTaskIndex, 1);
            }
          }
        } else {
          group.tasks.splice(taskIndex, 1);
        }
        break;
      }
    },

    updateTaskProgress: (
      state,
      action: PayloadAction<{
        taskId: string;
        progress: number;
        totalTasksCount: number;
        completedCount: number;
      }>
    ) => {
      const { taskId, progress, totalTasksCount, completedCount } = action.payload;
      const group = state.taskGroups.find(group => 
        group.tasks.some(task => task.id === taskId)
      );

      if (group) {
        const task = group.tasks.find(task => task.id === taskId);
        if (task) {
          task.complete_ratio = progress;
          task.total_tasks_count = totalTasksCount;
          task.completed_count = completedCount;
        }
      }
    },

    updateTaskAssignees: (
      state,
      action: PayloadAction<{
        groupId: string;
        taskId: string;
        assignees: ITeamMemberViewModel[];
      }>
    ) => {
      const { groupId, taskId, assignees } = action.payload;
      const group = state.taskGroups.find(group => group.id === groupId);
      if (group) {
        const task = group.tasks.find(task => task.id === taskId);
        if (task) {
          task.assignees = assignees as ITaskAssignee[];
        }
      }
    },

    updateTaskLabel: (
      state,
      action: PayloadAction<ILabelsChangeResponse>
    ) => {
      const label = action.payload;
      state.taskGroups.forEach(group => {
        const task = group.tasks.find(task => task.id === label.id);
        if (task) {
          task.labels = label.labels || [];
          task.all_labels = label.all_labels || [];
        }
      });
    },

    updateTaskStatus: (
      state,
      action: PayloadAction<ITaskListStatusChangeResponse>
    ) => {
      const {
        id,
        status_id,
        color_code,
        complete_ratio,
        statusCategory,
      } = action.payload;

      const group = state.taskGroups.find(group => 
        group.tasks.some(task => task.id === id)
      );

      if (group) {
        const task = group.tasks.find(task => task.id === id);
        if (task) {
          task.status_color = color_code;
          task.complete_ratio = +complete_ratio;
          task.status = status_id;
          task.status_category = statusCategory;

          if (state.group === GROUP_BY_STATUS_VALUE && !task.is_sub_task) {
            updateTaskGroup(state.taskGroups, task as IProjectTask, false);
          }
        }
      }
    },

    updateTaskEndDate: (
      state,
      action: PayloadAction<{
        task: IProjectTask;
      }>
    ) => {
      const { task } = action.payload;
      const group = state.taskGroups.find(group => group.tasks.some(t => t.id === task.id));
      if (group) {
        const taskIndex = group.tasks.findIndex(t => t.id === task.id);
        if (taskIndex >= 0) {
          group.tasks[taskIndex].end_date = task.end_date;
        }
      }
    },

    updateTaskStartDate: (
      state,
      action: PayloadAction<{
        task: IProjectTask;
      }>
    ) => {
      const { task } = action.payload;
      const group = state.taskGroups.find(group => group.tasks.some(t => t.id === task.id));
      if (group) {
        const taskIndex = group.tasks.findIndex(t => t.id === task.id);
        if (taskIndex >= 0) {
          group.tasks[taskIndex].start_date = task.start_date;
        }
      }

    },

    updateTaskGroup: (
      state,
      action: PayloadAction<{
        task: IProjectTask;
        isSubtasksIncluded: boolean;
      }>
    ) => {
      const { task } = action.payload;
      const groupId = getGroupIdByGroupedColumn(task);
      
      if (groupId) {
        const group = state.taskGroups.find(g => g.id === groupId);
        if (group) {
          const taskIndex = group.tasks.findIndex(t => t.id === task.id);
          if (taskIndex >= 0) {
            group.tasks[taskIndex] = task;
          } else {
            group.tasks.push(task);
          }
        }
      }
    },

    toggleColumnVisibility: (state, action: PayloadAction<string>) => {
      const column = state.columns.find(col => col.key === action.payload);
      if (column) {
        column.pinned = !column.pinned;
      }
    },
  },

  extraReducers: builder => {
    builder
      .addCase(fetchTaskGroups.pending, state => {
        state.loadingGroups = true;
        state.error = null;
      })
      .addCase(fetchTaskGroups.fulfilled, (state, action) => {
        state.loadingGroups = false;
        state.taskGroups = action.payload;
      })
      .addCase(fetchTaskGroups.rejected, (state, action) => {
        state.loadingGroups = false;
        state.error = action.error.message || 'Failed to fetch task groups';
      })
      .addCase(fetchTaskAssignees.pending, state => {
        state.loadingAssignees = true;
        state.error = null;
      })
      .addCase(fetchTaskAssignees.fulfilled, (state, action) => {
        state.loadingAssignees = false;
        state.taskAssignees = action.payload;
      })
      .addCase(fetchTaskAssignees.rejected, (state, action) => {
        state.loadingAssignees = false;
        state.error = action.error.message || 'Failed to fetch task assignees';
      })
      .addCase(fetTaskListColumns.pending, state => {
        state.loadingColumns = true;
        state.error = null;
      })
      .addCase(fetTaskListColumns.fulfilled, (state, action) => {
        state.loadingColumns = false;
        action.payload.splice(1, 0, {
          key: 'TASK',
          name: 'Task',
          index: 1,
          pinned: true,
        });
        state.columns = action.payload;
      })
      .addCase(fetchTask.pending, state => {
        state.loadingTask = true;
        state.error = null;
      })
      .addCase(fetchTask.fulfilled, (state, action) => {
        state.loadingTask = false;
        state.taskFormViewModel = action.payload;
      })
      .addCase(fetchTask.rejected, (state, action) => {
        state.loadingTask = false;
        state.error = action.error.message || 'Failed to fetch task';
      });
  },
});

export const {
  setGroup,
  addTask,
  deleteTask,
  updateTaskProgress,
  updateTaskAssignees,
  updateTaskLabel,
  toggleTaskDrawer,
  toggleArchived,
  setMembers,
  setLabels,
  setPriorities,
  setStatuses,
  setFields,
  setSearch,
  setSelectedTaskId,
  setShowTaskDrawer,
  toggleColumnVisibility,
  updateTaskStatus,
  updateTaskEndDate,  
  updateTaskStartDate,
} = taskSlice.actions;


export default taskSlice.reducer;
