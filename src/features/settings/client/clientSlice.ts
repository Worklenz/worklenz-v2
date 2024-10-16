import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ClientType } from '../../../types/client.types'

type ClientState = {
    clientsList: ClientType[]
    isUpdateClientDrawerOpen: boolean
    isCreateClientDrawerOpen: boolean
}

const initialState: ClientState = {
    clientsList: [],
    isUpdateClientDrawerOpen: false,
    isCreateClientDrawerOpen: false,
}

const clientSlice = createSlice({
    name: 'clientReducer',
    initialState,
    reducers: {
        toggleCreateClientDrawer: (state) => {
            state.isCreateClientDrawerOpen
                ? (state.isCreateClientDrawerOpen = false)
                : (state.isCreateClientDrawerOpen = true)
        },
        toggleUpdateClientDrawer: (state) => {
            state.isUpdateClientDrawerOpen
                ? (state.isUpdateClientDrawerOpen = false)
                : (state.isUpdateClientDrawerOpen = true)
        },
        // action for create client
        addClient: (state, action: PayloadAction<ClientType>) => {
            state.clientsList.push(action.payload)
        },
        // action for update client
        updateClient: (state, action: PayloadAction<ClientType>) => {
            const index = state.clientsList.findIndex(
                (client) => client.clientId === action.payload.clientId
            )
            if (index >= 0) {
                state.clientsList[index] = action.payload
            }
        },
        // action for delete client
        deleteClient: (state, action: PayloadAction<string>) => {
            state.clientsList = state.clientsList.filter(
                (client) => client.clientId !== action.payload
            )
        },
    },
})

export const {
    toggleCreateClientDrawer,
    toggleUpdateClientDrawer,
    addClient,
    updateClient,
    deleteClient,
} = clientSlice.actions
export default clientSlice.reducer
