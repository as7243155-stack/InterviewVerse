/**
 * Shared domain models for InterviewVerse.
 *
 * These mirror what the FastAPI backend is expected to return. UI pages can
 * import these today (against mock data) and the same types will hold once
 * the API is wired up.
 */

export type ExperienceLevel = "Intern" | "Junior" | "Mid-Level" | "Senior" | "Staff";
export type InterviewType = "Technical" | "HR" | "Behavioral" | "System Design";
export type InterviewStatus = "in_progress" | "completed" | "abandoned";

/** Question shape returned by the FastAPI `/questions` endpoint. */
export interface BackendQuestion {
  id: number;
  question: string;
  stage?: string;
  /** Legacy textual difficulty (e.g. "Easy"). */
  difficulty?: string;
  /** Numeric 1–5 difficulty from the v2 schema. */
  difficulty_level?: number;
  evaluation_focus?: string;
  is_programming_problem?: boolean;
  expected_duration?: number;
  expected_time_minutes?: number;
  transition_after?: string;
}

/** Full interview payload returned by the FastAPI `/questions` endpoint. */
export interface BackendInterview {
  role: string;
  experience_level: string;
  interview_type?: string;
  question_count: number;
  estimated_duration?: number;
  estimated_duration_minutes?: number;
  introduction: string;
  questions: BackendQuestion[];
  stage_transitions?: string[];
  closing: string;
}

export interface GenerateInterviewParams {
  role: string;
  experience_level: ExperienceLevel;
  question_count: 5 | 10 | 15;
  interview_type?: InterviewType;
}

/** Legacy in-app representations (kept for other pages, unused by /questions). */
export interface Question {
  id: string;
  prompt: string;
  order: number;
  category?: string;
  hints?: string[];
  expectedDurationSec?: number;
}

export interface Answer {
  questionId: string;
  text: string;
  durationSec?: number;
  submittedAt?: string;
}

export interface Interview {
  id: string;
  role: string;
  experience: ExperienceLevel;
  type: InterviewType;
  status: InterviewStatus;
  createdAt: string;
  completedAt?: string;
  questions: Question[];
  answers?: Answer[];
}


export interface SkillScore {
  axis: string;
  score: number; // 0–100
}

export interface RubricItem {
  label: string;
  score: number; // 0–10
  status: "good" | "ok" | "warn";
  notes?: string;
}

export interface EvaluationResult {
  interviewId: string;
  overallScore: number; // 0–10
  maxScore: number;
  summary: string;
  skillBreakdown: SkillScore[];
  rubric: RubricItem[];
  strengths: string[];
  improvements: string[];
  suggestions: Array<{
    title: string;
    body: string;
    tag: string;
  }>;
  evaluatedAt: string;
}

export interface DashboardStats {
  totalInterviews: number;
  averageScore: number;
  bestScore: number;
  streakDays?: number;
}

export interface HistoryItem {
  id: string;
  title: string;
  type: InterviewType;
  score: number;
  date: string;
  durationMinutes: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  targetRole?: string;
  experience?: ExperienceLevel;
  createdAt: string;
}
