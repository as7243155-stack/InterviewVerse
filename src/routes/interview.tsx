import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { generateInterview } from "@/lib/api/services";
import type { BackendInterview, ExperienceLevel, InterviewType } from "@/lib/types";
import {
  Mic,
  Pause,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Clock,
  X,
  Lightbulb,
  Briefcase,
  Layers,
  Code2,
  MessageSquare,
  Wand2,
  Check,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Code,
  Target,
} from "lucide-react";


export const Route = createFileRoute("/interview")({
  head: () => ({ meta: [{ title: "Interview — InterviewVerse" }] }),
  component: InterviewPage,
});

const ROLES = [
  { id: "frontend", label: "Frontend Engineer", icon: Code2 },
  { id: "backend", label: "Backend Engineer", icon: Layers },
  { id: "fullstack", label: "Full-Stack Engineer", icon: Briefcase },
  { id: "sysdesign", label: "System Design", icon: Layers },
  { id: "behavioral", label: "Behavioral", icon: MessageSquare },
  { id: "data", label: "Data / ML Engineer", icon: Code2 },
  { id: "custom", label: "Custom Role", icon: Wand2 },
];

const CUSTOM_PLACEHOLDERS = [
  "Java Developer",
  "Python Developer",
  "DevOps Engineer",
  "QA Engineer",
  "Data Analyst",
  "SDE Intern",
];

const LEVELS: Array<{ id: ExperienceLevel; label: string; hint: string }> = [
  { id: "Intern", label: "Intern", hint: "0–1 yrs" },
  { id: "Junior", label: "Junior", hint: "1–3 yrs" },
  { id: "Mid-Level", label: "Mid-level", hint: "3–5 yrs" },
  { id: "Senior", label: "Senior", hint: "5–8 yrs" },
  { id: "Staff", label: "Staff+", hint: "8+ yrs" },
];

const QUESTION_COUNT: 5 | 10 | 15 = 5;

function resolveRole(roleId: string, customRole: string): string {
  if (roleId === "custom") return customRole.trim() || "Software Engineer";
  return ROLES.find((r) => r.id === roleId)?.label ?? "Software Engineer";
}

function resolveInterviewType(roleId: string): InterviewType {
  if (roleId === "sysdesign") return "System Design";
  if (roleId === "behavioral") return "Behavioral";
  return "Technical";
}

function InterviewPage() {
  const [stage, setStage] = useState<"setup" | "loading" | "interview">("setup");
  const [role, setRole] = useState("sysdesign");
  const [customRole, setCustomRole] = useState("");
  const [level, setLevel] = useState<ExperienceLevel>("Senior");
  const [interview, setInterview] = useState<BackendInterview | null>(null);

  if (stage === "setup") {
    return (
      <SetupView
        role={role}
        setRole={setRole}
        customRole={customRole}
        setCustomRole={setCustomRole}
        level={level}
        setLevel={setLevel}
        onStart={() => setStage("loading")}
      />
    );
  }
  if (stage === "loading") {
    return (
      <LoadingView
        role={resolveRole(role, customRole)}
        level={level}
        interviewType={resolveInterviewType(role)}
        onDone={(data) => {
          setInterview(data);
          setStage("interview");
        }}
        onCancel={() => setStage("setup")}
      />
    );
  }
  return interview ? (
    <InterviewView interview={interview} />
  ) : null;
}


