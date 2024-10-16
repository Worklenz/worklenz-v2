import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import { TeamsType } from '../../../types/adminCenter/team.types'

interface teamState {
    teamsList: TeamsType[]
    isDrawerOpen: boolean
    isSettingDrawerOpen: boolean
}

const initialState: teamState = {
    teamsList: [
        {
            teamId: nanoid(),
            teamName: 'Raveesha Dilanka',
            membersCount: 1,
            members: ['Raveesha Dilanka'],
            created: new Date('2024-05-08T08:30:00'),
        },
    ],
    isDrawerOpen: false,
    isSettingDrawerOpen: false,
}

const teamSlice = createSlice({
    name: 'teamReducer',
    initialState,
    reducers: {
        toggleDrawer: (state) => {
            state.isDrawerOpen
                ? (state.isDrawerOpen = false)
                : (state.isDrawerOpen = true)
        },
        addTeam: (state, action: PayloadAction<TeamsType>) => {
            state.teamsList.push(action.payload)
        },
        toggleSettingDrawer: (state) => {
            state.isSettingDrawerOpen
                ? (state.isSettingDrawerOpen = false)
                : (state.isSettingDrawerOpen = true)
        },
        updateTeam: (state, action: PayloadAction<TeamsType>) => {
            const index = state.teamsList.findIndex(
                (team) => team.teamId === action.payload.teamId
            )
            state.teamsList[index] = action.payload
        },
        deleteTeam: (state, action: PayloadAction<string>) => {
            state.teamsList = state.teamsList.filter(
                (team) => team.teamId !== action.payload
            )
        },
    },
})

export const {
    toggleDrawer,
    addTeam,
    toggleSettingDrawer,
    updateTeam,
    deleteTeam,
} = teamSlice.actions
export default teamSlice.reducer
