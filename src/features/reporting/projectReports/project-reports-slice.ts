import { reportingProjectsApiService } from '@/api/reporting/reporting-projects.api.service';
import { DEFAULT_PAGE_SIZE, FILTER_INDEX_KEY } from '@/shared/constants';
import { IProjectCategory } from '@/types/project/projectCategory.types';
import { IProjectHealth } from '@/types/project/projectHealth.types';
import { IProjectManager } from '@/types/project/projectManager.types';
import { IProjectStatus } from '@/types/project/projectStatus.types';
import { IGetProjectsRequestBody, IRPTOverviewProject, IRPTOverviewProjectMember, IRPTProject } from '@/types/reporting/reporting.types';
import { getFromLocalStorage } from '@/utils/localStorageFunctions';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const filterIndex = () => {
  return +(getFromLocalStorage(FILTER_INDEX_KEY.toString()) || 0);
};

type ProjectReportsState = {
  isProjectReportsDrawerOpen: boolean;

  isProjectReportsMembersTaskDrawerOpen: boolean;
  selectedMember: IRPTOverviewProjectMember | null;
  selectedProject: IRPTOverviewProject | null;

  projectList: IRPTProject[];
  total: number;
  isLoading: boolean;
  error: string | null;

  // filters
  index: number;
  pageSize: number;
  field: string;
  order: string;
  searchQuery: string;
  filterIndex: number;
  archived: boolean;
  selectedProjectStatuses: IProjectStatus[];
  selectedProjectHealths: IProjectHealth[];
  selectedProjectCategories: IProjectCategory[];
  selectedProjectManagers: IProjectManager[];
};

export const fetchProjectData = createAsyncThunk(
  'projectReports/fetchProjectData',
  async (_, { getState }) => {
    const state = (getState() as any).projectReportsReducer;
    const body: IGetProjectsRequestBody = {
      index: state.index,
      size: state.pageSize,
      field: state.field,
      order: state.order,
      search: state.searchQuery,
      filter: state.filterIndex.toString(),
      statuses: state.selectedProjectStatuses.map((s: IProjectStatus) => s.id || ''),
      healths: state.selectedProjectHealths.map((h: IProjectHealth) => h.id || ''),
      categories: state.selectedProjectCategories.map((c: IProjectCategory) => c.id || ''),
      project_managers: state.selectedProjectManagers.map((m: IProjectManager) => m.id || ''),
      archived: state.archived,
    };
    const response = await reportingProjectsApiService.getProjects(body);
    return response.body;
  }
);

const initialState: ProjectReportsState = {
  isProjectReportsDrawerOpen: false,

  isProjectReportsMembersTaskDrawerOpen: false,
  selectedMember: null,
  selectedProject: null, 

  projectList: [],
  total: 0,
  isLoading: false,
  error: null,

  // filters
  index: 1,
  pageSize: 10,
  field: 'name',
  order: 'asc',
  searchQuery: '',
  filterIndex: filterIndex(),
  archived: false,
  selectedProjectStatuses: [],
  selectedProjectHealths: [],
  selectedProjectCategories: [],
  selectedProjectManagers: [],
};

const projectReportsSlice = createSlice({
  name: 'projectReportsReducer',
  initialState,
  reducers: {
    toggleProjectReportsDrawer: state => {
      state.isProjectReportsDrawerOpen = !state.isProjectReportsDrawerOpen;
    },
    toggleProjectReportsMembersTaskDrawer: state => {
      state.isProjectReportsMembersTaskDrawerOpen = !state.isProjectReportsMembersTaskDrawerOpen;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedProjectStatuses: (state, action) => {
      const status = action.payload;
      const index = state.selectedProjectStatuses.findIndex(s => s.id === status.id);
      if (index >= 0) {
        state.selectedProjectStatuses.splice(index, 1);
      } else {
        state.selectedProjectStatuses.push(status);
      }
    },
    setSelectedProjectHealths: (state, action) => {
      const health = action.payload;
      const index = state.selectedProjectHealths.findIndex(h => h.id === health.id);
      if (index >= 0) {
        state.selectedProjectHealths.splice(index, 1);
      } else {
        state.selectedProjectHealths.push(health);
      }
    },
    setSelectedProjectCategories: (state, action) => {
      const category = action.payload;
      const index = state.selectedProjectCategories.findIndex(c => c.id === category.id);
      if (index >= 0) {
        state.selectedProjectCategories.splice(index, 1);
      } else {
        state.selectedProjectCategories.push(category);
      }
    },
    setSelectedProjectManagers: (state, action) => {
      const manager = action.payload;
      const index = state.selectedProjectManagers.findIndex(m => m.id === manager.id);
      if (index >= 0) {
        state.selectedProjectManagers.splice(index, 1);
      } else {
        state.selectedProjectManagers.push(manager);
      }
    },
    setArchived: (state, action) => {
      state.archived = action.payload;
    },
    setIndex: (state, action) => {
      state.index = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    setField: (state, action) => {
      state.field = action.payload;
    },
    setOrder: (state, action) => {
      state.order = action.payload;
    },
    setProjectHealth: (state, action) => {
      const health = action.payload;
      const project = state.projectList.find(p => p.id === health.id);
      if (project) {
        project.project_health = health.id;
        project.health_name = health.name;
        project.health_color = health.color_code;
      }
    },
    setProjectStatus: (state, action) => {
      const status = action.payload;
      const project = state.projectList.find(p => p.id === status.id);
      if (project) {
        project.status_id = status.id;
        project.status_name = status.name;
        project.status_color = status.color_code;
      }
    },
    setProjectStartDate: (state, action) => {
      const project = state.projectList.find(p => p.id === action.payload.id);
      if (project) {
        project.start_date = action.payload.start_date;
      }
    },
    setProjectEndDate: (state, action) => {
      const project = state.projectList.find(p => p.id === action.payload.id);
      if (project) {
        project.end_date = action.payload.end_date;
      }
    },
    setSelectedMember: (state, action) => {
      state.selectedMember = action.payload;
    },
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProjectData.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjectData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.total = action.payload.total || 0;
        state.projectList = action.payload.projects || [];
      })
      .addCase(fetchProjectData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch project data';
      });
  },
});

export const {
  toggleProjectReportsDrawer,
  toggleProjectReportsMembersTaskDrawer,
  setSearchQuery,
  setSelectedProjectStatuses,
  setSelectedProjectHealths,
  setSelectedProjectCategories,
  setSelectedProjectManagers,
  setArchived,
  setProjectStartDate,
  setProjectEndDate,
  setIndex,
  setPageSize,
  setField,
  setOrder,
  setProjectHealth,
  setProjectStatus,
  setSelectedMember,
  setSelectedProject,
} = projectReportsSlice.actions;
export default projectReportsSlice.reducer;
