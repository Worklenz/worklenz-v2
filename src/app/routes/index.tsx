import { createBrowserRouter, Navigate, RouteObject, useLocation } from 'react-router-dom';
import rootRoutes from './root-routes';
import authRoutes from './auth-routes';
import mainRoutes, { licenseExpiredRoute } from './main-routes';
import notFoundRoute from './not-found-route';
import accountSetupRoute from './account-setup-routes';
import reportingRoutes from './reporting-routes';
import { useAuthService } from '@/hooks/useAuth';
import { AuthenticatedLayout } from '@/layouts/AuthenticatedLayout';
import ErrorBoundary from '@/components/ErrorBoundary';
import NotFoundPage from '@/pages/404-page/404-page';
import { ISUBSCRIPTION_TYPE } from '@/shared/constants';
import LicenseExpired from '@/pages/license-expired/license-expired';

interface GuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: GuardProps) => {
  const isAuthenticated = useAuthService().isAuthenticated();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const AdminGuard = ({ children }: GuardProps) => {
  const isAuthenticated = useAuthService().isAuthenticated();
  const isOwnerOrAdmin = useAuthService().isOwnerOrAdmin();
  const currentSession = useAuthService().getCurrentSession();
  const isFreePlan = currentSession?.subscription_type === ISUBSCRIPTION_TYPE.FREE;
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!isOwnerOrAdmin || isFreePlan) {
    return <Navigate to="/worklenz/unauthorized" replace />;
  }

  return <>{children}</>;
};

export const LicenseExpiryGuard = ({ children }: GuardProps) => {
  const isAuthenticated = useAuthService().isAuthenticated();
  const currentSession = useAuthService().getCurrentSession();
  const location = useLocation();
  const isAdminCenterRoute = location.pathname.includes('/worklenz/admin-center');
  const isLicenseExpiredRoute = location.pathname === '/worklenz/license-expired';

  // Don't check or redirect if we're already on the license-expired page
  if (isLicenseExpiredRoute) {
    console.log('Already on license expired page, skipping redirect check');
    return <>{children}</>;
  }

  // Check if trial is expired more than 7 days or if is_expired flag is set
  const isLicenseExpiredMoreThan7Days = () => {
    console.log('Current session:', currentSession);
    
    // Quick bail if no session data is available
    if (!currentSession) {
      console.log('No current session data available');
      return false;
    }
    
    // Check is_expired flag first
    if (currentSession.is_expired) {
      console.log('License is marked as expired in session');
      
      // If no trial_expire_date exists but is_expired is true, defer to backend check
      if (!currentSession.trial_expire_date) {
        console.log('No trial expiry date but is_expired is true - assuming system-determined expiration');
        return true;
      }
      
      // If there is a trial_expire_date, check if it's more than 7 days past
      const today = new Date();
      const expiryDate = new Date(currentSession.trial_expire_date);
      const diffTime = today.getTime() - expiryDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      console.log('License check for expired license:', {
        today: today.toISOString(),
        expiryDate: expiryDate.toISOString(),
        diffDays
      });
      
      // Redirect if more than 7 days past expiration
      return diffDays > 7;
    }
    
    // If not marked as expired but has trial_expire_date, do a date check
    if (currentSession.trial_expire_date) {
      const today = new Date();
      const expiryDate = new Date(currentSession.trial_expire_date);
      
      console.log('License check for trial_expire_date:', {
        today: today.toISOString(),
        expiryDate: expiryDate.toISOString(),
        trialExpireDate: currentSession.trial_expire_date
      });
      
      const diffTime = today.getTime() - expiryDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      console.log(`Days since expiration: ${diffDays}`);
      
      // If expired more than 7 days, redirect
      return diffDays > 7;
    }
    
    // No expiration data found
    console.log('No expiration data found in session');
    return false;
  };

  // Add this explicit check and log the result
  const shouldRedirect = isAuthenticated && isLicenseExpiredMoreThan7Days() && !isAdminCenterRoute;
  console.log('License redirection check:', {
    isAuthenticated,
    isExpiredMoreThan7Days: isLicenseExpiredMoreThan7Days(),
    isAdminCenterRoute,
    shouldRedirect,
    path: location.pathname
  });

  if (shouldRedirect) {
    console.log('Redirecting to license expired page');
    return <Navigate to="/worklenz/license-expired" replace />;
  }

  return <>{children}</>;
};

export const SetupGuard = ({ children }: GuardProps) => {
  const isAuthenticated = useAuthService().isAuthenticated();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Helper to wrap routes with guards
const wrapRoutes = (
  routes: RouteObject[],
  Guard: React.ComponentType<{ children: React.ReactNode }>
): RouteObject[] => {
  return routes.map(route => {
    const wrappedRoute = {
      ...route,
      element: <Guard>{route.element}</Guard>,
    };

    if (route.children) {
      wrappedRoute.children = wrapRoutes(route.children, Guard);
    }

    if (route.index) {
      delete wrappedRoute.children;
    }

    return wrappedRoute;
  });
};

// Static license expired component that doesn't rely on translations or authentication
const StaticLicenseExpired = () => {
  console.log('Static license expired component rendering');
  
  return (
    <div style={{ 
      marginTop: 65, 
      minHeight: '90vh', 
      backgroundColor: '#f5f5f5', 
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        <h1 style={{ fontSize: '24px', color: '#faad14', marginBottom: '16px' }}>
          Your Worklenz trial has expired!
        </h1>
        <p style={{ fontSize: '16px', color: '#555', marginBottom: '24px' }}>
          Please upgrade now to continue using Worklenz.
        </p>
        <button 
          style={{
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
          onClick={() => window.location.href = '/worklenz/admin-center/billing'}
        >
          Upgrade now
        </button>
      </div>
    </div>
  );
};

const publicRoutes = [
  ...rootRoutes, 
  ...authRoutes,
  notFoundRoute
];
const protectedMainRoutes = wrapRoutes(mainRoutes, AuthGuard);
const adminRoutes = wrapRoutes(reportingRoutes, AdminGuard);
const setupRoutes = wrapRoutes([accountSetupRoute], SetupGuard);

// Apply LicenseExpiryGuard to all protected routes
const withLicenseExpiryCheck = (routes: RouteObject[]): RouteObject[] => {
  return routes.map(route => {
    const wrappedRoute = {
      ...route,
      element: <LicenseExpiryGuard>{route.element}</LicenseExpiryGuard>,
    };

    if (route.children) {
      wrappedRoute.children = withLicenseExpiryCheck(route.children);
    }

    return wrappedRoute;
  });
};

const licenseCheckedMainRoutes = withLicenseExpiryCheck(protectedMainRoutes);

const router = createBrowserRouter([
  {
    element: <ErrorBoundary><AuthenticatedLayout /></ErrorBoundary>,
    errorElement: <ErrorBoundary><NotFoundPage /></ErrorBoundary>,
    children: [
      ...licenseCheckedMainRoutes,
      ...adminRoutes,
      ...setupRoutes,
      licenseExpiredRoute,
    ],
  },
  ...publicRoutes,
]);

export default router;
