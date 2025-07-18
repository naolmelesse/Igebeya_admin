import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthUtils } from '@/utils/auth';

export const useAuth = (requireAuth: boolean = true) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = AuthUtils.isAuthenticated();
      setIsAuthenticated(authenticated);
      setLoading(false);

      if (requireAuth && !authenticated) {
        router.push('/admin-login');
      } else if (!requireAuth && authenticated) {
        router.push('/admin-dashboard');
      }
    };

    checkAuth();
  }, [router, requireAuth]);

  const logout = () => {
    AuthUtils.removeToken();
    setIsAuthenticated(false);
    router.push('/admin-login');
  };

  return {
    isAuthenticated,
    loading,
    logout,
  };
};