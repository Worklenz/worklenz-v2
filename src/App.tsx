import {
    createBrowserRouter,
    createRoutesFromElements,
    Navigate,
    Route,
    RouterProvider,
} from 'react-router-dom'

import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import AuthLayout from './layouts/AuthLayout'
import ThemeWrapper from './features/theme/ThemeWrapper'
import PreferenceSelector from './components/PreferenceSelector'
import NotFoundPage from './pages/notFoundPage/NotFoundPage'
import MainLayout from './layouts/MainLayout'
import Homepage from './pages/home/Homepage'
import AccountSetup from './pages/accountSetup/AccountSetup'
import ProjectList from './pages/projectList/ProjectList'
import SettingsLayout from './layouts/SettingsLayout'
import { settingsItems } from './pages/settings/settingsConstants'
import { adminCenterItems } from './pages/adminCenter/adminCenterConstants'
import AdminCenterLayout from './layouts/AdminCenterLayout'

const App = () => {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/">
                {/* Default redirect to login page */}
                <Route index element={<Navigate to="/auth/login" replace />} />

                {/* auth routes */}
                <Route path={'/auth'} element={<AuthLayout />}>
                    <Route path="/auth/login" element={<LoginPage />} />
                    <Route path="/auth/signup" element={<SignupPage />} />
                    <Route
                        path="/auth/forgot-password"
                        element={<ForgotPasswordPage />}
                    />
                </Route>

                <Route path="worklenz/setup" element={<AccountSetup />} />

                {/* main pages routes */}
                <Route path="/worklenz" element={<MainLayout />}>
                    <Route path="/worklenz/home" element={<Homepage />} />
                    <Route
                        path="/worklenz/projects"
                        element={<ProjectList />}
                    />

                    {/* settings page routes */}
                    <Route
                        path="/worklenz/settings"
                        element={<SettingsLayout />}
                    >
                        {/* setting page sub routes */}
                        {/* setting items import from the setting constants file locale in pages/settings  */}
                        {settingsItems.map((item) => (
                            <Route
                                path={`/worklenz/settings/${item.endpoint}`}
                                element={item.element}
                            />
                        ))}
                    </Route>
                    {/* settings page routes */}
                    <Route
                        path="/worklenz/admin-center"
                        element={<AdminCenterLayout />}
                    >
                        {/* setting page sub routes */}
                        {/* setting items import from the setting constants file locale in pages/settings  */}
                        {adminCenterItems.map((item) => (
                            <Route
                                path={`/worklenz/admin-center/${item.endpoint}`}
                                element={item.element}
                            />
                        ))}
                    </Route>
                </Route>

                {/* not found pages */}
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        )
    )
    return (
        <ThemeWrapper>
            <RouterProvider router={router} />
            <PreferenceSelector />
        </ThemeWrapper>
    )
}

export default App
