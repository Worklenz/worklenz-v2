import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

type MembersReportsState = {
  isMembersReportsDrawerOpen: boolean;
  isMembersOverviewTasksStatsDrawerOpen: boolean;
  isMembersOverviewProjectsStatsDrawerOpen: boolean;
  activeTab: 'overview' | 'timeLogs' | 'activityLogs' | 'tasks';
  membersList: any[];
  isLoading: boolean;
  error: string | null;
};

// async thunk for fetching members data
export const fetchMembersData = createAsyncThunk(
  'membersReports/fetchMembersData',
  async () => {
    const response = await fetch(
      '/reportingMockData/membersReports/members.json'
    );
    if (!response.ok) throw new Error(`Response error: ${response.status}`);
    return await response.json();
  }
);

const initialState: MembersReportsState = {
  isMembersReportsDrawerOpen: false,
  isMembersOverviewTasksStatsDrawerOpen: false,
  isMembersOverviewProjectsStatsDrawerOpen: false,
  activeTab: 'overview',
  membersList: [],
  isLoading: false,
  error: null,
};

const membersReportsSlice = createSlice({
  name: 'membersReportsReducer',
  initialState,
  reducers: {
    toggleMembersReportsDrawer: (state) => {
      state.isMembersReportsDrawerOpen = !state.isMembersReportsDrawerOpen;
    },
    toggleMembersOverviewTasksStatsDrawer: (state) => {
      state.isMembersOverviewTasksStatsDrawerOpen =
        !state.isMembersOverviewTasksStatsDrawerOpen;
    },
    toggleMembersOverviewProjectsStatsDrawer: (state) => {
      state.isMembersOverviewProjectsStatsDrawerOpen =
        !state.isMembersOverviewProjectsStatsDrawerOpen;
    },
    setMemberReportingDrawerActiveTab: (
      state,
      action: PayloadAction<'overview' | 'timeLogs' | 'activityLogs' | 'tasks'>
    ) => {
      state.activeTab = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembersData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMembersData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.membersList = action.payload;
      })
      .addCase(fetchMembersData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch members data';
      });
  },
});

export const {
  toggleMembersReportsDrawer,
  toggleMembersOverviewTasksStatsDrawer,
  toggleMembersOverviewProjectsStatsDrawer,
  setMemberReportingDrawerActiveTab,
} = membersReportsSlice.actions;
export default membersReportsSlice.reducer;
