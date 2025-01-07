import { homePageApiService } from '@/api/home-page/home-page.api.service';
import { IProject } from '@/types/project/project.types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface IHomePageState {
    projects: IProject[];
}

const initialState: IHomePageState = {
    projects: [],
};

export const fetchProjects = createAsyncThunk('homePage/fetchProjects', async () => {
    const response = await homePageApiService.getProjectsByTeam();
    return response.body;
});

export const homePageSlice = createSlice({
    name: 'homePage',
    initialState,
    reducers: {
        setProjects: (state, action) => {
            state.projects = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProjects.fulfilled, (state, action) => {
            state.projects = action.payload;
        });
    },
});

export const { setProjects } = homePageSlice.actions;
export default homePageSlice.reducer;