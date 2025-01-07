import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

type BoardState = {
  group: 'status' | 'phase' | 'priority' | 'members';
  taskList: any[];
  isLoading: boolean;
  error: string | null;
};

const initialState: BoardState = {
  taskList: [],
  group: 'status',
  isLoading: false,
  error: null,
};

// async thunk for fetching members data
export const fetchTaskData = createAsyncThunk(
  'board/fetchTaskData',
  async (endpoint: string) => {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`Response error: ${response.status}`);
    return await response.json();
  }
);

const boardSlice = createSlice({
  name: 'boardReducer',
  initialState,
  reducers: {
    setGroup(state, action: PayloadAction<BoardState['group']>) {
      state.group = action.payload;
    },

    addBoardSectionCard(
      state,
      action: PayloadAction<{
        id: string;
        name: string;
        colorCode: string;
        colorCodeDark: string;
      }>
    ) {
      const newSection = {
        id: action.payload.id,
        name: action.payload.name,
        color_code: action.payload.colorCode,
        color_code_dark: action.payload.colorCodeDark,
        progress: { todo: 0, doing: 0, done: 0 },
        tasks: [],
      };
      state.taskList.push(newSection);
    },

    addTaskCardToTheTop(
      state,
      action: PayloadAction<{ sectionId: string; task: any }>
    ) {
      const section = state.taskList.find(
        (sec) => sec.id === action.payload.sectionId
      );
      if (section) {
        section.tasks.unshift(action.payload.task);
      }
    },

    addTaskCardToTheBottom(
      state,
      action: PayloadAction<{ sectionId: string; task: any }>
    ) {
      const section = state.taskList.find(
        (sec) => sec.id === action.payload.sectionId
      );
      if (section) {
        section.tasks.push(action.payload.task);
      }
    },

    deleteBoardTask(
      state,
      action: PayloadAction<{ sectionId: string; taskId: string }>
    ) {
      const section = state.taskList.find(
        (sec) => sec.id === action.payload.sectionId
      );
      if (section) {
        section.tasks = section.tasks.filter(
          (task: any) => task.id !== action.payload.taskId
        );
      }
    },

    deleteSection(state, action: PayloadAction<{ sectionId: string }>) {
      state.taskList = state.taskList.filter(
        (section) => section.id !== action.payload.sectionId
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaskData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTaskData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.taskList = action.payload;
      })
      .addCase(fetchTaskData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch task data';
      });
  },
});

export const {
  setGroup,
  addBoardSectionCard,
  addTaskCardToTheTop,
  addTaskCardToTheBottom,
  deleteSection,
  deleteBoardTask,
} = boardSlice.actions;
export default boardSlice.reducer;
