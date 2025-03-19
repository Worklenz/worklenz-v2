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
import { IProjectTask, ITaskAssignee } from '@/types/project/projectTasksViewModel.types';
import { ITaskStatusViewModel } from '@/types/tasks/taskStatusGetResponse.types';
import { ITaskAssigneesUpdateResponse } from '@/types/tasks/task-assignee-update-response';
import { ITaskLabelFilter } from '@/types/tasks/taskLabel.types';
import { ITaskLabel } from '@/types/label.type';
import { ITeamMemberViewModel } from '../taskAttributes/taskMemberSlice';
import { InlineMember } from '@/types/teamMembers/inlineMember.types';

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

const LOCALSTORAGE_BOARD_GROUP_KEY = 'worklenz.board.group_by';

export const getCurrentGroupBoard = (): IGroupByOption => {
  const key = localStorage.getItem(LOCALSTORAGE_BOARD_GROUP_KEY);
  if (key) {
    const group = GROUP_BY_OPTIONS.find(option => option.value === key);
    if (group) return group;
  }
  setCurrentBoardGroup(GROUP_BY_STATUS_VALUE);
  return GROUP_BY_OPTIONS[0];
};

export const setCurrentBoardGroup = (groupBy: IGroupBy): void => {
  localStorage.setItem(LOCALSTORAGE_BOARD_GROUP_KEY, groupBy);
};

interface ITaskState {
  search: string | null;
  archived: boolean;
  groupBy: IGroupBy;
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

  loadingLabels: boolean;
  labels: ITaskLabelFilter[];
  priorities: string[];
  members: string[];
  editableSectionId: string | null;
}

const initialState: ITaskState = {
  search: null,
  archived: false,
  groupBy: getCurrentGroupBoard().value as IGroupBy,
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
  loadingLabels: false,
  priorities: [],
  members: [],
  editableSectionId: null,
};

// async thunk for fetching members data
export const fetchTaskData = createAsyncThunk('board/fetchTaskData', async (endpoint: string) => {
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`Response error: ${response.status}`);
  return await response.json();
});

