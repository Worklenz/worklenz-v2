import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MemberType } from '../../../types/member.types'

type addMemberState = {
    membersList: MemberType[]
    isDrawerOpen: boolean
}

const initialState: addMemberState = {
    membersList: [],
    isDrawerOpen: false,
}

const addMemberSlice = createSlice({
    name: 'addMemberReducer',
    initialState,
    reducers: {
        toggleDrawer: (state) => {
            state.isDrawerOpen
                ? (state.isDrawerOpen = false)
                : (state.isDrawerOpen = true)
        },
        addMember: (state, action: PayloadAction<MemberType>) => {
            state.membersList.push(action.payload)
        },
    },
})

export const { toggleDrawer, addMember } = addMemberSlice.actions
export default addMemberSlice.reducer
