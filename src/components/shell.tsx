import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Download, Layers, Shirt, Sparkles, Bookmark } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useDress } from "@/lib/store";

const NAV = [
  { to: "/", label: "Dress", icon: Shirt },
  { to: "/studies", label: "Studies", icon: Layers },
  { to: "/theory", label: "Theory", icon: BookOpen },
  { to: "/studio", label: "Studio", icon: Sparkles },
  { to: "/closet", label: "Closet", icon: Bookmark },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hydrate = useDress((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-56 flex-col border-r border-border bg-bg-elevated pt-[max(1.5rem,env(safe-area-inset-top))] lg:flex">
        <Brand />
        <nav className="mt-8 flex flex-col gap-1 px-3">
          {NAV.map((item) => (
            <NavLink key={item.to} {...item} active={isActive(pathname, item.to)} rail />
          ))}
        </nav>
        <div className="mt-auto px-3 pb-6">
          <InstallLink active={pathname === "/install"} rail />
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-bg/90 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-md lg:hidden">
        <Brand compact />
        <div className="flex items-center gap-1">
          <InstallLink active={pathname === "/install"} />
          <LiveDot />
        </div>
      </header>

      <div className="lg:pl-56">
        <div className="hidden items-center justify-end px-8 pt-6 lg:flex">
          <LiveDot />
        </div>
        <main className="mx-auto w-full max-w-6xl px-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-4 sm:px-6 lg:px-8 lg:pb-16 lg:pt-2">
          {children}
        </main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-bg-elevated/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
        aria-label="Primary"
      >
        <ul className="grid grid-cols-5">
          {NAV.map((item) => (
            <li key={item.to}>
              <NavLink {...item} active={isActive(pathname, item.to)} />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className={cn("block", compact ? "" : "px-5")}>
      <p className="font-display text-2xl font-medium tracking-[0.08em] text-fg">TONAL</p>
      {compact ? null : (
        <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-subtle">Dress by color</p>
      )}
    </Link>
  );
}

function LiveDot() {
  const live = useDress((s) => s.live);
  return (
    <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">
      <span className={cn("size-1.5 rounded-full", live ? "bg-accent" : "bg-subtle")} aria-hidden />
      {live ? "Live" : "Held"}
    </span>
  );
}

function InstallLink({ active, rail }: { active: boolean; rail?: boolean }) {
  return (
    <Link
      to="/install"
      aria-current={active ? "page" : undefined}
      aria-label="Install"
      className={cn(
        "flex items-center gap-3 transition-colors duration-150",
        rail
          ? cn(
              "rounded-md px-3 py-2.5 text-sm",
              active ? "bg-surface text-fg" : "text-muted hover:bg-surface hover:text-fg",
            )
          : cn("flex size-11 items-center justify-center rounded-md", active ? "text-fg" : "text-muted"),
      )}
    >
      <Download className="size-5" strokeWidth={active ? 2 : 1.7} />
      {rail ? "Install" : null}
    </Link>
  );
}

function isActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

function NavLink({
  to,
  label,
  icon: Icon,
  active,
  rail,
}: {
  to: string;
  label: string;
  icon: typeof Shirt;
  active: boolean;
  rail?: boolean;
}) {
  return (
    <Link
      to={to}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 transition-colors duration-150",
        rail
          ? cn(
              "rounded-md px-3 py-2.5 text-sm",
              active ? "bg-surface text-fg" : "text-muted hover:bg-surface hover:text-fg",
            )
          : cn(
              "flex h-[3.75rem] flex-col items-center justify-center gap-1 text-[11px]",
              active ? "text-fg" : "text-muted",
            ),
      )}
    >
      <Icon className="size-5" strokeWidth={active ? 2 : 1.7} />
      {label}
    </Link>
  );
}
