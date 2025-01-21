import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface scheduleState {
  isSettingsDrawerOpen: boolean;
  isScheduleDrawerOpen: boolean;
  workingDays: string[];
  workingHours: number;
  teamData: any[];
  dateList: any;
  loading: boolean;
  error: string | null;
}

const initialState: scheduleState = {
  isSettingsDrawerOpen: false,
  isScheduleDrawerOpen: false,
  workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  workingHours: 8,
  teamData: [],
  dateList: {},
  loading: false,
  error: null,
};

export const fetchTeamData = createAsyncThunk(
  'schedule/fetchTeamData',
  async () => {
    const response = await fetch('/scheduler-data/team-data.json');
    if (!response.ok) {
      throw new Error('Failed to fetch team data');
    }
    const data = await response.json();
    return data;
  }
);

export const fetchDateList = createAsyncThunk(
  'schedule/fetchDateList',
  async () => {
    const response = await fetch('/scheduler-data/dates-list.json');
    if (!response.ok) {
      throw new Error('Failed to fetch date list');
    }
    const data = await response.json();
    return data;
  }
);

const scheduleSlice = createSlice({
  name: 'scheduleReducer',
  initialState,
  reducers: {
    toggleSettingsDrawer: (state) => {
      state.isSettingsDrawerOpen = !state.isSettingsDrawerOpen;
    },
    updateSettings(state, action) {
      state.workingDays = action.payload.workingDays;
      state.workingHours = action.payload.workingHours;
    },
    toggleScheduleDrawer: (state) => {
      state.isScheduleDrawerOpen = !state.isScheduleDrawerOpen;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamData.fulfilled, (state, action) => {
        state.teamData = action.payload;
        state.loading = false;
      })
      .addCase(fetchTeamData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch team data';
      })
      .addCase(fetchDateList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDateList.fulfilled, (state, action) => {
        state.dateList = action.payload;
        state.loading = false;
      })
      .addCase(fetchDateList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch date list';
      });
  },
});

export const { toggleSettingsDrawer, updateSettings, toggleScheduleDrawer } =
  scheduleSlice.actions;
export default scheduleSlice.reducer;
