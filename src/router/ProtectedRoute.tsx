import type { UserRole } from "@/types/user.types";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
    children: ReactNode
    requiredRole?: UserRole
    fallback?: ReactNode
    redirectTo?: string
}

export const ProtectedRoute = ({ children, requiredRole, fallback, redirectTo }: ProtectedRouteProps) => {
    
    // TODO: TS6133 will be removed when auth is implemented
    console.log({ children, fallback, redirectTo }); 
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