export const fetchBoardTaskGroups = createAsyncThunk(
  'board/fetchBoardTaskGroups',
  async (projectId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { boardReducer: ITaskState };
      const { boardReducer } = state;

      const selectedMembers = boardReducer.taskAssignees
        .filter(member => member.selected)
        .map(member => member.id)
        .join(' ');

      const selectedLabels = boardReducer.labels
        .filter(label => label.selected)
        .map(label => label.id)
        .join(' ');

      const config: ITaskListConfigV2 = {
        id: projectId,
        archived: boardReducer.archived,
        group: boardReducer.groupBy,
        field: boardReducer.fields.map(field => `${field.key} ${field.sort_order}`).join(','),
        order: '',
        search: boardReducer.search || '',
        statuses: '',
        members: selectedMembers,
        projects: '',
        isSubtasksInclude: false,
        labels: selectedLabels,
        priorities: boardReducer.priorities.join(' '),
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

export const fetchBoardSubTasks = createAsyncThunk(
  'board/fetchBoardSubTasks',
  async (
    { taskId, projectId }: { taskId: string; projectId: string },
    { rejectWithValue, getState, dispatch }
  ) => {
    const state = getState() as { taskReducer: ITaskState };
    const { taskReducer } = state;

    // Check if the task is already expanded
    const task = taskReducer.taskGroups.flatMap(group => group.tasks).find(t => t.id === taskId);

    if (task?.show_sub_tasks) {
      // If already expanded, just return without fetching
      return [];
    }

    const selectedMembers = taskReducer.taskAssignees
      .filter(member => member.selected)
      .map(member => member.id)
      .join(' ');

    const selectedLabels = taskReducer.labels
      .filter(label => label.selected)
      .map(label => label.id)
      .join(' ');

    const config: ITaskListConfigV2 = {
      id: projectId,
      archived: taskReducer.archived,
      group: taskReducer.groupBy,
      field: taskReducer.fields.map(field => `${field.key} ${field.sort_order}`).join(','),
      order: '',
      search: taskReducer.search || '',
      statuses: '',
      members: selectedMembers,
      projects: '',
      isSubtasksInclude: false,
      labels: selectedLabels,
      priorities: taskReducer.priorities.join(' '),
      parent_task: taskId,
    };
    try {
      const response = await tasksApiService.getTaskList(config);
      // Only expand if we actually fetched subtasks
      if (response.body.length > 0) {
        // dispatch(toggleTaskRowExpansion(taskId));
      }
      return response.body;
    } catch (error) {
      logger.error('Fetch Sub Tasks', error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch sub tasks');
    }
  }
);

const boardSlice = createSlice({
  name: 'boardReducer',
  initialState,
  reducers: {
    setBoardGroupBy: (state, action: PayloadAction<ITaskState['groupBy']>) => {
      console.log('action.payload', action.payload);
      state.groupBy = action.payload;
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
      state.taskGroups = state.taskGroups.filter(
        section => section.id !== action.payload.sectionId
      );
    },

    updateBoardTaskAssignee: (
      state,
      action: PayloadAction<{
        body: ITaskAssigneesUpdateResponse;
        sectionId: string;
        taskId: string;
      }>
    ) => {
      const section = state.taskGroups.find(sec => sec.id === action.payload.sectionId);
      if (section) {
        const task = section.tasks.find((task: any) => task.id === action.payload.taskId);
        if (task) {
          task.assignees = action.payload.body.assignees;
          task.names = action.payload.body.names;
        }
      }
    },

    reorderTaskGroups: (state, action: PayloadAction<any[]>) => {
      state.taskGroups = action.payload;
    },

    moveTaskBetweenGroups: (
      state,
      action: PayloadAction<{
        taskId: string;
        sourceGroupId: string;
        targetGroupId: string;
        targetIndex: number;
      }>
    ) => {
      const { taskId, sourceGroupId, targetGroupId, targetIndex } = action.payload;

      // Find source and target groups
      const sourceGroup = state.taskGroups.find(group => group.id === sourceGroupId);
      const targetGroup = state.taskGroups.find(group => group.id === targetGroupId);

      if (!sourceGroup || !targetGroup) return;

      // Find the task to move
      const taskIndex = sourceGroup.tasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) return;

      // Get the task and remove it from source
      const task = { ...sourceGroup.tasks[taskIndex], status_id: targetGroupId };
      sourceGroup.tasks = sourceGroup.tasks.filter(task => task.id !== taskId);

      // Insert task at the target position
      if (targetIndex >= 0 && targetIndex <= targetGroup.tasks.length) {
        targetGroup.tasks.splice(targetIndex, 0, task);
      } else {
        // If target index is invalid, append to the end
        targetGroup.tasks.push(task);
      }
    },

    resetBoardData: state => {
      state.taskGroups = [];
      state.columns = [];
      state.loadingGroups = false;
      state.loadingColumns = false;
      state.error = null;
    },

    setBoardLabels: (state, action: PayloadAction<ITaskLabelFilter[]>) => {
      state.labels = action.payload;
    },

    setBoardMembers: (state, action: PayloadAction<ITaskListMemberFilter[]>) => {
      state.taskAssignees = action.payload;
    },

    setBoardPriorities: (state, action: PayloadAction<string[]>) => {
      state.priorities = action.payload;
    },

    setBoardStatuses: (state, action: PayloadAction<ITaskStatusViewModel[]>) => {
      state.statuses = action.payload;
    },

    setBoardSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },

    setBoardGroupName: (
      state,
      action: PayloadAction<{
        groupId: string;
        name: string;
        colorCode: string;
        colorCodeDark: string;
        categoryId: string;
      }>
    ) => {
      const group = state.taskGroups.find(group => group.id === action.payload.groupId);
      if (group) {
        group.name = action.payload.name;
        group.color_code = action.payload.colorCode;
        group.color_code_dark = action.payload.colorCodeDark;
        group.category_id = action.payload.categoryId;
      }
    },

    updateTaskAssignees: (
      state,
      action: PayloadAction<{
        groupId: string;
        taskId: string;
        assignees: ITeamMemberViewModel[];
        names: ITeamMemberViewModel[];
      }>
    ) => {
      const { groupId, taskId, assignees, names } = action.payload;
      const group = state.taskGroups.find(group => group.id === groupId);
      if (group) {
        // Find the task or its subtask
        const task =
          group.tasks.find(task => task.id === taskId) ||
          group.tasks.flatMap(task => task.sub_tasks || []).find(subtask => subtask.id === taskId);
        if (task) {
          task.assignees = assignees as ITaskAssignee[];
          task.names = names as InlineMember[];
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

      for (const group of state.taskGroups) {
        const existingTask =
          group.tasks.find(t => t.id === task.id) ||
          group.tasks.flatMap(t => t.sub_tasks || []).find(subtask => subtask.id === task.id);
        if (existingTask) {
          existingTask.end_date = task.end_date;
          break;
        }
      }
    },

    updateSubtask: (state, action: PayloadAction<{ sectionId: string; subtask: IProjectTask, mode: 'add' | 'delete' }>) => {
      const { sectionId, subtask } = action.payload;
      const parentTaskId = subtask.parent_task_id;
      
      // Function to update a task with a new subtask
      const updateTaskWithSubtask = (task: IProjectTask) => {
        if (!task) return false;
        
        // Initialize sub_tasks array if it doesn't exist
        if (!task.sub_tasks) {
          task.sub_tasks = [];
        }
        
        if (action.payload.mode === 'add') {
          // Increment subtask count
          task.sub_tasks_count = (task.sub_tasks_count || 0) + 1;
          
          // Add the subtask
          task.sub_tasks.push({ ...subtask });
        } else {
          // Remove the subtask
          task.sub_tasks = task.sub_tasks.filter(t => t.id !== subtask.id);
          task.sub_tasks_count = (task.sub_tasks_count || 0) - 1;
        }
        return true;
      };
      
      // First try to find the task in the specified section
      if (sectionId) {
        const section = state.taskGroups.find(sec => sec.id === sectionId);
        if (section) {
          const task = section.tasks.find(task => task.id === parentTaskId);
          if (task && updateTaskWithSubtask(task)) {
            return;
          }
        }
      }
      
      // If section not found or task not in section, search all groups
      for (const group of state.taskGroups) {
        const task = group.tasks.find(task => task.id === parentTaskId);
        if (task && updateTaskWithSubtask(task)) {
          break;
        }
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBoardTaskGroups.pending, state => {
        state.loadingGroups = true;
        state.error = null;
      })
      .addCase(fetchBoardTaskGroups.fulfilled, (state, action) => {
        state.loadingGroups = false;
        state.taskGroups = action.payload;
      })
      .addCase(fetchBoardTaskGroups.rejected, (state, action) => {
        state.loadingGroups = false;
        state.error = action.error.message || 'Failed to fetch task groups';
      })
      .addCase(fetchBoardSubTasks.pending, (state, action) => {
        state.error = null;
        // Find the task and set sub_tasks_loading to true
        const taskId = action.meta.arg.taskId;
        for (const group of state.taskGroups) {
          const task = group.tasks.find(t => t.id === taskId);
          if (task) {
            task.sub_tasks_loading = true;
            break;
          }
        }
      })
      .addCase(fetchBoardSubTasks.fulfilled, (state, action: PayloadAction<IProjectTask[]>) => {
        if (action.payload.length > 0) {
          const taskId = action.payload[0].parent_task_id;
          if (taskId) {
            for (const group of state.taskGroups) {
              const task = group.tasks.find(t => t.id === taskId);
              if (task) {
                task.sub_tasks = action.payload;
                task.show_sub_tasks = true;
                task.sub_tasks_loading = false;
                break;
              }
            }
          }
        } else {
          // If no subtasks were returned, we still need to set loading to false
          // We don't have the taskId from the payload, so we'll check all tasks
          for (const group of state.taskGroups) {
            for (const task of group.tasks) {
              if (task.sub_tasks_loading) {
                task.sub_tasks_loading = false;
              }
            }
          }
        }
      })
      .addCase(fetchBoardSubTasks.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch sub tasks';
        // Set loading to false on rejection
        // We'll check all tasks for loading state
        for (const group of state.taskGroups) {
          for (const task of group.tasks) {
            if (task.sub_tasks_loading) {
              task.sub_tasks_loading = false;
            }
          }
        }
      });
  },
});

export const {
  setBoardGroupBy,
  addBoardSectionCard,
  setEditableSection,
  addTaskCardToTheTop,
  addTaskCardToTheBottom,
  addSubtask,
  deleteSection,
  deleteBoardTask,
  updateBoardTaskAssignee,
  reorderTaskGroups,
  moveTaskBetweenGroups,
  resetBoardData,
  setBoardLabels,
  setBoardMembers,
  setBoardPriorities,
  setBoardStatuses,
  setBoardSearch,
  setBoardGroupName,
  updateTaskAssignees,
  updateTaskEndDate,
  updateSubtask,
} = boardSlice.actions;
export default boardSlice.reducer;
