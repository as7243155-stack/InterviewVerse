/**
 * Service layer for backend communication.
 *
 * Each function maps to a future FastAPI endpoint declared in `config.ts`.
 * UI pages should import from here instead of calling `fetch` directly so
 * that backend integration becomes a single-file change.
 *
 * NOTE: Nothing in the current UI calls these yet — mock data still drives
 * every screen. This module exists purely as the integration seam.
 */
import { apiFetch } from "./client";
import { API_ENDPOINTS } from "./config";
import type {
  Answer,
  BackendInterview,
  DashboardStats,
  EvaluationResult,
  GenerateInterviewParams,
  HistoryItem,
  Interview,
  Question,
  UserProfile,
  ExperienceLevel,
  InterviewType,
} from "../types";

/**
 * Calls the FastAPI `/questions` endpoint and returns the structured
 * interview payload (introduction, questions, stage transitions, closing).
 */
export async function generateInterview(
  params: GenerateInterviewParams,
): Promise<BackendInterview> {

  const res = await apiFetch<any>(
    API_ENDPOINTS.interviews.questions,
    {
      query: {
        role: params.role,
        experience_level: params.experience_level,
        question_count: params.question_count,
        interview_type: params.interview_type ?? "Technical",
      },
    },
  );

  console.log("RAW RESPONSE FROM API");
  console.log(res);

  if (res.interview) {
    console.log("RETURNING res.interview");
    return res.interview;
  }

  console.log("RETURNING res");
  return res;
}


export const authService = {
  login: (email: string, password: string) =>
    apiFetch<{ token: string; user: UserProfile }>(API_ENDPOINTS.auth.login, {
      method: "POST",
      body: { email, password },
    }),
  register: (email: string, password: string, name: string) =>
    apiFetch<{ token: string; user: UserProfile }>(API_ENDPOINTS.auth.register, {
      method: "POST",
      body: { email, password, name },
    }),
  google: (idToken: string) =>
    apiFetch<{ token: string; user: UserProfile }>(API_ENDPOINTS.auth.google, {
      method: "POST",
      body: { idToken },
    }),
  logout: (token: string) =>
    apiFetch<void>(API_ENDPOINTS.auth.logout, { method: "POST", token }),
  me: (token: string) => apiFetch<UserProfile>(API_ENDPOINTS.auth.me, { token }),
};

export const interviewService = {
  list: (token: string) =>
    apiFetch<Interview[]>(API_ENDPOINTS.interviews.list, { token }),
  get: (id: string, token: string) =>
    apiFetch<Interview>(API_ENDPOINTS.interviews.detail(id), { token }),
  create: (
    payload: { role: string; experience: ExperienceLevel; type: InterviewType },
    token: string,
  ) =>
    apiFetch<Interview>(API_ENDPOINTS.interviews.create, {
      method: "POST",
      body: payload,
      token,
    }),
  generateQuestions: (
    payload: { role: string; experience: ExperienceLevel; type?: InterviewType },
    token: string,
  ) =>
    apiFetch<Question[]>(API_ENDPOINTS.interviews.generateQuestions, {
      method: "POST",
      body: payload,
      token,
    }),
  submitAnswer: (interviewId: string, answer: Answer, token: string) =>
    apiFetch<void>(API_ENDPOINTS.interviews.submitAnswer(interviewId), {
      method: "POST",
      body: answer,
      token,
    }),
  complete: (interviewId: string, token: string) =>
    apiFetch<EvaluationResult>(API_ENDPOINTS.interviews.complete(interviewId), {
      method: "POST",
      token,
    }),
};

export const resultsService = {
  get: (interviewId: string, token: string) =>
    apiFetch<EvaluationResult>(API_ENDPOINTS.results.detail(interviewId), { token }),
  evaluate: (interviewId: string, token: string) =>
    apiFetch<EvaluationResult>(API_ENDPOINTS.results.evaluate(interviewId), {
      method: "POST",
      token,
    }),
};

export const dashboardService = {
  stats: (token: string) =>
    apiFetch<DashboardStats>(API_ENDPOINTS.dashboard.stats, { token }),
  recent: (token: string) =>
    apiFetch<HistoryItem[]>(API_ENDPOINTS.dashboard.recent, { token }),
};

export const historyService = {
  list: (token: string) =>
    apiFetch<HistoryItem[]>(API_ENDPOINTS.history.list, { token }),
};

export const profileService = {
  get: (token: string) => apiFetch<UserProfile>(API_ENDPOINTS.profile.get, { token }),
  update: (payload: Partial<UserProfile>, token: string) =>
    apiFetch<UserProfile>(API_ENDPOINTS.profile.update, {
      method: "PATCH",
      body: payload,
      token,
    }),
};
