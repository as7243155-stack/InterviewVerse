import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { RequireAuth } from "@/components/require-auth";
import { useEvaluation } from "@/lib/evaluation-context";
import type { BackendEvaluation } from "@/lib/types";
import {
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Download,
  RefreshCw,
  Sparkles,
  Inbox,
} from "lucide-react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

export const Route = createFileRoute("/results")({
  head: () => ({ meta: [{ title: "Results — InterviewVerse" }] }),
  component: () => (
    <RequireAuth>
      <ResultsPage />
    </RequireAuth>
  ),
});

const MAX = 10;

function ResultsPage() {
  const { evaluation } = useEvaluation();

  if (!evaluation) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader variant="app" />
        <main className="mx-auto max-w-2xl px-6 py-24 text-center">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-glow">
            <Inbox className="h-6 w-6" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight md:text-3xl">
            No evaluation to show yet
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Finish an interview to see your live evaluation here.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/interview"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-brand px-5 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02]"
            >
              Start an interview <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground hover:bg-secondary"
            >
              Back to dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return <ResultsView evaluation={evaluation} />;
}

function ResultsView({ evaluation }: { evaluation: BackendEvaluation }) {
  const overall100 = clamp(evaluation.overall_score ?? 0, 0, 100);
  const score10 = Math.round((overall100 / 10) * 10) / 10; // 0–10 with 1 decimal
  const pct = overall100;
  const circumference = 2 * Math.PI * 80;
  const offset = circumference - (pct / 100) * circumference;

  const skillEntries = Object.entries(evaluation.skill_breakdown ?? {});
  const radarData =
    skillEntries.length > 0
      ? skillEntries.map(([axis, v]) => ({ axis, v: clamp(Number(v) || 0, 0, 100) }))
      : [{ axis: "Overall", v: overall100 }];

  const feedback = evaluation.question_feedback ?? [];
  const strengths = evaluation.strengths ?? [];
  const weaknesses = evaluation.weaknesses ?? [];
  const suggestions = evaluation.suggestions ?? [];

  const overallTone =
    overall100 >= 75
      ? { label: "Strong overall result", cls: "bg-success/15 text-success" }
      : overall100 >= 50
      ? { label: "Solid — room to grow", cls: "bg-warning/15 text-warning" }
      : { label: "Needs more practice", cls: "bg-destructive/15 text-destructive" };

  const title = evaluation.role
    ? `${evaluation.role} interview`
    : "Interview evaluation";
  const subtitleParts: string[] = [];
  if (evaluation.question_count) subtitleParts.push(`${evaluation.question_count} questions`);
  if (evaluation.experience_level) subtitleParts.push(`${evaluation.experience_level} level`);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader variant="app" />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-brand">Interview complete</div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
            {subtitleParts.length > 0 && (
              <p className="mt-1 text-sm text-muted-foreground">{subtitleParts.join(" • ")}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              disabled
              title="Coming soon"
              className="inline-flex h-10 cursor-not-allowed items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium text-muted-foreground opacity-60 shadow-soft"
            >
              <Download className="h-4 w-4" /> Export PDF
              <span className="ml-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-foreground/70">Soon</span>
            </button>
            <Link to="/interview" className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-brand px-4 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02]">
              <RefreshCw className="h-4 w-4" /> Retry
            </Link>
          </div>
        </div>

        {/* Hero score */}
        <div className="relative mt-8 overflow-hidden rounded-3xl border border-border bg-card p-10 shadow-elevated">
          <div className="absolute inset-0 bg-mesh opacity-60" />
          <div className="relative grid items-center gap-10 md:grid-cols-[260px_1fr]">
            <div className="flex justify-center">
              <div className="relative h-[200px] w-[200px]">
                <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="oklch(0.58 0.23 280)" />
                      <stop offset="100%" stopColor="oklch(0.62 0.19 245)" />
                    </linearGradient>
                  </defs>
                  <circle cx="100" cy="100" r="80" stroke="oklch(0.92 0.008 270)" strokeWidth="14" fill="none" />
                  <circle
                    cx="100" cy="100" r="80"
                    stroke="url(#scoreGrad)" strokeWidth="14" fill="none" strokeLinecap="round"
                    strokeDasharray={circumference} strokeDashoffset={offset}
                    style={{ transition: "stroke-dashoffset 1s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl font-semibold tracking-tight text-gradient-brand">{score10}</div>
                  <div className="text-xs text-muted-foreground">out of {MAX}</div>
                </div>
              </div>
            </div>
            <div>
              <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${overallTone.cls}`}>
                <TrendingUp className="h-3 w-3" /> {overallTone.label}
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">Overall summary</h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl whitespace-pre-line">
                {evaluation.summary || "No summary was returned for this interview."}
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3 max-w-md">
                <Stat k="Score" v={`${overall100}/100`} />
                <Stat k="Questions" v={String(evaluation.question_count ?? feedback.length ?? 0)} />
                <Stat k="Level" v={evaluation.experience_level ?? "—"} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          {/* Radar */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h3 className="text-base font-semibold tracking-tight">Skill breakdown</h3>
            <p className="text-xs text-muted-foreground">How you scored across each competency.</p>
            <div className="mt-2 h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="75%">
                  <defs>
                    <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="oklch(0.58 0.23 280)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="oklch(0.62 0.19 245)" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <PolarGrid stroke="oklch(0.9 0.01 270)" />
                  <PolarAngleAxis dataKey="axis" tick={{ fill: "oklch(0.4 0.02 270)", fontSize: 12 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar dataKey="v" stroke="oklch(0.58 0.23 280)" strokeWidth={2} fill="url(#radarFill)" />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Per-question */}
          <div className="rounded-2xl border border-border bg-card shadow-soft">
            <div className="border-b border-border px-6 py-4">
              <h3 className="text-base font-semibold tracking-tight">Per-question feedback</h3>
              <p className="text-xs text-muted-foreground">Each answer, scored and reviewed.</p>
            </div>
            {feedback.length === 0 ? (
              <div className="px-6 py-8 text-sm text-muted-foreground">
                No per-question feedback was returned.
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {feedback.map((b, idx) => {
                  const status = b.score >= 7 ? "good" : b.score >= 5 ? "ok" : "warn";
                  return (
                    <li key={idx} className="px-6 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          {status === "warn" ? (
                            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-warning/15 text-warning">
                              <AlertTriangle className="h-3.5 w-3.5" />
                            </span>
                          ) : (
                            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </span>
                          )}
                          <div className="min-w-0">
                            <div className="text-sm font-medium break-words">{b.question}</div>
                            {b.feedback && (
                              <div className="mt-1 text-xs text-muted-foreground break-words">{b.feedback}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
                            <div className="h-full rounded-full bg-gradient-brand" style={{ width: `${clamp(b.score, 0, 10) * 10}%` }} />
                          </div>
                          <div className="w-10 text-right text-sm font-semibold tabular-nums">{b.score}</div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Feedback */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="inline-flex items-center gap-2 rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success">
              <CheckCircle2 className="h-3.5 w-3.5" /> What went well
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              {strengths.length === 0 ? (
                <li className="text-muted-foreground">No strengths were surfaced.</li>
              ) : (
                strengths.map((t, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                    <span>{t}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="inline-flex items-center gap-2 rounded-full bg-warning/15 px-3 py-1 text-xs font-medium text-warning">
              <AlertTriangle className="h-3.5 w-3.5" /> Where to improve
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              {weaknesses.length === 0 ? (
                <li className="text-muted-foreground">No weaknesses were surfaced.</li>
              ) : (
                weaknesses.map((t, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                    <span>{t}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-brand text-white shadow-glow">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <h3 className="text-base font-semibold tracking-tight">Suggestions to level up</h3>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Targeted next steps based on this session.</p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {suggestions.map((s, i) => (
                <div key={i} className="group rounded-xl border border-border bg-background p-4 transition-all hover:border-brand/40 hover:shadow-soft">
                  <div className="inline-flex items-center rounded-full bg-gradient-soft px-2 py-0.5 text-[10px] font-medium text-brand">
                    Tip {i + 1}
                  </div>
                  <p className="mt-2 text-sm text-foreground">{s}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-6 relative overflow-hidden rounded-2xl border border-border bg-gradient-brand p-6 text-white shadow-elevated">
          <div className="absolute inset-0 bg-mesh opacity-30" />
          <div className="relative flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5" />
              <div>
                <div className="font-semibold">Ready for another round?</div>
                <div className="text-sm text-white/80">Practice again to strengthen your weak spots.</div>
              </div>
            </div>
            <Link to="/interview" className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-medium text-foreground shadow-soft transition-transform hover:scale-[1.02]">
              Start new interview <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/50 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="mt-1 text-sm font-semibold">{v}</div>
    </div>
  );
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}
