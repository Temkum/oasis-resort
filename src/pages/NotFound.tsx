import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Log the error for monitoring (Sentry, LogRocket, etc.)
    console.error(`404 Error: Route "${location.pathname}" not found.`);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="space-y-6">
        {/* Visual Cue */}
        <div className="flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <FileQuestion className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h1 className="text-7xl font-extrabold tracking-tighter text-primary">
            404
          </h1>
          <h2 className="text-2xl font-semibold tracking-tight">
            Page not found
          </h2>
          <p className="mx-auto max-w-[400px] text-muted-foreground">
            The page you are looking for doesn't exist or has been moved to a
            new URL.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>

          <Button asChild className="gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </div>
      </div>

      {/* Subtle debug info for developers in staging */}
      <p className="absolute bottom-8 text-xs text-muted-foreground/50">
        Path: <code className="rounded bg-muted px-1">{location.pathname}</code>
      </p>
    </div>
  );
};

export default NotFound;
