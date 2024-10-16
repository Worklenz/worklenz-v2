import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TaskType } from '../../types/task.types'

type TaskState = {
    tasks: TaskType[]
}

const initialState: TaskState = {
    tasks: [],
}

const taskSlice = createSlice({
    name: 'taskReducer',
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<TaskType>) => {
            state.tasks.push(action.payload)
        },
    },
})

export const { addTask } = taskSlice.actions
export default taskSlice.reducer
