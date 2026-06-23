import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import {
  ArrowRight,
  Sparkles,
  Brain,
  Mic,
  LineChart,
  ShieldCheck,
  Zap,
  Target,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PrepVerse — AI Interview Coach for Top Tech Roles" },
      { name: "description", content: "Practice technical, behavioral, and system design interviews with an AI coach that gives real-time feedback, structured scoring, and personalized prep plans." },
      { property: "og:title", content: "PrepVerse — AI Interview Coach" },
      { property: "og:description", content: "Land your next role with AI-powered mock interviews and instant feedback." },
    ],
  }),
  component: Landing,
});

const COMPANIES = ["Google", "Meta", "Stripe", "Linear", "Anthropic", "Vercel", "Notion", "OpenAI"];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-80" />
        <div className="absolute inset-x-0 top-0 -z-10 h-[600px] bg-gradient-soft" />
        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-28 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium text-foreground/80 shadow-soft animate-fade-in">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
            </span>
            Now with real-time voice interviews
            <ArrowRight className="h-3 w-3" />
          </div>

          <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
            Interview prep that <br className="hidden md:block" />
            feels like the <span className="text-gradient-brand">real thing.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            PrepVerse runs realistic mock interviews with an AI coach, scores every answer,
            and builds a personalized study plan so you walk in confident on day one.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-gradient-brand px-6 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02]"
            >
              Start a free interview
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-medium text-foreground shadow-soft transition-colors hover:bg-secondary"
            >
              <Sparkles className="h-4 w-4 text-brand" />
              See a sample report
            </Link>
          </div>

          {/* Hero product preview */}
          <div className="relative mx-auto mt-20 max-w-5xl">
            <div className="absolute -inset-6 rounded-3xl bg-gradient-brand opacity-20 blur-3xl" />
            <div className="relative overflow-hidden rounded-2xl border border-border glass-strong shadow-elevated">
              <div className="flex items-center gap-1.5 border-b border-border/60 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
                <span className="ml-3 text-xs text-muted-foreground">prepverse.app / interview / system-design</span>
              </div>
              <div className="grid gap-6 p-8 md:grid-cols-[1fr_280px]">
                <div className="text-left">
                  <div className="text-xs font-medium uppercase tracking-wider text-brand">Question 3 of 5</div>
                  <h3 className="mt-2 text-xl font-semibold">Design a URL shortener that scales to 100M requests/day.</h3>
                  <div className="mt-6 rounded-xl bg-secondary/60 p-4 text-sm text-muted-foreground">
                    "I'd start with a key generation service using base62 encoding,
                    then partition the data layer by hash prefix to distribute writes…"
                  </div>
                  <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5"><Mic className="h-3.5 w-3.5 text-brand" /> Recording</span>
                    <span>•</span>
                    <span>02:14</span>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="text-xs font-medium text-muted-foreground">Live score</div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold text-gradient-brand">8.4</span>
                    <span className="text-sm text-muted-foreground">/ 10</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {[
                      { label: "Structure", v: 92 },
                      { label: "Depth", v: 78 },
                      { label: "Communication", v: 85 },
                    ].map((m) => (
                      <div key={m.label}>
                        <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                          <span>{m.label}</span><span>{m.v}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                          <div className="h-full rounded-full bg-gradient-brand" style={{ width: `${m.v}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="border-y border-border/60 bg-card/50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Trusted by candidates landing offers at
          </p>
          <div className="mt-8 grid grid-cols-2 items-center gap-x-8 gap-y-6 md:grid-cols-4 lg:grid-cols-8">
            {COMPANIES.map((c) => (
              <div key={c} className="text-center text-lg font-semibold tracking-tight text-muted-foreground/70 transition-colors hover:text-foreground">
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            <Zap className="h-3 w-3" /> Built for serious prep
          </div>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Everything you need to <span className="text-gradient-brand">close the loop</span>.
          </h2>
          <p className="mt-4 text-muted-foreground">
            From the first practice round to your offer call — PrepVerse adapts to how you learn.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            { icon: Brain, title: "Adaptive question engine", desc: "Questions adjust to your role, level, and weak spots after every session." },
            { icon: Mic, title: "Realistic voice interviews", desc: "Speak your answers naturally. We transcribe, evaluate, and follow up." },
            { icon: LineChart, title: "Detailed scoring rubric", desc: "Structure, depth, clarity, and communication — scored line by line." },
            { icon: Target, title: "Personalized study plan", desc: "A weekly plan generated from your gaps, with curated resources." },
            { icon: ShieldCheck, title: "Honest feedback", desc: "No hand-holding. We tell you exactly what a senior engineer would say." },
            { icon: Sparkles, title: "Company-specific tracks", desc: "Tracks tuned to Google, Meta, Stripe, and other top hiring loops." },
          ].map((f) => (
            <div key={f.title} className="group relative rounded-2xl border border-border bg-card p-6 shadow-soft hover-lift">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-glow">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-brand p-12 text-center text-white shadow-elevated">
          <div className="absolute inset-0 bg-mesh opacity-30" />
          <div className="relative">
            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">Ready when you are.</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/85">
              Start with 3 free interviews. No credit card. Upgrade only when you're hooked.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/dashboard" className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-foreground shadow-elevated transition-transform hover:scale-[1.02]">
                Start free <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="flex items-center gap-2 text-sm text-white/85">
                <CheckCircle2 className="h-4 w-4" /> No card required
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 bg-card/40">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-gradient-brand">
              <Sparkles className="h-3 w-3 text-white" />
            </span>
            © 2026 PrepVerse. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a className="hover:text-foreground" href="#">Privacy</a>
            <a className="hover:text-foreground" href="#">Terms</a>
            <a className="hover:text-foreground" href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
