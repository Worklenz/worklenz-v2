import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserType } from '../../types/user.types'

const initialState: UserType = {
    name: 'Sachintha Prasad',
    email: 'prasadsachintha1231@gmail.com',
    userRole: 'owner',
}

const userSlice = createSlice({
    name: 'userReducer',
    initialState,
    reducers: {
        changeUserName: (state, action: PayloadAction<string>) => {
            state.name = action.payload
        },
    },
})

export const { changeUserName } = userSlice.actions
export default userSlice.reducer
