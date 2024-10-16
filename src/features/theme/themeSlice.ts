import { createSlice } from '@reduxjs/toolkit'

type ThemeType = 'default' | 'dark'

type ThemeState = {
    mode: ThemeType
}

// function for get current theme value from the local storage
const getThemeModeFromLocalStorage = () => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme === 'default'
        ? (savedTheme as 'default')
        : savedTheme === 'dark'
          ? (savedTheme as 'dark')
          : 'default'
}
// function for save the current theme value in the local storage
const saveThemeModeToLocalStorage = (themeMode: ThemeType) => {
    localStorage.setItem('theme', themeMode)
}

const initialState: ThemeState = {
    mode: getThemeModeFromLocalStorage(),
}

const themeSlice = createSlice({
    name: 'themeReducer',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode === 'default' ? 'dark' : 'default'
            saveThemeModeToLocalStorage(state.mode)
        },
    },
})

export const { toggleTheme } = themeSlice.actions
export default themeSlice.reducer
