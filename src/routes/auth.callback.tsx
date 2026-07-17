import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertCircle, Loader2, Sparkles } from "lucide-react";
import { Logo } from "@/components/site-header";
import { getSafeAuthRedirectPath, getSupabaseConfigError, supabase } from "@/lib/supabase";

export const Route = createFileRoute("/auth/callback")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    next: typeof search.next === "string" ? search.next : undefined,
  }),
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const search = Route.useSearch();
  const [error, setError] = useState<string | null>(getSupabaseConfigError());

  useEffect(() => {
    if (error) return;
    let cancelled = false;

    async function completeAuth() {
      const next = getSafeAuthRedirectPath(search.next);
      const code = new URLSearchParams(window.location.search).get("code");

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) throw exchangeError;
      }

      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!data.session) throw new Error("Authentication session was not restored. Please sign in again.");
      if (!cancelled) window.location.replace(next);
    }

    completeAuth().catch((err) => {
      if (!cancelled) setError(err instanceof Error ? err.message : "Authentication failed.");
    });

    return () => {
      cancelled = true;
    };
  }, [error, search.next]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-60" />
      <main className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <div className="rounded-3xl border border-border bg-card/80 p-8 text-center shadow-elevated backdrop-blur">
          {error ? (
            <>
              <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h1 className="mt-4 text-2xl font-semibold tracking-tight">Sign-in failed</h1>
              <p className="mt-2 text-sm text-muted-foreground">{error}</p>
              <a href="/login" className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-gradient-brand px-6 text-sm font-medium text-white shadow-glow">
                Back to sign in
              </a>
            </>
          ) : (
            <>
              <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-glow">
                <Sparkles className="h-6 w-6" />
              </div>
              <h1 className="mt-4 text-2xl font-semibold tracking-tight">Completing sign in</h1>
              <p className="mt-2 text-sm text-muted-foreground">Restoring your InterviewVerse session…</p>
              <Loader2 className="mx-auto mt-6 h-5 w-5 animate-spin text-brand" />
            </>
          )}
        </div>
      </main>
    </div>
  );
}