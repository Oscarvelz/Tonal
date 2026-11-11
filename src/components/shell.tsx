import { Link, useRouterState } from "@tanstack/react-router";
import { Bookmark, CircleUserRound, Moon, Shirt, Sun } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useDress } from "@/lib/store";
import { toggleStage, useStage } from "@/lib/theme";

const NAV = [
  { to: "/", label: "Today", icon: Shirt },
  { to: "/saved", label: "Saved", icon: Bookmark },
  { to: "/you", label: "You", icon: CircleUserRound },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hydrate = useDress((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-56 flex-col border-r border-border bg-bg pt-[max(1.5rem,env(safe-area-inset-top))] lg:flex">
        <Brand />
        <nav className="mt-8 flex flex-col gap-1 px-3">
          {NAV.map((item) => (
            <NavLink key={item.to} {...item} active={isActive(pathname, item.to)} rail />
          ))}
        </nav>
        <div className="mt-auto flex items-center justify-between px-3 pb-6">
          <span className="px-2 text-[13px] text-subtle">Stage</span>
          <StageToggle />
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-bg px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] lg:hidden">
        <Brand compact />
        <StageToggle />
      </header>

      <div className="lg:pl-56">
        <main className="mx-auto w-full max-w-6xl px-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-4 sm:px-6 lg:px-8 lg:pb-16">
          {children}
        </main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-bg pb-[env(safe-area-inset-bottom)] lg:hidden"
        aria-label="Primary"
      >
        <ul className="grid grid-cols-3">
          {NAV.map((item) => (
            <li key={item.to} className="relative">
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
    <Link to="/" className={cn("block", compact ? "" : "px-5")} aria-label="TONAL — home">
      <p className="text-[15px] font-semibold uppercase tracking-[0.3em] text-fg">Tonal</p>
    </Link>
  );
}

function StageToggle() {
  const stage = useStage();
  const evening = stage === "evening";
  return (
    <button
      type="button"
      onClick={toggleStage}
      aria-label={evening ? "Switch to daylight" : "Switch to evening"}
      aria-pressed={evening}
      className="flex size-10 items-center justify-center rounded-full text-muted transition-colors duration-150 hover:text-fg active:scale-95"
    >
      {evening ? <Sun className="size-5" strokeWidth={1.7} /> : <Moon className="size-5" strokeWidth={1.7} />}
    </button>
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
  if (rail) {
    return (
      <Link
        to={to}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors duration-150",
          active ? "bg-surface font-medium text-fg" : "text-muted hover:bg-surface hover:text-fg",
        )}
      >
        <Icon className="size-5" strokeWidth={active ? 2 : 1.7} />
        {label}
      </Link>
    );
  }
  return (
    <Link
      to={to}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-[3.75rem] flex-col items-center justify-center gap-1 text-[11px] transition-colors duration-150",
        active ? "font-medium text-fg" : "text-muted",
      )}
    >
      {active ? (
        <span className="absolute inset-x-6 top-0 h-0.5 bg-fg" aria-hidden />
      ) : null}
      <Icon className="size-5" strokeWidth={active ? 2 : 1.7} />
      {label}
    </Link>
  );
}
