import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ReportingState {
  includeArchivedProjects: boolean;
  selectedProjectIds: string[];
  selectedTeamIds: string[];
  showOverViewTeamDrawer: boolean;
  duration: string;
  dateRange: string;
}

const initialState: ReportingState = {
  includeArchivedProjects: false,
  selectedProjectIds: [],
  selectedTeamIds: [],
  showOverViewTeamDrawer: false,
  duration: 'LAST_WEEK', // Default value
  dateRange: '',
};

const reportingSlice = createSlice({
  name: 'reporting',
  initialState,
  reducers: {
    toggleIncludeArchived: state => {
      state.includeArchivedProjects = !state.includeArchivedProjects;
    },
    setSelectedProjects: (state, action: PayloadAction<string[]>) => {
      state.selectedProjectIds = action.payload;
    },
    setSelectedTeams: (state, action: PayloadAction<string[]>) => {
      state.selectedTeamIds = action.payload;
    },
    clearSelections: state => {
      state.selectedProjectIds = [];
      state.selectedTeamIds = [];
    },
    toggleOverViewTeamDrawer: state => {
      state.showOverViewTeamDrawer = !state.showOverViewTeamDrawer;
    },
    setDuration: (state, action: PayloadAction<string>) => {
      state.duration = action.payload;
    },
    setDateRange: (state, action: PayloadAction<string>) => {
      state.dateRange = action.payload;
    },
  },
});

export const {
  toggleIncludeArchived,
  setSelectedProjects,
  setSelectedTeams,
  clearSelections,
  toggleOverViewTeamDrawer,
  setDuration,
  setDateRange,
} = reportingSlice.actions;

export default reportingSlice.reducer;
