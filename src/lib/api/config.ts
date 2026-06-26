/**
 * Centralized API configuration.
 *
 * The base URL is read from the `VITE_API_BASE_URL` environment variable so
 * the frontend can point to any FastAPI deployment without code changes.
 * Falls back to a local FastAPI dev server on port 8000.
 */
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:8000";

/**
 * Single source of truth for every backend endpoint used by the app.
 * Keep paths relative — `apiFetch` joins them with `API_BASE_URL`.
 */
export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    google: "/auth/google",
    me: "/auth/me",
  },
  interviews: {
    list: "/interviews",
    create: "/interviews",
    detail: (id: string) => `/interviews/${id}`,
    generateQuestions: "/interviews/generate-questions",
    submitAnswer: (id: string) => `/interviews/${id}/answers`,
    complete: (id: string) => `/interviews/${id}/complete`,
  },
  results: {
    detail: (id: string) => `/results/${id}`,
    evaluate: (id: string) => `/results/${id}/evaluate`,
  },
  dashboard: {
    stats: "/dashboard/stats",
    recent: "/dashboard/recent",
  },
  history: {
    list: "/history",
  },
  profile: {
    get: "/profile",
    update: "/profile",
  },
} as const;
