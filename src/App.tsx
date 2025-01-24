// Core dependencies
import React, { Suspense, useEffect } from 'react';
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
import { SuspenseFallback } from './components/suspense-fallback/suspense-fallback';
import { Spin } from 'antd';

const App: React.FC = () => {
  const themeMode = useAppSelector(state => state.themeReducer.mode);
  const language = useAppSelector(state => state.localesReducer.lng);

  initMixpanel(import.meta.env.VITE_MIXPANEL_TOKEN as string);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  useEffect(() => {
    i18next.changeLanguage(language || Language.EN, err => {
      if (err) return logger.error('Error changing language', err);
    });
  }, [language]);

  return (
    <Suspense fallback={<SuspenseFallback />}>
      <SocketProvider>
        <ThemeWrapper>
          <RouterProvider router={router} future={{ v7_startTransition: true }} />
          <PreferenceSelector />
        </ThemeWrapper>
      </SocketProvider>
    </Suspense>
  );
};

export default App;
