import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group flex items-center gap-2 ${className}`}>
      <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand shadow-glow">
        <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
      </span>
      <span className="text-[17px] font-semibold tracking-tight">PrepVerse</span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass-strong border-b border-border/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <Link to="/dashboard" className="transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>Dashboard</Link>
            <Link to="/history" className="transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>History</Link>
            <a href="/#features" className="transition-colors hover:text-foreground">Features</a>
            <a href="/#pricing" className="transition-colors hover:text-foreground">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground md:inline">Sign in</Link>
            <Link
              to="/dashboard"
              className="inline-flex h-9 items-center rounded-full bg-gradient-brand px-4 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02]"
            >
              Get started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
