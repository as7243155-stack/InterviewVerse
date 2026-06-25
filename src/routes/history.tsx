import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { Search, Calendar, ChevronRight, Code2, MessageSquare, Layers, Filter } from "lucide-react";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "History — InterviewVerse" }] }),
  component: HistoryPage,
});

type Item = { id: string; title: string; type: "System Design" | "Behavioral" | "Technical"; score: number; date: string; duration: string };
const ITEMS: Item[] = [
  { id: "1", title: "URL Shortener at Scale", type: "System Design", score: 8.6, date: "Jun 22, 2026", duration: "24m" },
  { id: "2", title: "Conflict Resolution Story", type: "Behavioral", score: 7.9, date: "Jun 21, 2026", duration: "18m" },
  { id: "3", title: "Graph Algorithms Drill", type: "Technical", score: 8.1, date: "Jun 20, 2026", duration: "32m" },
  { id: "4", title: "Chat App Architecture", type: "System Design", score: 7.4, date: "Jun 18, 2026", duration: "28m" },
  { id: "5", title: "Leadership Principles Mock", type: "Behavioral", score: 8.8, date: "Jun 17, 2026", duration: "22m" },
  { id: "6", title: "Dynamic Programming Set", type: "Technical", score: 7.2, date: "Jun 16, 2026", duration: "40m" },
  { id: "7", title: "Notification System Design", type: "System Design", score: 8.3, date: "Jun 14, 2026", duration: "26m" },
];

const ICON = { "System Design": Layers, Behavioral: MessageSquare, Technical: Code2 };
const FILTERS = ["All", "System Design", "Behavioral", "Technical"] as const;

function HistoryPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const filtered = ITEMS.filter(
    (i) => (filter === "All" || i.type === filter) && i.title.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader variant="app" />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Interview history</h1>
            <p className="mt-1 text-sm text-muted-foreground">{ITEMS.length} sessions completed</p>
          </div>
          <Link
            to="/interview"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-brand px-4 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02]"
          >
            Start Interview
          </Link>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search interviews…"
              className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm shadow-soft placeholder:text-muted-foreground focus:outline-none focus:ring-brand"
            />
          </div>
          <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-soft">
            <Filter className="ml-2 h-3.5 w-3.5 text-muted-foreground" />
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`h-8 rounded-full px-3 text-xs font-medium transition-all ${
                  filter === f
                    ? "bg-gradient-brand text-white shadow-soft"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((it) => {
            const Icon = ICON[it.type];
            return (
              <Link
                to="/results"
                key={it.id}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft hover-lift"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-brand opacity-[0.06] blur-2xl transition-opacity group-hover:opacity-20" />
                <div className="flex items-start justify-between">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-soft text-brand">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-semibold text-gradient-brand">{it.score}</div>
                    <div className="text-[10px] text-muted-foreground">/ 10</div>
                  </div>
                </div>
                <h3 className="mt-5 text-base font-semibold tracking-tight">{it.title}</h3>
                <div className="mt-1 text-xs text-muted-foreground">{it.type}</div>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5"><Calendar className="h-3 w-3" />{it.date}</span>
                  <span>{it.duration}</span>
                </div>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand">
                  View report
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="mt-16 rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
            No interviews match your filters.
          </div>
        )}
      </main>
    </div>
  );
}
