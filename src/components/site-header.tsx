import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Sparkles, User, Settings, LogOut, ChevronDown } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group flex items-center gap-2 ${className}`}>
      <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand shadow-glow">
        <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
      </span>
      <span className="text-[17px] font-semibold tracking-tight">InterviewVerse</span>
    </Link>
  );
}

type Variant = "marketing" | "app";

function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-1.5 py-1 pr-2.5 text-sm shadow-soft transition-colors hover:bg-secondary"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-brand text-[11px] font-semibold text-white shadow-glow">
          AJ
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-card p-1 shadow-elevated"
        >
          <div className="px-3 py-2.5">
            <div className="text-sm font-medium">Alex Johnson</div>
            <div className="truncate text-xs text-muted-foreground">alex@prepverse.app</div>
          </div>
          <div className="my-1 h-px bg-border" />
          {[
            { label: "Profile", icon: User },
            { label: "Settings", icon: Settings },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
            >
              <item.icon className="h-4 w-4 text-muted-foreground" />
              {item.label}
            </button>
          ))}
          <div className="my-1 h-px bg-border" />
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
          >
            <LogOut className="h-4 w-4 text-muted-foreground" />
            Log out
          </Link>
        </div>
      )}
    </div>
  );
}

export function SiteHeader({ variant = "marketing" }: { variant?: Variant } = {}) {
  const isApp = variant === "app";
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass-strong border-b border-border/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <Link to="/dashboard" className="transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>Dashboard</Link>
            <Link to="/interview" className="transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>Interview</Link>
            <Link to="/history" className="transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>History</Link>
            {!isApp && (
              <>
                <a href="/#features" className="transition-colors hover:text-foreground">Features</a>
                <a href="/#pricing" className="transition-colors hover:text-foreground">Pricing</a>
              </>
            )}
          </nav>
          <div className="flex items-center gap-2">
            {isApp ? (
              <UserMenu />
            ) : (
              <>
                <Link to="/login" className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground md:inline">Sign in</Link>
                <Link
                  to="/dashboard"
                  className="inline-flex h-9 items-center rounded-full bg-gradient-brand px-4 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02]"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
