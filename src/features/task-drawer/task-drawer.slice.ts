import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { tasksApiService } from '@/api/tasks/tasks.api.service';
import { ITaskFormViewModel } from '@/types/tasks/task.types';
import { ITaskListStatusChangeResponse } from '@/types/tasks/task-list-status.types';
import { IProjectTask } from '@/types/project/projectTasksViewModel.types';
import { ITaskListPriorityChangeResponse } from '@/types/tasks/task-list-priority.types';

interface ITaskDrawerState {
  selectedTaskId: string | null;
  showTaskDrawer: boolean;
  taskFormViewModel: ITaskFormViewModel | null;
  loadingTask: boolean;
}

const initialState: ITaskDrawerState = {
  selectedTaskId: null,
  showTaskDrawer: false,
  taskFormViewModel: null,
  loadingTask: false,
};

export const fetchTask = createAsyncThunk(
  'tasks/fetchTask',
  async ({ taskId, projectId }: { taskId: string; projectId: string }, { rejectWithValue }) => {
    const response = await tasksApiService.getFormViewModel(taskId, projectId);
    return response.body;
  }
);

const taskDrawerSlice = createSlice({
  name: 'taskDrawer',
  initialState,
  reducers: {
    setSelectedTaskId: (state, action) => {
      state.selectedTaskId = action.payload;
    },
    setShowTaskDrawer: (state, action) => {
      state.showTaskDrawer = action.payload;
    },
    setTaskFormViewModel: (state, action) => {
      state.taskFormViewModel = action.payload;
    },
    setLoadingTask: (state, action) => {
      state.loadingTask = action.payload;
    },
    setTaskStatus: (state, action: PayloadAction<ITaskListStatusChangeResponse>) => {
      const { status_id, color_code, id: taskId } = action.payload;
      if (state.taskFormViewModel?.task && state.taskFormViewModel.task.id === taskId) {
        state.taskFormViewModel.task.status_id = status_id;
        state.taskFormViewModel.task.status_color = color_code;
      }
    },
    setStartDate: (state, action: PayloadAction<IProjectTask>) => {
      const { start_date, id: taskId } = action.payload;
      if (state.taskFormViewModel?.task && state.taskFormViewModel.task.id === taskId) {
        state.taskFormViewModel.task.start_date = start_date;
      }
    },
    setTaskEndDate: (state, action: PayloadAction<IProjectTask>) => {
      const { end_date, id: taskId } = action.payload;
      if (state.taskFormViewModel?.task && state.taskFormViewModel.task.id === taskId) {
        state.taskFormViewModel.task.end_date = end_date;
      }
    },
    setTaskAssignee: (state, action: PayloadAction<IProjectTask>) => {
      const { assignees, id: taskId } = action.payload;
      if (state.taskFormViewModel?.task && state.taskFormViewModel.task.id === taskId) {
        state.taskFormViewModel.task.assignees = assignees;
      }
    },
    setTaskPriority: (state, action: PayloadAction<ITaskListPriorityChangeResponse>) => {
      const { priority_id, id: taskId } = action.payload;
      if (state.taskFormViewModel?.task && state.taskFormViewModel.task.id === taskId) {
        state.taskFormViewModel.task.priority_id = priority_id;
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchTask.pending, state => {
      state.loadingTask = true;
    }),
      builder.addCase(fetchTask.fulfilled, (state, action) => {
        state.loadingTask = false;
        state.taskFormViewModel = action.payload;
      }),
      builder.addCase(fetchTask.rejected, (state, action) => {
        state.loadingTask = false;
      });
  },
});

export const {
  setSelectedTaskId,
  setShowTaskDrawer,
  setTaskFormViewModel,
  setLoadingTask,
  setTaskStatus,
  setStartDate,
  setTaskEndDate,
  setTaskAssignee,
  setTaskPriority,
} = taskDrawerSlice.actions;
export default taskDrawerSlice.reducer;
