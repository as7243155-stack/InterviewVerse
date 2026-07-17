import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { Logo } from "@/components/site-header";
import { getSupabaseConfigError, supabase } from "@/lib/supabase";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({ meta: [{ title: "Reset password — InterviewVerse" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(getSupabaseConfigError());

  useEffect(() => {
    if (error) return;
    let cancelled = false;
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (!cancelled && (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN")) setReady(true);
    });

    async function restoreRecoverySession() {
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) throw exchangeError;
      }
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!cancelled) setReady(Boolean(data.session));
    }

    restoreRecoverySession().catch((err) => {
      if (!cancelled) setError(err instanceof Error ? err.message : "Password reset link is invalid or expired.");
    });

    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, [error]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      setTimeout(() => navigate({ to: "/dashboard", replace: true }), 700);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-60" />
      <main className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <div className="rounded-3xl border border-border bg-card/80 p-8 shadow-elevated backdrop-blur">
          <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
          <p className="mt-1 text-sm text-muted-foreground">Choose a new password for your InterviewVerse account.</p>

          {error && (
            <div className="mt-5 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {done ? (
            <div className="mt-6 rounded-2xl border border-success/20 bg-success/10 p-5 text-center text-sm text-success">
              <CheckCircle2 className="mx-auto h-6 w-6" />
              <div className="mt-2 font-medium">Password updated</div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="text-xs font-medium text-muted-foreground">New password</span>
                <div className="mt-1.5 relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={show ? "text" : "password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
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

              <label className="block">
                <span className="text-xs font-medium text-muted-foreground">Confirm password</span>
                <div className="mt-1.5 relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={show ? "text" : "password"}
                    required
                    minLength={8}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter password"
                    className="h-11 w-full rounded-full border border-border bg-background pl-10 pr-4 text-sm shadow-soft placeholder:text-muted-foreground focus:outline-none focus:ring-brand"
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={submitting || !ready}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-brand text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.01] disabled:opacity-70"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Update password <ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Remembered your password? <Link to="/login" className="font-medium text-brand hover:underline">Sign in</Link>
          </p>
        </div>
      </main>
    </div>
  );
}