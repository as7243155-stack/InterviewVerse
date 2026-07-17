import { useEffect, useRef, type ReactNode } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { Sparkles } from "lucide-react";

/**
 * Client-side route guard. Redirects unauthenticated users to /login.
 * Used inside each protected route's component to avoid restructuring routes.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const intendedPath = useRef(`${location.pathname}${location.searchStr}`);

  useEffect(() => {
    if (!loading && !user) {
      navigate({
        to: "/login",
        search: { next: intendedPath.current },
        replace: true,
      });
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex h-8 w-8 animate-pulse items-center justify-center rounded-lg bg-gradient-brand shadow-glow">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
          Loading your session…
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
