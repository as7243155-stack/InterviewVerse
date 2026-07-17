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

export const supabase = createClient(
  supabaseUrl ?? "https://invalid.supabase.local",
  supabaseAnonKey ?? "missing-supabase-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      flowType: "pkce",
      storageKey: "interviewverse-auth-token",
    },
  },
);

export const isSupabaseConfigured = !missingSupabaseConfig;

export function getSupabaseConfigError(): string | null {
  if (!missingSupabaseConfig) return null;
  return "Authentication is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY) in every environment.";
}

export function getSafeAuthRedirectPath(value: string | null | undefined, fallback = "/dashboard") {
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  try {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://interviewverse.local";
    const url = new URL(value, origin);
    if (url.origin !== origin) return fallback;
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
