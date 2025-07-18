export const AuthUtils = {
  // Token management
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      const token = localStorage.getItem('token');
      return token ? JSON.parse(token) : null;
    } catch (error) {
      console.error('Error parsing token from localStorage:', error);
      return null;
    }
  },

  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('token', JSON.stringify(token));
    } catch (error) {
      console.error('Error saving token to localStorage:', error);
    }
  },

  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('adminPageHistory'); // Clear admin page history
    } catch (error) {
      console.error('Error removing token from localStorage:', error);
    }
  },

  isAuthenticated: (): boolean => {
    const token = AuthUtils.getToken();
    if (!token) return false;
    
    // Check if token is expired (if your token has expiration)
    try {
      // If your JWT has expiration, you can decode and check here
      // For now, just check if token exists
      return !!token;
    } catch (error) {
      console.error('Error checking token validity:', error);
      return false;
    }
  },

  // Page history management (for navigation tracking)
  updatePageHistory: (pageName: string): void => {
    if (typeof window === 'undefined') return;
    try {
      let pageHistory = JSON.parse(localStorage.getItem('adminPageHistory') || '[]');
      pageHistory.push(pageName);
      
      // Keep only last 10 pages to prevent unlimited growth
      if (pageHistory.length > 10) {
        pageHistory = pageHistory.slice(-10);
      }
      
      localStorage.setItem('adminPageHistory', JSON.stringify(pageHistory));
    } catch (error) {
      console.error('Error updating page history:', error);
    }
  },

  getPageHistory: (): string[] => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('adminPageHistory') || '[]');
    } catch (error) {
      console.error('Error getting page history:', error);
      return [];
    }
  },

  clearPageHistory: (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('adminPageHistory');
    } catch (error) {
      console.error('Error clearing page history:', error);
    }
  },

  // User preferences
  getUserPreferences: (): Record<string, any> => {
    if (typeof window === 'undefined') return {};
    try {
      return JSON.parse(localStorage.getItem('adminPreferences') || '{}');
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return {};
    }
  },

  setUserPreference: (key: string, value: any): void => {
    if (typeof window === 'undefined') return;
    try {
      const preferences = AuthUtils.getUserPreferences();
      preferences[key] = value;
      localStorage.setItem('adminPreferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Error setting user preference:', error);
    }
  },

  // Session management
  refreshSession: async (): Promise<boolean> => {
    const token = AuthUtils.getToken();
    if (!token) return false;

    try {
      // If you have a refresh endpoint, call it here
      // const response = await fetch('/api/refresh_token', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      
      // For now, just return true if token exists
      return true;
    } catch (error) {
      console.error('Error refreshing session:', error);
      return false;
    }
  },

  // Logout and cleanup
  logout: (): void => {
    AuthUtils.removeToken();
    AuthUtils.clearPageHistory();
    
    // Clear any other user-specific data
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('adminPreferences');
        // Add any other cleanup here
      } catch (error) {
        console.error('Error during logout cleanup:', error);
      }
    }
  },

  // Check if user has specific permissions (extend as needed)
  hasPermission: (permission: string): boolean => {
    // This would typically check against user roles/permissions
    // For now, if authenticated, assume all permissions
    return AuthUtils.isAuthenticated();
  },

  // Get current admin info
  getCurrentAdmin: (): { id?: number; username?: string } | null => {
    if (typeof window === 'undefined') return null;
    try {
      const adminInfo = localStorage.getItem('currentAdmin');
      return adminInfo ? JSON.parse(adminInfo) : null;
    } catch (error) {
      console.error('Error getting current admin info:', error);
      return null;
    }
  },

  setCurrentAdmin: (adminInfo: { id: number; username: string }): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('currentAdmin', JSON.stringify(adminInfo));
    } catch (error) {
      console.error('Error setting current admin info:', error);
    }
  },
};