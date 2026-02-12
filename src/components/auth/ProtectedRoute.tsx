import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthForm } from '@/components/auth/AuthForm';
import { Button } from '@/components/ui/button';

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

const TimeoutError = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background p-4">
    <AlertCircle className="h-12 w-12 text-destructive" />
    <div className="text-center">
      <h2 className="text-xl font-semibold mb-2">Authentication Timeout</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Unable to load your account information. Please try again.
      </p>
    </div>
    <div className="flex gap-2">
      <Button onClick={onRetry}>Retry</Button>
      <Button variant="outline" onClick={() => (window.location.href = '/')}>
        Go Home
      </Button>
    </div>
  </div>
);

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, loading, userRole } = useAuth();
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  console.log('ProtectedRoute check:', {
    user: !!user,
    loading,
    userRole,
    requiredRole,
  });

  // Timeout mechanism - if role doesn't load within 5 seconds after loading completes
  useEffect(() => {
    if (!loading && user && userRole === null) {
      console.warn('User loaded but role is null - starting timeout');

      const timeoutId = setTimeout(() => {
        console.error(
          'Role loading timeout - userRole still null after 5 seconds',
        );
        setTimeoutReached(true);
      }, 5000);

      return () => clearTimeout(timeoutId);
    } else {
      setTimeoutReached(false);
    }
  }, [loading, user, userRole, retryKey]);

  const handleRetry = () => {
    setTimeoutReached(false);
    setRetryKey((prev) => prev + 1);
    window.location.reload();
  };

  // Show timeout error
  if (timeoutReached) {
    return <TimeoutError onRetry={handleRetry} />;
  }

  if (loading) {
    return <FullPageLoader />;
  }

  if (!user) {
    return <AuthForm />;
  }

  // User exists but role not loaded yet - wait (with timeout above)
  if (userRole === null) {
    return <FullPageLoader />;
  }

  // Authorization check - redirect if role doesn't match
  if (requiredRole && userRole !== requiredRole) {
    // Staff can access admin routes
    if (
      (requiredRole === 'admin' && userRole === 'staff') ||
      (requiredRole === 'guest' && userRole === 'guest')
    ) {
      return <>{children}</>;
    }

    // Otherwise redirect to home page
    const fallbackPath = '/';

    console.log('Redirecting to:', fallbackPath);
    return <Navigate to={fallbackPath} replace />;
  }

  // All checks passed - render children
  return <>{children}</>;
}
