import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  IGroupByOption,
  ITaskListColumn,
  ITaskListConfigV2,
  ITaskListGroup,
  ITaskListSortableColumn,
} from '@/types/tasks/taskList.types';
import { tasksApiService } from '@/api/tasks/tasks.api.service';
import logger from '@/utils/errorLogger';
import { ITaskListMemberFilter } from '@/types/tasks/taskListFilters.types';
import { ITaskFormViewModel } from '@/types/tasks/task.types';
import { IProjectTask } from '@/types/project/projectTasksViewModel.types';
import { ITaskStatusViewModel } from '@/types/tasks/taskStatusGetResponse.types';

export enum IGroupBy {
  STATUS = 'status',
  PRIORITY = 'priority',
  PHASE = 'phase',
  MEMBERS = 'members',
}

export const GROUP_BY_STATUS_VALUE = IGroupBy.STATUS;
export const GROUP_BY_PRIORITY_VALUE = IGroupBy.PRIORITY;
export const GROUP_BY_PHASE_VALUE = IGroupBy.PHASE;

export const GROUP_BY_OPTIONS: IGroupByOption[] = [
  { label: 'Status', value: GROUP_BY_STATUS_VALUE },
  { label: 'Priority', value: GROUP_BY_PRIORITY_VALUE },
  { label: 'Phase', value: GROUP_BY_PHASE_VALUE },
];

const LOCALSTORAGE_GROUP_KEY = 'worklenz.tasklist.group_by';

export const getCurrentGroup = (): IGroupByOption => {
  const key = localStorage.getItem(LOCALSTORAGE_GROUP_KEY);
  if (key) {
    const group = GROUP_BY_OPTIONS.find(option => option.value === key);
    if (group) return group;
  }
  setCurrentGroup(GROUP_BY_STATUS_VALUE);
  return GROUP_BY_OPTIONS[0];
};

export const setCurrentGroup = (group: IGroupBy): void => {
  localStorage.setItem(LOCALSTORAGE_GROUP_KEY, group);
};

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
  editableSectionId: string | null;

  // task drawer
  selectedTaskId: string | null;
  showTaskDrawer: boolean;
  taskFormViewModel: ITaskFormViewModel | null;
  loadingTask: boolean;
}

const initialState: ITaskState = {
  search: null,
  archived: false,
  group: getCurrentGroup().value as IGroupBy,
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
  editableSectionId: null,

  // task drawer
  selectedTaskId: null,
  showTaskDrawer: false,
  taskFormViewModel: null,
  loadingTask: false,
};

// async thunk for fetching members data
export const fetchTaskData = createAsyncThunk('board/fetchTaskData', async (endpoint: string) => {
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`Response error: ${response.status}`);
  return await response.json();
});

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

const boardSlice = createSlice({
  name: 'boardReducer',
  initialState,
  reducers: {
    setGroup: (state, action: PayloadAction<ITaskState['group']>) => {
      state.group = action.payload;
    },

    setSelectedTaskId: (state, action: PayloadAction<string>) => {
      state.selectedTaskId = action.payload;
    },

    addBoardSectionCard: (
      state,
      action: PayloadAction<{
        id: string;
        name: string;
        colorCode: string;
        colorCodeDark: string;
      }>
    ) => {
      const newSection = {
        id: action.payload.id,
        name: action.payload.name,
        color_code: action.payload.colorCode,
        color_code_dark: action.payload.colorCodeDark,
        progress: { todo: 0, doing: 0, done: 0 },
        tasks: [],
      };
      state.taskGroups.push(newSection as ITaskListGroup);

      state.editableSectionId = newSection.id;
    },

    setEditableSection: (state, action) => {
      state.editableSectionId = action.payload;
    },

    addTaskCardToTheTop: (state, action: PayloadAction<{ sectionId: string; task: any }>) => {
      const section = state.taskGroups.find(sec => sec.id === action.payload.sectionId);
      if (section) {
        section.tasks.unshift(action.payload.task);
      }
    },

    addTaskCardToTheBottom: (state, action: PayloadAction<{ sectionId: string; task: any }>) => {
      const section = state.taskGroups.find(sec => sec.id === action.payload.sectionId);
      if (section) {
        section.tasks.push(action.payload.task);
      }
    },

    addSubtask: (
      state,
      action: PayloadAction<{ sectionId: string; taskId: string; subtask: any }>
    ) => {
      const section = state.taskGroups.find(sec => sec.id === action.payload.sectionId);
      if (section) {
        const task = section.tasks.find((task: any) => task.id === action.payload.taskId);

        if (task) {
          task.sub_tasks?.push(action.payload.subtask);
          task.sub_tasks_count = task.sub_tasks?.length || 0;
        }
      }
    },

    deleteBoardTask: (state, action: PayloadAction<{ sectionId: string; taskId: string }>) => {
      const section = state.taskGroups.find(sec => sec.id === action.payload.sectionId);
      if (section) {
        section.tasks = section.tasks.filter((task: any) => task.id !== action.payload.taskId);
      }
    },

    deleteSection: (state, action: PayloadAction<{ sectionId: string }>) => {
      state.taskGroups = state.taskGroups.filter(section => section.id !== action.payload.sectionId);
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
      });
  },
});

export const {
  setGroup,
  addBoardSectionCard,
  setEditableSection,
  addTaskCardToTheTop,
  addTaskCardToTheBottom,
  addSubtask,
  deleteSection,
  deleteBoardTask,
  setSelectedTaskId,
} = boardSlice.actions;
export default boardSlice.reducer;
