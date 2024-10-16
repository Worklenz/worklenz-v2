import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProjectType } from '../../types/project.types'

type ProjectState = {
    projectsList: ProjectType[]
    isDrawerOpen: boolean
}

const initialState: ProjectState = {
    projectsList: [],
    isDrawerOpen: false,
}

const projectSlice = createSlice({
    name: 'projectReducer',
    initialState,
    reducers: {
        toggleDrawer: (state) => {
            state.isDrawerOpen
                ? (state.isDrawerOpen = false)
                : (state.isDrawerOpen = true)
        },
        // action for create project
        createProject: (state, action: PayloadAction<ProjectType>) => {
            state.projectsList.push(action.payload)
        },
        // action for set the is favourite state
        toggleFavouriteProjectSelection: (
            state,
            action: PayloadAction<string>
        ) => {
            const project = state.projectsList.find(
                (project) => project.projectId === action.payload
            )
            if (project) {
                project.isFavourite
                    ? (project.isFavourite = false)
                    : (project.isFavourite = true)
            }
        },
    },
})

export const { toggleDrawer, createProject, toggleFavouriteProjectSelection } =
    projectSlice.actions
export default projectSlice.reducer
