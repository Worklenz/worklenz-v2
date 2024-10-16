import React, { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import SettingsLayout from '../layouts/SettingsLayout';
import AdminCenterLayout from '../layouts/AdminCenterLayout';
import { settingsItems } from '../pages/settings/settingsConstants';
import { adminCenterItems } from '../pages/adminCenter/adminCenterConstants';

const Homepage = lazy(() => import('../pages/home/Homepage'));
const ProjectList = lazy(() => import('../pages/projectList/ProjectList'));
const AccountSetup = lazy(() => import('../pages/accountSetup/AccountSetup'));

const MainRoutes = (
    <Route path="worklenz" element={<MainLayout />}>
        <Route
            path="home"
            element={
                <Suspense fallback={<div>Loading...</div>}>
                    <Homepage />
                </Suspense>
            }
        />
        <Route
            path="projects"
            element={
                <Suspense fallback={<div>Loading...</div>}>
                    <ProjectList />
                </Suspense>
            }
        />
        <Route
            path="setup"
            element={
                <Suspense fallback={<div>Loading...</div>}>
                    <AccountSetup />
                </Suspense>
            }
        />

        {/* Settings */}
        <Route path="settings" element={<SettingsLayout />}>
            {settingsItems.map((item) => (
                <Route
                    key={item.endpoint}
                    path={item.endpoint}
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            {item.element}
                        </Suspense>
                    }
                />
            ))}
        </Route>

        {/* Admin Center */}
        <Route path="admin-center" element={<AdminCenterLayout />}>
            {adminCenterItems.map((item) => (
                <Route
                    key={item.endpoint}
                    path={item.endpoint}
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            {item.element}
                        </Suspense>
                    }
                />
            ))}
        </Route>
    </Route>
);

export default MainRoutes;
