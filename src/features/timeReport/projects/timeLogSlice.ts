import { createSlice } from '@reduxjs/toolkit';

interface timeLogState {
  isTimeLogDrawerOpen: boolean;
  selectedLabel: string;
}

const initialState: timeLogState = {
  isTimeLogDrawerOpen: false,
  selectedLabel: '',
};

const timeLogSlice = createSlice({
  name: 'timeLogReducer',
  initialState,
  reducers: {
    toggleTimeLogDrawer: state => {
      state.isTimeLogDrawerOpen
        ? (state.isTimeLogDrawerOpen = false)
        : (state.isTimeLogDrawerOpen = true);
    },
    setSelectedLabel(state, action) {
      state.selectedLabel = action.payload;
    },
  },
});

export const { toggleTimeLogDrawer, setSelectedLabel } = timeLogSlice.actions;
export default timeLogSlice.reducer;
