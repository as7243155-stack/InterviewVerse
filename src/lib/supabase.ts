import { createClient } from "@supabase/supabase-js";

/**
 * Supabase browser client.
 *
 * Reads from Vite env vars:
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY)
 *
 * Add these to your `.env` (see `.env.example`). Never commit real values.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined);

const missingSupabaseConfig = !supabaseUrl || !supabaseAnonKey;

// Surface misconfiguration loudly in the browser. The previous silent fallback
// to https://invalid.supabase.local produced a confusing "TypeError: Failed to
// fetch" in production whenever VITE_SUPABASE_* wasn't inlined into the build.
if (typeof window !== "undefined") {
  if (missingSupabaseConfig) {
    // eslint-disable-next-line no-console
    console.error(
      "[InterviewVerse] Supabase env vars missing from this build. " +
        "VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY must be set for the Production " +
        "environment in Vercel AND the site must be redeployed after adding them " +
        "(VITE_* is inlined at build time, not read at runtime).",
    );
  } else {
    // eslint-disable-next-line no-console
    console.info(`[InterviewVerse] Supabase host: ${new URL(supabaseUrl!).host}`);
  }
}

export const supabase = createClient(
  supabaseUrl ?? "https://invalid.supabase.local",
  supabaseAnonKey ?? "missing-supabase-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      // Needed so the Google OAuth PKCE callback (?code=...) is exchanged
      // for a session automatically on the /auth/callback route.
      detectSessionInUrl: true,
      flowType: "pkce",
      storageKey: "interviewverse-auth-token",
    },
  },
);

export const isSupabaseConfigured = !missingSupabaseConfig;

export function getSupabaseConfigError(): string | null {
  if (!missingSupabaseConfig) return null;
  return "Authentication is not configured for this deployment. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to Vercel's Production environment variables, then redeploy — VITE_* values are baked into the bundle at build time.";
}

export function getSafeAuthRedirectPath(value: string | null | undefined, fallback = "/dashboard") {
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  try {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://interviewverse.local";
    const url = new URL(value, origin);
    if (url.origin !== origin) return fallback;
    if (["/login", "/signup", "/auth/callback", "/reset-password"].includes(url.pathname)) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

export function getAuthCallbackUrl(next = "/dashboard") {
  const safeNext = getSafeAuthRedirectPath(next);
  const url = new URL("/auth/callback", window.location.origin);
  url.searchParams.set("next", safeNext);
  return url.toString();
}
