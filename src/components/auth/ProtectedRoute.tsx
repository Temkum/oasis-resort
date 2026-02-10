import React from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthForm } from '@/components/auth/AuthForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'staff' | 'guest';
}

const FullPageLoader = () => (
  <div
    className="flex h-screen w-full flex-col items-center justify-center gap-2 bg-background"
    role="status"
    aria-label="Loading authentication state"
  >
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
    <p className="text-sm font-medium text-muted-foreground">
      Authenticating...
    </p>
  </div>
);

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, loading, userRole } = useAuth();

  if (loading) {
    return <FullPageLoader />;
  }

  if (!user) {
    return <AuthForm />;
  }

  // Authorization Logic
  if (requiredRole && userRole !== requiredRole) {
    const fallbackPath =
      userRole === 'admin'
        ? '/admin/dashboard'
        : userRole === 'guest'
          ? '/guest'
          : '/';

    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}
