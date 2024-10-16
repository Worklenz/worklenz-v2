import React from 'react';
import ThemeWrapper from './features/theme/ThemeWrapper';
import PreferenceSelector from './features/theme/ThemeSelector';
import AppRoutes from './routes/AppRoutes';

const App = () => {
    return (
        <ThemeWrapper>
            <AppRoutes />
            <PreferenceSelector />
        </ThemeWrapper>
    );
};

export default App;
