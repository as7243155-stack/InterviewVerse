import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
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
  Loader2,
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

const LEVELS = [
  { id: "intern", label: "Intern", hint: "0–1 yrs" },
  { id: "junior", label: "Junior", hint: "1–3 yrs" },
  { id: "mid", label: "Mid-level", hint: "3–5 yrs" },
  { id: "senior", label: "Senior", hint: "5–8 yrs" },
  { id: "staff", label: "Staff+", hint: "8+ yrs" },
];

const QUESTIONS = [
  "Design a URL shortener that scales to 100M requests per day. Walk me through your data model, traffic estimation, and how you'd handle hot keys.",
  "Tell me about a time you disagreed with a teammate's technical decision. How did you handle it and what was the outcome?",
  "Given a binary tree, write a function that returns the maximum path sum where the path can start and end at any node.",
  "How would you design a notification system for a social network with 500M users? Focus on delivery guarantees and fanout.",
  "Walk me through what happens, end to end, when you type a URL into a browser and press enter.",
];

function InterviewPage() {
  const [stage, setStage] = useState<"setup" | "loading" | "interview">("setup");
  const [role, setRole] = useState("sysdesign");
  const [customRole, setCustomRole] = useState("");
  const [level, setLevel] = useState("senior");

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
    return <LoadingView onDone={() => setStage("interview")} />;
  }
  return <InterviewView role={role} level={level} customRole={customRole} />;
}

function SetupView({
  role, setRole, customRole, setCustomRole, level, setLevel, onStart,
}: {
  role: string; setRole: (v: string) => void;
  customRole: string; setCustomRole: (v: string) => void;
  level: string; setLevel: (v: string) => void;
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

function LoadingView({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= LOADING_STEPS.length) {
      const t = setTimeout(onDone, 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), 900);
    return () => clearTimeout(t);
  }, [step, onDone]);

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
        <h1 className="mt-6 text-2xl font-semibold tracking-tight md:text-3xl">Crafting your interview</h1>
        <p className="mt-2 text-sm text-muted-foreground">InterviewVerse AI is tailoring questions just for you.</p>

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
      </main>
    </div>
  );
}

function InterviewView({ role, level, customRole }: { role: string; level: string; customRole: string }) {
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState("");
  const [recording, setRecording] = useState(false);
  const progress = ((i + 1) / QUESTIONS.length) * 100;
  const roleLabel =
    role === "custom"
      ? customRole.trim() || "Custom Role"
      : ROLES.find((r) => r.id === role)?.label ?? "Interview";
  const levelLabel = LEVELS.find((l) => l.id === level)?.label ?? "";

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader variant="app" />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <X className="h-4 w-4" /> Exit interview
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium text-foreground/80 shadow-soft">
            <Clock className="h-3.5 w-3.5 text-brand" /> 12:48 elapsed
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium tracking-wide text-muted-foreground">
              QUESTION <span className="text-foreground">{i + 1}</span> / {QUESTIONS.length}
            </span>
            <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
          </div>
          <div className="mt-2 flex gap-1.5">
            {QUESTIONS.map((_, idx) => (
              <div key={idx} className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${idx <= i ? "bg-gradient-brand" : "bg-transparent"}`}
                  style={{ width: idx <= i ? "100%" : "0%" }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-8">
          <div className="absolute -inset-2 rounded-3xl bg-gradient-brand opacity-10 blur-2xl" />
          <div className="relative rounded-2xl border border-border bg-card p-8 shadow-elevated">
            <div className="flex items-start gap-3">
              <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-glow">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-brand">{roleLabel} • {levelLabel}</div>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-[28px] leading-snug">
                  {QUESTIONS[i]}
                </h1>
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
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer or use voice. The AI will follow up based on what you say…"
            rows={9}
            className="w-full resize-none rounded-b-2xl bg-transparent px-5 py-4 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setI((v) => Math.max(0, v - 1))}
            disabled={i === 0}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground shadow-soft transition-colors hover:bg-secondary disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" /> Previous
          </button>

          <button
            onClick={() => setRecording((r) => !r)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-brand text-white shadow-glow transition-transform hover:scale-105"
            aria-label="Toggle recording"
          >
            {recording ? <Pause className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>

          {i === QUESTIONS.length - 1 ? (
            <Link
              to="/results"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-brand px-5 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02]"
            >
              Finish & see results <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <button
              onClick={() => { setI((v) => v + 1); setAnswer(""); }}
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
