import React from 'react';
import { 
  createBrowserRouter, 
  RouterProvider, 
  Navigate, 
  Outlet 
} from 'react-router-dom';
import { ProtectedRoute } from '@/components/guards/ProtectedRoute';
import { RoleRedirect } from '@/components/guards/RoleRedirect';
import { MainLayout } from '@/components/layout/MainLayout';

// // Auth components
// import { LoginForm } from '@/components/auth/LoginForm';
// import { ForgotPassword } from '@/components/auth/ForgotPassword';

// // Admin pages
// import { AdminDashboard } from '@/components/pages/admin/AdminDashboard';
// import { UserManagement } from '@/components/pages/admin/UserManagement';
// import { SystemSettings } from '@/components/pages/admin/SystemSettings';

// // User pages
// import { UserDashboard } from '@/components/pages/user/UserDashboard';
// import { UserProfile } from '@/components/pages/user/UserProfile';
// import { UserSettings } from '@/components/pages/user/UserSettings';

// Shared pages
import { NotFound } from '@/components/shared/NotFound';
import UnauthorizedFallback from '@/components/shared/UnauthorizedFallback'

// Layout wrappers for different roles
const AdminLayout: React.FC = () => (
  <ProtectedRoute adminOnly fallback={<UnauthorizedFallback />}>
    <MainLayout>
      <Outlet />
    </MainLayout>
  </ProtectedRoute>
);

const UserLayout: React.FC = () => (
  <ProtectedRoute requiredRole="USER" fallback={<UnauthorizedFallback />}>
    <MainLayout>
      <Outlet />
    </MainLayout>
  </ProtectedRoute>
);

const AnyUserLayout: React.FC = () => (
  <ProtectedRoute>
    <MainLayout>
      <Outlet />
    </MainLayout>
  </ProtectedRoute>
);

const router = createBrowserRouter([
  // Public routes
  // {
  //   path: '/login',
  //   element: <LoginForm />,
  // },
  // {
  //   path: '/forgot-password',
  //   element: <ForgotPassword />,
  // },
  
  // Protected routes with role-based redirection
  {
    path: '/',
    element: <ProtectedRoute><RoleRedirect /></ProtectedRoute>,
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><RoleRedirect /></ProtectedRoute>,
  },

  // Admin routes - only accessible by ADMIN role
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true, // /admin
        element: <Navigate to="/admin/dashboard" replace />,
      },
      // {
      //   path: 'dashboard', // /admin/dashboard
      //   element: <AdminDashboard />,
      // },
      // {
      //   path: 'users', // /admin/users
      //   element: <UserManagement />,
      // },
      // {
      //   path: 'users/:id', // /admin/users/123
      //   element: <UserManagement />,
      // },
      // {
      //   path: 'settings', // /admin/settings
      //   element: <SystemSettings />,
      // },
    ],
  },

  // User routes - only accessible by USER role
  {
    path: '/user',
    element: <UserLayout />,
    children: [
      {
        index: true, // /user
        element: <Navigate to="/user/dashboard" replace />,
      },
      // {
      //   path: 'dashboard', // /user/dashboard
      //   element: <UserDashboard />,
      // },
      // {
      //   path: 'profile', // /user/profile
      //   element: <UserProfile />,
      // },
      // {
      //   path: 'settings', // /user/settings
      //   element: <UserSettings />,
      // },
    ],
  },

  // Shared routes - accessible by any authenticated user
  {
    path: '/app',
    element: <AnyUserLayout />,
    children: [
      // {
      //   path: 'profile', // /app/profile (accessible by all)
      //   element: <UserProfile />,
      // },
    ],
  },

  // Error routes
  {
    path: '/unauthorized',
    // element: <Unauthorized />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};