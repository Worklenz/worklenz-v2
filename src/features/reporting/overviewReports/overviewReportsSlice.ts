import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

type overviewReportsState = {
  isOverviewReportsDrawerOpen: boolean;
  teamsList: any[];
  isLoading: boolean;
  error: string | null;
};

// async thunk for fetching overview data
export const fetchTeamsData = createAsyncThunk(
  'overviewReports/fetchTeamsData',
  async () => {
    const response = await fetch(
      '/reportingMockData/overviewReports/teamsData.json'
    );
    if (!response.ok) throw new Error(`Response error: ${response.status}`);
    return await response.json();
  }
);

const initialState: overviewReportsState = {
  isOverviewReportsDrawerOpen: false,
  teamsList: [],
  isLoading: false,
  error: null,
};

const overviewReportsSlice = createSlice({
  name: 'overviewReportsReducer',
  initialState,
  reducers: {
    toggleOverviewReportsDrawer: (state) => {
      state.isOverviewReportsDrawerOpen = !state.isOverviewReportsDrawerOpen;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamsData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeamsData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teamsList = action.payload;
      })
      .addCase(fetchTeamsData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch overview data';
      });
  },
});

export const { toggleOverviewReportsDrawer } = overviewReportsSlice.actions;
export default overviewReportsSlice.reducer;
