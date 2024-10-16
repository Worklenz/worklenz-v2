import React from 'react';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Navigate } from 'react-router-dom';
import AuthRoutes from './AuthRoutes';
import MainRoutes from './MainRoutes';
import NotFoundPage from '../pages/notFoundPage/NotFoundPage';

const AppRoutes = () => {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/">
                {/* Default redirect to login */}
                <Route index element={<Navigate to="/auth/login" replace />} />

                {/* Authenticated routes */}
                {AuthRoutes}

                {/* Main Application routes */}
                {MainRoutes}

                {/* 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        )
    );

    return <RouterProvider router={router} />;
};

export default AppRoutes;
