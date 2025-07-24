// User-related type definitions (Role-based system)

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  // NO role field here - never trust frontend with roles
}

export type UserRole = 'ADMIN' | 'USER';

export interface AuthResponse {
  user: User;
  message: string;
}

export interface UserRoleResponse {
  role: UserRole;
  message: string;
}

// Route-related types
export interface RouteConfig {
  path: string;
  requiredRole?: UserRole;
  adminOnly?: boolean;
}

// Component prop types
export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  adminOnly?: boolean;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

// Layout props
export interface LayoutProps {
  children: React.ReactNode;
}