function SetupView({
  role, setRole, customRole, setCustomRole, level, setLevel, onStart,
}: {
  role: string; setRole: (v: string) => void;
  customRole: string; setCustomRole: (v: string) => void;
  level: ExperienceLevel; setLevel: (v: ExperienceLevel) => void;
  onStart: () => void;
}) {

  const [ph] = useState(() => CUSTOM_PLACEHOLDERS[Math.floor(Math.random() * CUSTOM_PLACEHOLDERS.length)]);
  const canStart = role !== "custom" || customRole.trim().length > 0;
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader variant="app" />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>

        <div className="mt-6">
          <div className="text-xs font-medium uppercase tracking-wider text-brand">New session</div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">Set up your interview</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose a role and experience level. We'll generate questions tailored to you.
          </p>
        </div>

        <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ROLES.map((r) => {
              const active = role === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all ${
                    active
                      ? "border-transparent bg-gradient-soft shadow-soft ring-1 ring-brand/40"
                      : "border-border bg-background hover:border-brand/40 hover:bg-secondary/50"
                  }`}
                >
                  <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${active ? "bg-gradient-brand text-white shadow-glow" : "bg-secondary text-foreground"}`}>
                    <r.icon className="h-4 w-4" />
                  </div>
                  <div className="mt-3 text-sm font-medium">{r.label}</div>
                </button>
              );
            })}
          </div>

          {role === "custom" && (
            <div className="mt-4">
              <label className="text-xs font-medium text-muted-foreground">Enter your role</label>
              <input
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder={`e.g. ${ph}`}
                autoFocus
                className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
              <div className="mt-2 text-xs text-muted-foreground">
                Try: Java Developer, Python Developer, DevOps Engineer, QA Engineer, Data Analyst, SDE Intern.
              </div>
            </div>
          )}
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Experience level</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {LEVELS.map((l) => {
              const active = level === l.id;
              return (
                <button
                  key={l.id}
                  onClick={() => setLevel(l.id)}
                  className={`inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium transition-all ${
                    active
                      ? "bg-gradient-brand text-white shadow-glow"
                      : "border border-border bg-background text-foreground hover:bg-secondary"
                  }`}
                >
                  {l.label}
                  <span className={`text-xs ${active ? "text-white/80" : "text-muted-foreground"}`}>{l.hint}</span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-gradient-soft p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-glow">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <div className="text-sm font-semibold">Ready to start</div>
              <div className="text-xs text-muted-foreground">5 adaptive questions • ~25 min</div>
            </div>
          </div>
          <button
            onClick={onStart}
            disabled={!canStart}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-brand px-5 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            Generate questions <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  );
}

const LOADING_STEPS = [
  "Analyzing role",
  "Generating interview questions",
  "Preparing session",
];

function LoadingView({
  role,
  level,
  interviewType,
  onDone,
  onCancel,
}: {
  role: string;
  level: ExperienceLevel;
  interviewType: InterviewType;
  onDone: (data: BackendInterview) => void;
  onCancel: () => void;
}) {
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const doneRef = useRef(false);

  // Step animation — advances while the request is in flight, then waits on the last step.
  useEffect(() => {
    if (error) return;
    if (step >= LOADING_STEPS.length - 1) return;
    const t = setTimeout(() => setStep((s) => s + 1), 900);
    return () => clearTimeout(t);
  }, [step, error]);

  // Actual backend call.
  useEffect(() => {
    let cancelled = false;
    doneRef.current = false;
    setError(null);
    setStep(0);
    (async () => {
      try {
        const data = await generateInterview({
          role,
          experience_level: level,
          question_count: QUESTION_COUNT,
          interview_type: interviewType,
        });
        if (cancelled) return;
        if (!data || !Array.isArray(data.questions) || data.questions.length === 0) {
          throw new Error("The backend returned an empty interview. Please try again.");
        }
        doneRef.current = true;
        setStep(LOADING_STEPS.length); // mark all steps complete
        setTimeout(() => {
          if (!cancelled) onDone(data);
        }, 350);
      } catch (e) {
        if (cancelled) return;
        const msg =
          e instanceof Error
            ? e.message
            : "We couldn't reach the interview service. Please try again.";
        setError(msg);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader variant="app" />
      <main className="mx-auto flex max-w-2xl flex-col items-center px-6 py-20">
        <div className="relative">
          <div className="absolute -inset-6 rounded-full bg-gradient-brand opacity-20 blur-2xl" />
          <div className="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-glow">
            <Sparkles className="h-7 w-7" />
          </div>
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight md:text-3xl">
          {error ? "Something went wrong" : "Crafting your interview"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error
            ? "InterviewVerse couldn't reach the AI service."
            : "InterviewVerse AI is tailoring questions just for you."}
        </p>

        {error ? (
          <div className="mt-10 w-full rounded-2xl border border-destructive/30 bg-destructive/5 p-6 shadow-soft">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              <div className="text-sm text-foreground">
                <div className="font-medium">Unable to generate interview</div>
                <div className="mt-1 text-muted-foreground">{error}</div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={() => setAttempt((a) => a + 1)}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-brand px-4 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02]"
              >
                <Loader2 className="h-4 w-4" /> Try again
              </button>
              <button
                onClick={onCancel}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground hover:bg-secondary"
              >
                Back to setup
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-10 w-full rounded-2xl border border-border bg-card p-6 shadow-soft">
            <ul className="space-y-4">
              {LOADING_STEPS.map((label, idx) => {
                const done = idx < step;
                const active = idx === step;
                return (
                  <li key={label} className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all ${
                        done
                          ? "bg-gradient-brand text-white shadow-glow"
                          : active
                          ? "bg-accent text-brand"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {done ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : active ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      )}
                    </span>
                    <span
                      className={`text-sm transition-colors ${
                        done ? "text-foreground" : active ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {label}
                      {active && <span className="ml-1 text-muted-foreground">…</span>}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}

function difficultyLabel(q: BackendQuestionLike): string {
  if (q.difficulty) return q.difficulty;
  if (typeof q.difficulty_level === "number") {
    const map = ["", "Very Easy", "Easy", "Medium", "Hard", "Very Hard"];
    return map[q.difficulty_level] ?? `Level ${q.difficulty_level}`;
  }
  return "";
}

type BackendQuestionLike = BackendInterview["questions"][number];

function InterviewView({ interview }: { interview: BackendInterview }) {
  const questions = interview.questions;
  const [i, setI] = useState(-1); // -1 = introduction screen, questions.length = closing
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [recording, setRecording] = useState(false);

  const showIntro = i === -1;
  const showClosing = i === questions.length;
  const currentIdx = Math.min(Math.max(i, 0), questions.length - 1);
  const q = questions[currentIdx];
  const estDuration =
    interview.estimated_duration_minutes ?? interview.estimated_duration ?? 0;

  const stepNumber = showIntro ? 0 : showClosing ? questions.length + 1 : i + 1;
  const totalSteps = questions.length + 2; // intro + questions + closing
  const progress = Math.min(100, Math.max(0, (stepNumber / (totalSteps - 1)) * 100));

  const roleLabel = interview.role;
  const levelLabel = interview.experience_level;

  // Stage transition shown before this question (after the previous one).
  const transitionBefore =
    !showIntro && !showClosing && currentIdx > 0
      ? questions[currentIdx - 1]?.transition_after ??
        interview.stage_transitions?.[currentIdx - 1]
      : undefined;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader variant="app" />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <X className="h-4 w-4" /> Exit interview
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium text-foreground/80 shadow-soft">
            <Clock className="h-3.5 w-3.5 text-brand" />
            {estDuration ? `~${estDuration} min` : "Interview in progress"}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium tracking-wide text-muted-foreground">
              {showIntro ? (
                "INTRODUCTION"
              ) : showClosing ? (
                "WRAP-UP"
              ) : (
                <>
                  QUESTION <span className="text-foreground">{i + 1}</span> / {questions.length}
                </>
              )}
            </span>
            <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
          </div>
          <div className="mt-2 flex gap-1.5">
            {questions.map((_, idx) => (
              <div key={idx} className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    !showIntro && (showClosing || idx <= i) ? "bg-gradient-brand" : "bg-transparent"
                  }`}
                  style={{ width: !showIntro && (showClosing || idx <= i) ? "100%" : "0%" }}
                />
              </div>
            ))}
          </div>
        </div>

        {showIntro ? (
          <div className="relative mt-8">
            <div className="absolute -inset-2 rounded-3xl bg-gradient-brand opacity-10 blur-2xl" />
            <div className="relative rounded-2xl border border-border bg-card p-8 shadow-elevated">
              <div className="flex items-start gap-3">
                <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-glow">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-brand">
                    {roleLabel} • {levelLabel}
                    {interview.interview_type ? ` • ${interview.interview_type}` : ""}
                  </div>
                  <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-[28px] leading-snug">
                    Welcome to your interview
                  </h1>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {interview.introduction}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs text-foreground">
                  <Target className="h-3.5 w-3.5 text-brand" />
                  {questions.length} questions
                </span>
                {estDuration > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs text-foreground">
                    <Clock className="h-3.5 w-3.5 text-brand" /> ~{estDuration} min
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : showClosing ? (
          <div className="relative mt-8">
            <div className="absolute -inset-2 rounded-3xl bg-gradient-brand opacity-10 blur-2xl" />
            <div className="relative rounded-2xl border border-border bg-card p-8 shadow-elevated">
              <div className="flex items-start gap-3">
                <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-glow">
                  <Flag className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-brand">Interview complete</div>
                  <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-[28px] leading-snug">
                    Thank you for completing the interview
                  </h1>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {interview.closing}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {transitionBefore && (
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-gradient-soft p-4 text-sm text-foreground/80 shadow-soft">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <p className="italic">{transitionBefore}</p>
              </div>
            )}

            <div className="relative mt-6">
              <div className="absolute -inset-2 rounded-3xl bg-gradient-brand opacity-10 blur-2xl" />
              <div className="relative rounded-2xl border border-border bg-card p-8 shadow-elevated">
                <div className="flex items-start gap-3">
                  <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-glow">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium uppercase tracking-wider text-brand">
                      {roleLabel} • {levelLabel}
                    </div>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-[28px] leading-snug">
                      {q.question}
                    </h1>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {q.stage && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground">
                          <Layers className="h-3 w-3 text-brand" /> {q.stage}
                        </span>
                      )}
                      {difficultyLabel(q) && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground">
                          {difficultyLabel(q)}
                        </span>
                      )}
                      {q.evaluation_focus && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground">
                          <Target className="h-3 w-3 text-brand" /> {q.evaluation_focus}
                        </span>
                      )}
                      {q.is_programming_problem !== undefined && (
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                            q.is_programming_problem
                              ? "bg-brand/10 text-brand"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          <Code className="h-3 w-3" />
                          {q.is_programming_problem ? "Programming" : "Discussion"}
                        </span>
                      )}
                      {(q.expected_duration ?? q.expected_time_minutes) && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground">
                          <Clock className="h-3 w-3 text-brand" />
                          ~{q.expected_duration ?? q.expected_time_minutes} min
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-start gap-3 rounded-xl bg-accent/60 p-4 text-sm text-accent-foreground">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <p>Think out loud. Mention assumptions, trade-offs, and ask clarifying questions before diving in.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-card shadow-soft">
              <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <div className="text-xs font-medium text-muted-foreground">Your answer</div>
                <button
                  onClick={() => setRecording((r) => !r)}
                  className={`inline-flex h-8 items-center gap-2 rounded-full px-3 text-xs font-medium transition-colors ${
                    recording ? "bg-destructive/10 text-destructive" : "bg-secondary text-foreground hover:bg-accent"
                  }`}
                >
                  {recording ? (
                    <>
                      <span className="relative inline-flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
                      </span>
                      Recording — tap to stop
                    </>
                  ) : (
                    <>
                      <Mic className="h-3.5 w-3.5" /> Record voice answer
                    </>
                  )}
                </button>
              </div>
              <textarea
                value={answers[q.id] ?? ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                placeholder="Type your answer or use voice. The AI will follow up based on what you say…"
                rows={9}
                className="w-full resize-none rounded-b-2xl bg-transparent px-5 py-4 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </>
        )}

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setI((v) => Math.max(-1, v - 1))}
            disabled={showIntro}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground shadow-soft transition-colors hover:bg-secondary disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" /> Previous
          </button>

          <button
            onClick={() => setRecording((r) => !r)}
            className={`inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-brand text-white shadow-glow transition-transform hover:scale-105 ${
              showIntro || showClosing ? "invisible" : ""
            }`}
            aria-label="Toggle recording"
          >
            {recording ? <Pause className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>

          {showClosing ? (
            <Link
              to="/results"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-brand px-5 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02]"
            >
              See your results <ArrowRight className="h-4 w-4" />
            </Link>
          ) : showIntro ? (
            <button
              onClick={() => setI(0)}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-brand px-5 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02]"
            >
              Start interview <ArrowRight className="h-4 w-4" />
            </button>
          ) : i === questions.length - 1 ? (
            <button
              onClick={() => setI(questions.length)}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-brand px-5 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02]"
            >
              Finish interview <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => setI((v) => v + 1)}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-brand px-5 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02]"
            >
              Next question <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

