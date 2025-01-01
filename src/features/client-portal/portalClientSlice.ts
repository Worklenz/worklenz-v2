import { createSlice } from "@reduxjs/toolkit";

interface ClientState {
    isClientDrawerOpen: boolean;
    isCreateClientDrawerOpen: boolean;
}

const initialState: ClientState = {
    isClientDrawerOpen: false,
    isCreateClientDrawerOpen: false,
};

const portalClientSlice = createSlice({
    name: 'portalClientReducer',
    initialState,
    reducers: {
        toggleClientDrawer: (state) => {
            state.isClientDrawerOpen = !state.isClientDrawerOpen;
        },
        toggleCreateClientDrawer: (state) => {
            state.isCreateClientDrawerOpen = !state.isCreateClientDrawerOpen;
        }
    }
})

export const { toggleClientDrawer, toggleCreateClientDrawer } = portalClientSlice.actions;
export default portalClientSlice.reducer