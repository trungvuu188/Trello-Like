import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
    Outlet,
} from 'react-router-dom';
import ProtectedRoute from '@/components/guards/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';

// Shared pages
import NotFound from '@/components/shared/NotFound';
import UnauthorizedFallback from '@/components/shared/UnauthorizedFallback';

// Auth pages
import LoginForm from '@/components/auth/LoginForm';
import AuthLayout from '@/components/layout/AuthLayout';
import RegisterForm from '@/components/auth/RegisterForm';
import Board from '@/pages/workspace/Board';
import SidebarLayout from '@/components/layout/SidebarLayout';
import Boards from '@/pages/Boards';
import Template from '@/pages/Template';
import Home from '@/pages/Home';
import Member from '@/pages/workspace/Member';
import Setting from '@/pages/workspace/Setting';
import WorkspaceDetail from '@/pages/workspace/WorkspaceDetail';

// Layout wrappers for different roles
const AdminLayout = () => (
    <ProtectedRoute adminOnly fallback={<UnauthorizedFallback />}>
        <MainLayout>
            <Outlet />
        </MainLayout>
    </ProtectedRoute>
);

const   UserLayout = () => (
    <ProtectedRoute requiredRole='user' fallback={<UnauthorizedFallback />}>
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
                element: <Navigate to={'/login'} replace />,
            },
            {
                path: 'login',
                element: <LoginForm />,
            },
            {
                path: 'signup',
                element: <RegisterForm />,
            },
        ],
    },

    // Admin routes - only accessible by ADMIN role
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <Navigate to='/admin/dashboard' replace />,
            },
        ],
    },

    // User routes - only accessible by USER role
    {
        path: '/',
        element: <UserLayout />,
        children: [
            {
                path: 'user',
                element: <SidebarLayout />,
                children: [
                    {
                        path: 'boards',
                        element: <Boards />,
                    },
                    {
                        path: 'templates',
                        element: <Template />
                    },
                    {
                        path: 'home',
                        element: <Home />
                    },
                    {
                        path: 'detail',
                        element: <WorkspaceDetail />,
                    }
                ]
            },
            {
                path: 'workspace',
                children: [
                    {
                        path: 'board',
                        element: <Board />,
                    },
                    {
                        path: 'member',
                        element: <Member />,
                    },
                    {
                        path: 'setting',
                        element: <Setting />,
                    },
                ]
            },
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
