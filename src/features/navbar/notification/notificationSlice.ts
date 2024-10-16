import { NotificationType } from '../../../types/notification.types'
import { createSlice } from '@reduxjs/toolkit'

type NotificationState = {
    notification: NotificationType[]
    isDrawerOpen: boolean
}

const initialState: NotificationState = {
    notification: [],
    isDrawerOpen: false,
}

const notificationSlice = createSlice({
    name: 'notificationReducer',
    initialState,
    reducers: {
        toggleDrawer: (state) => {
            state.isDrawerOpen
                ? (state.isDrawerOpen = false)
                : (state.isDrawerOpen = true)
        },
    },
})

export const { toggleDrawer } = notificationSlice.actions
export default notificationSlice.reducer
