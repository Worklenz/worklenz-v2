// Core dependencies
import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import i18next from 'i18next';

// Components
import ThemeWrapper from './features/theme/ThemeWrapper';
import PreferenceSelector from './components/PreferenceSelector';
import { SocketProvider } from './socket/socketContext';

// Routes
import router from './app/routes';

// Hooks & Utils
import { useAppSelector } from './hooks/useAppSelector';
import { initMixpanel } from './utils/mixpanelInit';

// Types & Constants
import { Language } from './features/i18n/localesSlice';
import logger from './utils/errorLogger';

const App: React.FC = () => {
  // Redux selectors
  const themeMode = useAppSelector((state) => state.themeReducer.mode);
  const language = useAppSelector((state) => state.localesReducer.lng);

  // Initialize analytics
  initMixpanel(import.meta.env.VITE_MIXPANEL_TOKEN as string);

  // Theme effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  // Language effect
  useEffect(() => {
    i18next.changeLanguage(language || Language.EN, (err) => {
      if (err) return logger.error('Error changing language', err);
    });
  }, [language]);
  
  return (
    <SocketProvider>
      <ThemeWrapper>
        <RouterProvider router={router} />
        <PreferenceSelector />
      </ThemeWrapper>
    </SocketProvider>
  );
};

export default App;