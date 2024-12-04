import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import ThemeWrapper from './features/theme/ThemeWrapper';
import PreferenceSelector from './components/PreferenceSelector';
import { useAppSelector } from './hooks/useAppSelector';

const App: React.FC = () => {
  const themeMode = useAppSelector((state) => state.themeReducer.mode);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);  // Set theme on <html> element
  }, [themeMode]);
  return (
    <ThemeWrapper>
      <RouterProvider router={router} />
      <PreferenceSelector />
    </ThemeWrapper>
  );
};

export default App;
