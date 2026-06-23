import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
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
} from "lucide-react";

export const Route = createFileRoute("/interview")({
  head: () => ({ meta: [{ title: "Interview — PrepVerse" }] }),
  component: InterviewPage,
});

const QUESTIONS = [
  "Design a URL shortener that scales to 100M requests per day. Walk me through your data model, traffic estimation, and how you'd handle hot keys.",
  "Tell me about a time you disagreed with a teammate's technical decision. How did you handle it and what was the outcome?",
  "Given a binary tree, write a function that returns the maximum path sum where the path can start and end at any node.",
  "How would you design a notification system for a social network with 500M users? Focus on delivery guarantees and fanout.",
  "Walk me through what happens, end to end, when you type a URL into a browser and press enter.",
];

function InterviewPage() {
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState("");
  const [recording, setRecording] = useState(false);
  const progress = ((i + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <X className="h-4 w-4" /> Exit interview
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium text-foreground/80 shadow-soft">
            <Clock className="h-3.5 w-3.5 text-brand" /> 12:48 elapsed
          </div>
        </div>

        {/* Progress */}
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
                  className={`h-full rounded-full transition-all duration-500 ${
                    idx <= i ? "bg-gradient-brand" : "bg-transparent"
                  }`}
                  style={{ width: idx <= i ? "100%" : "0%" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Question card */}
        <div className="relative mt-8">
          <div className="absolute -inset-2 rounded-3xl bg-gradient-brand opacity-10 blur-2xl" />
          <div className="relative rounded-2xl border border-border bg-card p-8 shadow-elevated">
            <div className="flex items-start gap-3">
              <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-glow">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-brand">System Design</div>
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

        {/* Answer area */}
        <div className="mt-6 rounded-2xl border border-border bg-card shadow-soft">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="text-xs font-medium text-muted-foreground">Your answer</div>
            <button
              onClick={() => setRecording((r) => !r)}
              className={`inline-flex h-8 items-center gap-2 rounded-full px-3 text-xs font-medium transition-colors ${
                recording
                  ? "bg-destructive/10 text-destructive"
                  : "bg-secondary text-foreground hover:bg-accent"
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

        {/* Nav */}
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
