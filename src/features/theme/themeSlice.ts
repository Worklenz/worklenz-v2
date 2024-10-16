import { createSlice } from '@reduxjs/toolkit';

type ThemeType = 'default' | 'dark';

type ThemeState = {
    mode: ThemeType;
};

// Function to detect the system's theme preference
const getSystemTheme = (): ThemeType => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'default';
};

// Function for getting the current theme value from localStorage or system theme
const getThemeModeFromLocalStorage = (): ThemeType => {
    const savedTheme = localStorage.getItem('theme') as ThemeType | null;
    return savedTheme || getSystemTheme(); // If no theme is saved, fallback to system preference
};

// Function for saving the current theme value in localStorage
const saveThemeModeToLocalStorage = (themeMode: ThemeType) => {
    localStorage.setItem('theme', themeMode);
};

const initialState: ThemeState = {
    mode: getThemeModeFromLocalStorage(),
};

const themeSlice = createSlice({
    name: 'themeReducer',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode === 'default' ? 'dark' : 'default';
            saveThemeModeToLocalStorage(state.mode);
        },
        setTheme: (state, action) => {
            state.mode = action.payload;
            saveThemeModeToLocalStorage(state.mode);
        },
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
