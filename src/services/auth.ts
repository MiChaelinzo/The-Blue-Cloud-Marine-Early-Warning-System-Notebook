import { useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  organization: string;
  role: 'researcher' | 'operator' | 'admin';
  permissions: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Blue-Cloud authentication service
class AuthService {
  private user: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  constructor() {
    // Check for existing session
    const savedUser = localStorage.getItem('blue-cloud-user');
    if (savedUser) {
      try {
        this.user = JSON.parse(savedUser);
      } catch (error) {
        localStorage.removeItem('blue-cloud-user');
      }
    }
  }

  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      // For demo purposes, simulate successful login
      if ((email === 'demo@blue-cloud.org' && password === 'demo123') || 
          (email.includes('@') && password.length >= 6)) {
        this.user = {
          id: '1',
          email,
          name: email === 'demo@blue-cloud.org' ? 'Demo User' : email.split('@')[0],
          organization: email === 'demo@blue-cloud.org' ? 'Blue-Cloud Demo' : 'Marine Research Institute',
          role: email === 'demo@blue-cloud.org' ? 'admin' : 'researcher',
          permissions: email === 'demo@blue-cloud.org' ? 
            ['read:oceanographic', 'read:species', 'write:alerts', 'admin:all'] :
            ['read:oceanographic', 'read:species', 'write:alerts']
        };
        localStorage.setItem('blue-cloud-user', JSON.stringify(this.user));
        localStorage.setItem('blue-cloud-token', 'demo-token-' + Date.now());
        this.notifyListeners();
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }

  async logout(): Promise<void> {
    this.user = null;
    localStorage.removeItem('blue-cloud-user');
    localStorage.removeItem('blue-cloud-token');
    this.notifyListeners();
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return this.user !== null;
  }

  hasPermission(permission: string): boolean {
    return this.user?.permissions.includes(permission) || false;
  }

  subscribe(listener: (user: User | null) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.user));
  }
}

export const authService = new AuthService();

// React hook for authentication
export function useAuth(): AuthState & {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
} {
  const [authState, setAuthState] = useState<AuthState>({
    user: authService.getCurrentUser(),
    isAuthenticated: authService.isAuthenticated(),
    isLoading: false,
  });

  useEffect(() => {
    const unsubscribe = authService.subscribe((user) => {
      setAuthState({
        user,
        isAuthenticated: user !== null,
        isLoading: false,
      });
    });

    return unsubscribe;
  }, []);

  return {
    ...authState,
    login: authService.login.bind(authService),
    logout: authService.logout.bind(authService),
    hasPermission: authService.hasPermission.bind(authService),
  };
}