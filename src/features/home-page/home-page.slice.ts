import { homePageApiService } from '@/api/home-page/home-page.api.service';
import { MY_DASHBOARD_ACTIVE_FILTER, MY_DASHBOARD_DEFAULT_VIEW } from '@/shared/constants';
import { IHomeTasksConfig, IHomeTasksModel } from '@/types/home/home-page.types';
import { IMyTask } from '@/types/home/my-tasks.types';
import { IMyDashboardAllTasksViewModel, IMyDashboardMyTask } from '@/types/home/tasks.types';
import { IProject } from '@/types/project/project.types';
import { ITaskListGroup } from '@/types/tasks/taskList.types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

const getActiveProjectsFilter = () => +(localStorage.getItem(MY_DASHBOARD_ACTIVE_FILTER) || 0);

interface IHomePageState {
    loadingProjects: boolean;
    projects: IProject[];

    loadingPersonalTasks: boolean;
    personalTasks: IMyTask[];

    homeTasks: IMyDashboardMyTask[];
    homeGroups: ITaskListGroup[];
    homeTasksLoading: boolean;
    homeTasksConfig: IHomeTasksConfig;
    homeTasksUpdating: boolean;
    model: IHomeTasksModel;
    selectedDate: string;
}

const initialState: IHomePageState = {
    loadingProjects: false,
    projects: [],

    loadingPersonalTasks: false,
    personalTasks: [], 

    homeTasks: [],
    homeGroups: [],
    homeTasksLoading: false,
    homeTasksUpdating: false,
    homeTasksConfig: {
        tasks_group_by: 0,
        current_view: getActiveProjectsFilter(),
        current_tab: MY_DASHBOARD_DEFAULT_VIEW,
        is_calendar_view: getActiveProjectsFilter() !== 0,
        selected_date: getActiveProjectsFilter() === 0 ? new Date() : null,
        time_zone: '',
    },
    model: {
        total: 0,
        tasks: [],
        today: 0,
        upcoming: 0,
        overdue: 0,
        no_due_date: 0,
    },
    selectedDate: dayjs().format('YYYY-MM-DD'),
};

export const fetchProjects = createAsyncThunk('homePage/fetchProjects', async () => {
    const response = await homePageApiService.getProjectsByTeam();
    return response.body;
});

export const fetchPersonalTasks = createAsyncThunk('homePage/fetchPersonalTasks', async () => {
    const response = await homePageApiService.getPersonalTasks();
    return response.body;
});

export const fetchHomeTasks = createAsyncThunk('homePage/fetchHomeTasks', async (homeTasksConfig: IHomeTasksConfig) => {
    const response = await homePageApiService.getMyTasks(homeTasksConfig);
    return response.body;
});

export const homePageSlice = createSlice({
    name: 'homePage',
    initialState,
    reducers: {
        setProjects: (state, action) => {
            state.projects = action.payload;
            state.loadingProjects = false;
        },
        setPersonalTasks: (state, action) => {
            state.personalTasks = action.payload;
            state.loadingPersonalTasks = false;
        },
        setHomeTasks: (state, action) => {
            state.homeTasks = action.payload;
            state.homeTasksLoading = false;
        },
        setHomeTasksConfig: (state, action) => {
            state.homeTasksConfig = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProjects.fulfilled, (state, action) => {
            state.projects = action.payload;
            state.loadingProjects = false;
        });
        builder.addCase(fetchProjects.pending, (state) => {
            state.loadingProjects = true;
            state.projects = [];
        });
        builder.addCase(fetchProjects.rejected, (state) => {
            state.loadingProjects = false;
            state.projects = [];
        });

        builder.addCase(fetchPersonalTasks.pending, (state) => {
            state.loadingPersonalTasks = true;
        });
        builder.addCase(fetchPersonalTasks.fulfilled, (state, action) => {
            state.personalTasks = action.payload;
            state.loadingPersonalTasks = false;
        });
        builder.addCase(fetchPersonalTasks.rejected, (state) => {
            state.loadingPersonalTasks = false;
        });

        builder.addCase(fetchHomeTasks.fulfilled, (state, action) => {
            state.model = action.payload;
            state.homeTasksLoading = false;
        }); 
        builder.addCase(fetchHomeTasks.pending, (state) => {
            state.homeTasksLoading = true;
        });
        builder.addCase(fetchHomeTasks.rejected, (state) => {
            state.homeTasksLoading = false;
        });
    },
});

export const { setProjects, setHomeTasksConfig } = homePageSlice.actions;
export default homePageSlice.reducer;