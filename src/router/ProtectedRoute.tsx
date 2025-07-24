import type { UserRole } from "@/types";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
    children: ReactNode
    requiredRole?: UserRole
    fallback?: ReactNode
    redirectTo?: string
}

export const ProtectedRoute = ({ children, requiredRole, fallback, redirectTo }: ProtectedRouteProps) => {
    
    const isAuthenticated = false;
    const location = useLocation();

    if (!isAuthenticated) {
        return (
            <Navigate 
                to="/login"
                state={{ from: location.pathname }}
                replace
            />
        )
    }

    if (requiredRole) {}
}