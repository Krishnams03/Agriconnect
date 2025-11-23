// src/components/ProtectedRoute.tsx
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/sign-up');  // Redirect to the sign-up page
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Optionally return a loading spinner or message while checking
  }

  return <>{children}</>;
};

export default ProtectedRoute;
