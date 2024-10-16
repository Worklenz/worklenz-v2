import React, { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';

const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const SignupPage = lazy(() => import('../pages/auth/SignupPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));

const AuthRoutes = (
    <Route path="auth" element={<AuthLayout />}>
        <Route
            path="login"
            element={
                <Suspense fallback={<div>Loading...</div>}>
                    <LoginPage />
                </Suspense>
            }
        />
        <Route
            path="signup"
            element={
                <Suspense fallback={<div>Loading...</div>}>
                    <SignupPage />
                </Suspense>
            }
        />
        <Route
            path="forgot-password"
            element={
                <Suspense fallback={<div>Loading...</div>}>
                    <ForgotPasswordPage />
                </Suspense>
            }
        />
    </Route>
);

export default AuthRoutes;
