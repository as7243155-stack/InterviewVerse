import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import {
  ArrowUpRight,
  Plus,
  TrendingUp,
  Clock,
  Trophy,
  Flame,
  Code2,
  MessageSquare,
  Layers,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — InterviewVerse" }] }),
  component: Dashboard,
});

const STATS = [
  { label: "Total interviews", value: "5", delta: "+2 this week", icon: Trophy, accent: "from-violet-500 to-blue-500" },
  { label: "Average score", value: "7.8", delta: "Across all sessions", icon: TrendingUp, accent: "from-emerald-500 to-teal-500" },
  { label: "Best score", value: "8.6", delta: "System Design", icon: Flame, accent: "from-orange-500 to-pink-500" },
  { label: "Practice time", value: "2h 10m", delta: "This week", icon: Clock, accent: "from-blue-500 to-cyan-500" },
];

const RECENT = [
  { title: "System Design — URL Shortener", type: "System Design", score: 8.6, time: "2h ago", icon: Layers },
  { title: "Behavioral — Conflict Resolution", type: "Behavioral", score: 7.9, time: "Yesterday", icon: MessageSquare },
  { title: "DSA — Graph Algorithms", type: "Technical", score: 7.4, time: "2 days ago", icon: Code2 },
];

const TRACKS = [
  { name: "Frontend Engineer", progress: 68, color: "from-violet-500 to-fuchsia-500" },
  { name: "Backend Engineer", progress: 42, color: "from-blue-500 to-cyan-500" },
  { name: "System Design", progress: 81, color: "from-emerald-500 to-teal-500" },
];

function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader variant="app" />
      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Greeting */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">
              Ready for your next interview?
            </h1>
          </div>
          <div className="flex gap-2">
            <Link
              to="/history"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground shadow-soft transition-colors hover:bg-secondary"
            >
              View history
            </Link>
            <Link
              to="/interview"
              className="group inline-flex h-11 items-center gap-2 rounded-full bg-gradient-brand px-5 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4" /> Start interview
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft hover-lift">
              <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${s.accent} opacity-10 blur-2xl`} />
              <div className="flex items-center justify-between">
                <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${s.accent} text-white shadow-soft`}>
                  <s.icon className="h-4 w-4" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div className="mt-4 text-3xl font-semibold tracking-tight">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
              <div className="mt-3 text-xs font-medium text-brand">{s.delta}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Recent */}
          <section className="rounded-2xl border border-border bg-card shadow-soft">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <h2 className="text-base font-semibold tracking-tight">Recent interviews</h2>
                <p className="text-xs text-muted-foreground">Pick up where you left off</p>
              </div>
              <Link to="/history" className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline">
                View all <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            {RECENT.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-soft text-brand">
                  <Plus className="h-5 w-5" />
                </div>
                <div className="mt-4 text-sm font-medium">No interviews yet</div>
                <p className="mt-1 text-xs text-muted-foreground">Start your first mock interview to see it here.</p>
                <Link
                  to="/interview"
                  className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-full bg-gradient-brand px-4 text-xs font-medium text-white shadow-glow"
                >
                  Start interview
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {RECENT.map((r) => (
                  <li key={r.title}>
                    <Link to="/results" className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-secondary/50">
                      <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-soft text-brand">
                        <r.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{r.title}</div>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{r.type}</span><span>•</span><span>{r.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gradient-brand">{r.score}</div>
                          <div className="text-[10px] text-muted-foreground">/ 10</div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Tracks */}
          <section className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="text-base font-semibold tracking-tight">Your tracks</h2>
              <p className="text-xs text-muted-foreground">Progress toward role readiness</p>
              <div className="mt-5 space-y-5">
                {TRACKS.map((t) => (
                  <div key={t.name}>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="font-medium">{t.name}</span>
                      <span className="text-muted-foreground">{t.progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-secondary">
                      <div className={`h-full rounded-full bg-gradient-to-r ${t.color}`} style={{ width: `${t.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-brand p-6 text-white shadow-elevated">
              <div className="absolute inset-0 bg-mesh opacity-30" />
              <div className="relative">
                <div className="text-xs font-medium uppercase tracking-wider text-white/80">Recommended next</div>
                <h3 className="mt-2 text-lg font-semibold">System Design — Rate Limiter</h3>
                <p className="mt-1 text-sm text-white/85">Based on your last two sessions.</p>
                <Link
                  to="/interview"
                  className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-4 text-xs font-medium text-foreground shadow-soft transition-transform hover:scale-[1.02]"
                >
                  Start now <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
