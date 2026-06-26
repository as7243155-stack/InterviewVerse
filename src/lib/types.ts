/**
 * Shared domain models for InterviewVerse.
 *
 * These mirror what the FastAPI backend is expected to return. UI pages can
 * import these today (against mock data) and the same types will hold once
 * the API is wired up.
 */

export type ExperienceLevel = "junior" | "mid" | "senior" | "staff";
export type InterviewType = "System Design" | "Behavioral" | "Technical";
export type InterviewStatus = "in_progress" | "completed" | "abandoned";

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
