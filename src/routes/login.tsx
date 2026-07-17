import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/site-header";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles, Loader2, AlertCircle } from "lucide-react";
import {
  getAuthCallbackUrl,
  getSafeAuthRedirectPath,
  getSupabaseConfigError,
  isSupabaseConfigured,
  supabase,
} from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — InterviewVerse" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    next: typeof search.next === "string" ? search.next : undefined,
  }),
  component: LoginPage,
});

function friendlyError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "Invalid email or password.";
  if (m.includes("email not confirmed")) return "Please verify your email before signing in.";
  if (m.includes("failed to fetch") || m.includes("network")) {
    return "Network issue. Check your connection and authentication configuration, then try again.";
  }
  if (m.includes("popup")) return "Google sign-in was cancelled.";
  return message;
}

function LoginPage() {
  const search = Route.useSearch();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nextPath = getSafeAuthRedirectPath(search.next);

  const redirectAfterAuth = () => {
    window.location.replace(nextPath);
  };

  // Already logged in → bounce to dashboard
  useEffect(() => {
    if (!authLoading && user) redirectAfterAuth();
  }, [authLoading, user, nextPath]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const configError = getSupabaseConfigError();
    if (configError) {
      setError(configError);
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      redirectAfterAuth();
    } catch (err) {
      setError(friendlyError(err instanceof Error ? err.message : "Sign in failed."));
    } finally {
      setSubmitting(false);
    }
  };

  const onGoogle = async () => {
    setError(null);
    const configError = getSupabaseConfigError();
    if (configError) {
      setError(configError);
      return;
    }
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: getAuthCallbackUrl(nextPath) },
      });
      if (error) throw error;
    } catch (err) {
      setError(friendlyError(err instanceof Error ? err.message : "Google sign-in failed."));
      setGoogleLoading(false);
    }
  };

  const onForgot = async () => {
    setError(null);
    const configError = getSupabaseConfigError();
    if (configError) {
      setError(configError);
      return;
    }
    if (!email) {
      setError("Enter your email above, then click Forgot.");
      return;
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setError("Password reset email sent. Check your inbox.");
    } catch (err) {
      setError(friendlyError(err instanceof Error ? err.message : "Could not send reset email."));
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-60" />
      <div className="pointer-events-none absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-gradient-brand opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-gradient-brand opacity-20 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl px-6 lg:grid-cols-2">
        <div className="hidden flex-col justify-between py-10 pr-10 lg:flex">
          <Logo />
          <div>
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium text-foreground/80 shadow-soft">
              <Sparkles className="h-3.5 w-3.5 text-brand" /> Practice. Improve. Get Hired.
            </div>
            <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-tight">
              Practice like it's the<br />
              <span className="text-gradient-brand">real interview.</span>
            </h2>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Realistic AI mock interviews and rubric-based feedback that actually
              moves the needle. Practice. Improve. Get Hired.
            </p>
            <div className="mt-8 grid max-w-md gap-3">
              {[
                "Adaptive questions tailored to your role",
                "Clear rubric scoring on every answer",
                "Strengths, gaps, and next steps after each session",
              ].map((t) => (
                <div key={t} className="flex items-center gap-3 rounded-xl border border-border bg-card/70 p-3 text-sm shadow-soft backdrop-blur transition-colors hover:bg-card">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-brand text-white">
                    <Sparkles className="h-3 w-3" />
                  </span>
                  {t}
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 InterviewVerse Inc.</p>
        </div>

        <div className="flex flex-col justify-center py-10 lg:pl-10">
          <div className="lg:hidden mb-8"><Logo /></div>

          <div className="mx-auto w-full max-w-md rounded-3xl border border-border bg-card/80 p-8 shadow-elevated backdrop-blur">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to continue prepping.</p>

            <button
              type="button"
              onClick={onGoogle}
              disabled={googleLoading || submitting}
              className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border bg-card text-sm font-medium text-foreground shadow-soft transition-colors hover:bg-secondary disabled:opacity-60"
            >
              {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
              Continue with Google
            </button>

            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              or sign in with email
              <div className="h-px flex-1 bg-border" />
            </div>

            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!isSupabaseConfigured && !error && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-warning/30 bg-warning/10 p-3 text-xs text-warning-foreground">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{getSupabaseConfigError()}</span>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <label className="block">
                <span className="text-xs font-medium text-muted-foreground">Email</span>
                <div className="mt-1.5 relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="h-11 w-full rounded-full border border-border bg-background pl-10 pr-4 text-sm shadow-soft placeholder:text-muted-foreground focus:outline-none focus:ring-brand"
                  />
                </div>
              </label>

              <label className="block">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Password</span>
                  <button type="button" onClick={onForgot} className="text-xs font-medium text-brand hover:underline">Forgot?</button>
                </div>
                <div className="mt-1.5 relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={show ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 w-full rounded-full border border-border bg-background pl-10 pr-11 text-sm shadow-soft placeholder:text-muted-foreground focus:outline-none focus:ring-brand"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Toggle password visibility"
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-border accent-[color:var(--color-brand)]"
                />
                Keep me signed in
              </label>

              <button
                type="submit"
                disabled={submitting || googleLoading}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-brand text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.01] disabled:opacity-70"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              New to InterviewVerse?{" "}
              <Link to="/signup" search={{ next: nextPath }} className="font-medium text-brand hover:underline">
                Create an account
              </Link>
            </p>
          </div>

          <p className="mx-auto mt-6 max-w-md text-center text-[11px] text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.12A6.98 6.98 0 0 1 5.47 12c0-.74.13-1.45.36-2.12V7.04H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.96l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  );
}
