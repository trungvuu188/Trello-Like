import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet
} from 'react-router-dom';
import ProtectedRoute from '@/components/guards/ProtectedRoute';
import { RoleRedirect } from '@/components/guards/RoleRedirect';
import { MainLayout } from '@/components/layout/MainLayout';

// Shared pages
import NotFound from '@/components/shared/NotFound';
import UnauthorizedFallback from '@/components/shared/UnauthorizedFallback';

// Auth pages
import LoginForm from '@/components/auth/LoginForm';
import AuthLayout from '@/components/layout/AuthLayout';
import RegisterForm from '@/components/auth/RegisterForm';
import UserDashboard from '@/pages/UserDashboard';

// Layout wrappers for different roles
const AdminLayout = () => (
  <ProtectedRoute adminOnly fallback={<UnauthorizedFallback />}>
    <MainLayout>
      <Outlet />
    </MainLayout>
  </ProtectedRoute>
);

const UserLayout = () => (
  <ProtectedRoute requiredRole="user" fallback={<UnauthorizedFallback />}>
    <MainLayout>
      <Outlet />
    </MainLayout>
  </ProtectedRoute>
);

const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to={'/login'} replace />
      },
      {
        path: 'login',
        element: <LoginForm />
      },
      {
        path: 'signup',
        element: <RegisterForm />
      }
    ]
  },

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
      // {
      //   index: true, 
      //   element: <Navigate to="/user/dashboard" replace />,
      // },
      {
        path: 'dashboard',
        element: <UserDashboard />,
      },
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

  // Error routes
  {
    path: '/unauthorized',
    element: <UnauthorizedFallback />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};