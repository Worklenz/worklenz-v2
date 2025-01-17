import { createSlice } from '@reduxjs/toolkit';

interface scheduleState {
  isSettingsDrawerOpen: boolean;
  isScheduleDrawerOpen: boolean;
  workingDays: string[];
  workingHours: number;
}

const initialState: scheduleState = {
  isSettingsDrawerOpen: false,
  isScheduleDrawerOpen: false,
  workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  workingHours: 8,
};

const scheduleSlice = createSlice({
  name: 'scheduleReducer',
  initialState,
  reducers: {
    toggleSettingsDrawer: (state) => {
      state.isSettingsDrawerOpen
        ? (state.isSettingsDrawerOpen = false)
        : (state.isSettingsDrawerOpen = true);
    },
    updateSettings(state, action) {
      state.workingDays = action.payload.workingDays;
      state.workingHours = action.payload.workingHours;
    },
    toggleScheduleDrawer: (state) => {
      state.isScheduleDrawerOpen
        ? (state.isScheduleDrawerOpen = false)
        : (state.isScheduleDrawerOpen = true);
    },
  },
});

export const { toggleSettingsDrawer, updateSettings, toggleScheduleDrawer } =
  scheduleSlice.actions;
export default scheduleSlice.reducer;
