import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { ProtectedRouteProps } from '@/types/user.types';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

const UnauthorizedFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center max-w-md">
      <div className="mb-4">
        <svg 
          className="mx-auto h-16 w-16 text-red-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
          />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
      <p className="text-gray-600 mb-4">
        You don't have permission to access this page.
      </p>
      <button 
        onClick={() => window.history.back()} 
        className="btn-secondary"
      >
        Go Back
      </button>
    </div>
  </div>
);

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  adminOnly = false,
  fallback,
  redirectTo,
}) => {
  const { isAuthenticated, isLoading, userRole, isInitialized } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading || !isInitialized) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Check admin-only access
  if (adminOnly && userRole !== 'ADMIN') {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return fallback || <UnauthorizedFallback />;
  }

  // Check specific role requirement
  if (requiredRole && userRole !== requiredRole) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return fallback || <UnauthorizedFallback />;
  }

  // All checks passed - render children
  return <>{children}</>;
};