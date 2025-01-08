import { COLUMN_KEYS } from '@/features/tasks/taskSlice';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type ColumnKey = typeof COLUMN_KEYS[keyof typeof COLUMN_KEYS];

export type projectViewTaskListColumnsState = {
  columnsVisibility: Record<ColumnKey, boolean>;
  changedColumn: ColumnKey | null;
};

// Create initial state dynamically from column keys
const initialState: projectViewTaskListColumnsState = {
  columnsVisibility: Object.values(COLUMN_KEYS).reduce((acc, key) => ({
    ...acc,
    [key]: true
  }), {} as Record<ColumnKey, boolean>),
  changedColumn: null
};

const projectViewTaskListColumnsSlice = createSlice({
  name: 'projectViewTaskListColumns',
  initialState,
  reducers: {
    toggleColumnVisibility: (state, action: PayloadAction<ColumnKey>) => {
      state.columnsVisibility[action.payload] = !state.columnsVisibility[action.payload];
      state.changedColumn = action.payload;
    },
    clearChangedColumn: (state) => {
      state.changedColumn = null;
    }
  },
});

export const { toggleColumnVisibility, clearChangedColumn } = projectViewTaskListColumnsSlice.actions;

export default projectViewTaskListColumnsSlice.reducer;
