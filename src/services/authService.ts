import type { AuthResponse, UserRoleResponse } from '@/types/user.types';

class AuthService {
  private baseURL = '/api/auth'; // Your backend API base URL

  // Login user
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseURL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include httpOnly cookies
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  }

  // Check if user is authenticated (validate cookie)
  async getMe(): Promise<AuthResponse> {
    const response = await fetch(`${this.baseURL}/me`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Not authenticated');
    }

    return response.json();
  }

  // Get user role (backend determines based on database)
  async getUserRole(): Promise<UserRoleResponse> {
    const response = await fetch(`${this.baseURL}/role`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user role');
    }

    return response.json();
  }

  // Logout user
  async logout(): Promise<void> {
    const response = await fetch(`${this.baseURL}/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
  }

  // Forgot password
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await fetch(`${this.baseURL}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send reset email');
    }

    return response.json();
  }

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const response = await fetch(`${this.baseURL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reset password');
    }

    return response.json();
  }
}

export const authService = new AuthService();