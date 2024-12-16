import { createSlice } from '@reduxjs/toolkit';
import i18n from '../../i18n';

type LanguageType = 'en' | 'es';

type LocalesState = {
  lng: LanguageType;
};

const STORAGE_KEY = 'i18nextLng';
const DEFAULT_LANGUAGE: LanguageType = 'en';

/**
 * Gets the current language from local storage
 * @returns The stored language or default language if not found
 */
const getLanguageFromLocalStorage = (): LanguageType => {
  const savedLng = localStorage.getItem(STORAGE_KEY);
  if (savedLng === 'en' || savedLng === 'es') {
    return savedLng;
  }
  return DEFAULT_LANGUAGE;
};

/**
 * Saves the current language to local storage
 * @param lng Language to save
 */
const saveLanguageInLocalStorage = (lng: LanguageType): void => {
  localStorage.setItem(STORAGE_KEY, lng);
};

const initialState: LocalesState = {
  lng: getLanguageFromLocalStorage(),
};

const localesSlice = createSlice({
  name: 'localesReducer',
  initialState,
  reducers: {
    toggleLng: (state) => {
      const newLang: LanguageType = state.lng === 'en' ? 'es' : 'en';
      state.lng = newLang;
      saveLanguageInLocalStorage(newLang);
      i18n.changeLanguage(newLang);
    },
  },
});

export const { toggleLng } = localesSlice.actions;
export default localesSlice.reducer;
