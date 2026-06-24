import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import {
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Download,
  RefreshCw,
  Sparkles,
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
  head: () => ({ meta: [{ title: "Results — PrepVerse" }] }),
  component: ResultsPage,
});

const SCORE = 8.4;
const MAX = 10;

const RADAR = [
  { axis: "Structure", v: 92 },
  { axis: "Depth", v: 78 },
  { axis: "Trade-offs", v: 84 },
  { axis: "Clarity", v: 88 },
  { axis: "Scalability", v: 72 },
  { axis: "Communication", v: 90 },
];

const BREAKDOWN = [
  { label: "Problem framing", score: 9.2, status: "good" },
  { label: "Data model design", score: 8.6, status: "good" },
  { label: "Scalability analysis", score: 7.2, status: "ok" },
  { label: "Trade-off reasoning", score: 8.4, status: "good" },
  { label: "Edge case handling", score: 6.8, status: "warn" },
];

function ResultsPage() {
  const pct = (SCORE / MAX) * 100;
  const circumference = 2 * Math.PI * 80;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader variant="app" />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-brand">Interview complete</div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">System Design — URL Shortener</h1>
            <p className="mt-1 text-sm text-muted-foreground">5 questions • 24 min • Senior level</p>
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
                  <div className="text-5xl font-semibold tracking-tight text-gradient-brand">{SCORE}</div>
                  <div className="text-xs text-muted-foreground">out of {MAX}</div>
                </div>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success">
                <TrendingUp className="h-3 w-3" /> Strong overall result
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">Strong performance with room to sharpen edge cases.</h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                You communicated clearly and structured the problem well. Push deeper on
                scalability trade-offs and walk through edge cases more explicitly.
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3 max-w-md">
                {[
                  { k: "Questions", v: "5" },
                  { k: "Duration", v: "24m" },
                  { k: "Level", v: "Senior" },
                ].map((s) => (
                  <div key={s.k} className="rounded-xl border border-border bg-background/50 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.k}</div>
                    <div className="mt-1 text-sm font-semibold">{s.v}</div>
                  </div>
                ))}
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
                <RadarChart data={RADAR} outerRadius="75%">
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
              <h3 className="text-base font-semibold tracking-tight">Per-question breakdown</h3>
              <p className="text-xs text-muted-foreground">Each rubric item, scored.</p>
            </div>
            <ul className="divide-y divide-border">
              {BREAKDOWN.map((b) => (
                <li key={b.label} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    {b.status === "warn" ? (
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-warning/15 text-warning">
                        <AlertTriangle className="h-3.5 w-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-success/15 text-success">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </span>
                    )}
                    <div className="text-sm font-medium">{b.label}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-gradient-brand" style={{ width: `${(b.score / 10) * 100}%` }} />
                    </div>
                    <div className="w-10 text-right text-sm font-semibold tabular-nums">{b.score}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Feedback */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="inline-flex items-center gap-2 rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success">
              <CheckCircle2 className="h-3.5 w-3.5" /> What went well
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              {["Strong problem decomposition before jumping to solutions.",
                "Clear articulation of API contracts and data model.",
                "Good instinct for caching layers and read-heavy workloads."].map((t) => (
                <li key={t} className="flex gap-2"><span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-success" /><span>{t}</span></li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="inline-flex items-center gap-2 rounded-full bg-warning/15 px-3 py-1 text-xs font-medium text-warning">
              <AlertTriangle className="h-3.5 w-3.5" /> Where to improve
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              {["Address edge cases explicitly (hot keys, expired URLs).",
                "Quantify capacity estimates with concrete numbers.",
                "Spend more time discussing failure modes and recovery."].map((t) => (
                <li key={t} className="flex gap-2"><span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-warning" /><span>{t}</span></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Suggestions */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-brand text-white shadow-glow">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <h3 className="text-base font-semibold tracking-tight">Suggestions to level up</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Targeted next steps based on this session.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              { title: "Drill: Capacity estimation", body: "Practice back-of-envelope math for QPS, storage, and bandwidth.", tag: "15 min" },
              { title: "Read: Designing Data-Intensive Apps — Ch. 6", body: "Sharpen partitioning and replication trade-offs.", tag: "Reading" },
              { title: "Mock: Edge-case focused", body: "Run a session emphasizing failure modes and recovery.", tag: "20 min" },
            ].map((s) => (
              <div key={s.title} className="group rounded-xl border border-border bg-background p-4 transition-all hover:border-brand/40 hover:shadow-soft">
                <div className="inline-flex items-center rounded-full bg-gradient-soft px-2 py-0.5 text-[10px] font-medium text-brand">{s.tag}</div>
                <div className="mt-2 text-sm font-semibold">{s.title}</div>
                <p className="mt-1 text-xs text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 relative overflow-hidden rounded-2xl border border-border bg-gradient-brand p-6 text-white shadow-elevated">
          <div className="absolute inset-0 bg-mesh opacity-30" />
          <div className="relative flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5" />
              <div>
                <div className="font-semibold">Try a focused drill on edge cases.</div>
                <div className="text-sm text-white/80">15 minutes • generated from your weak spots.</div>
              </div>
            </div>
            <Link to="/interview" className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-medium text-foreground shadow-soft transition-transform hover:scale-[1.02]">
              Start drill <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
