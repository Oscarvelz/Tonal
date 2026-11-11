import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Check, ChevronRight, Download } from "lucide-react";
import { ContrastCheck } from "@/components/contrast-check";
import { SeasonFinder } from "@/components/season-finder";
import { Segmented } from "@/components/segmented";
import { Button } from "@/components/ui/button";
import { SEASON_REGIONS } from "@/lib/color/munsell";
import { SEASON_GUIDES } from "@/lib/color/theory";
import {
  PERSONAL_SEASON_LABEL,
  PERSONAL_SEASONS,
  type Gender,
  type PersonalSeason,
} from "@/lib/color/types";
import { useInstallPrompt } from "@/lib/install";
import { useDress } from "@/lib/store";
import { setStage, useStage, type Stage } from "@/lib/theme";
import { TONAL_VERSION } from "@/lib/version";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/you")({ component: YouPage });

/**
 * You (2.0) — the setup that used to be buried in a textbook: your colors,
 * your wardrobe, your stage. Set once; Today does the rest.
 */
function YouPage() {
  const personalSeason = useDress((s) => s.personalSeason);
  const setPersonalSeason = useDress((s) => s.setPersonalSeason);
  const gender = useDress((s) => s.gender);
  const setGender = useDress((s) => s.setGender);
  const closetMode = useDress((s) => s.closetMode);
  const setClosetMode = useDress((s) => s.setClosetMode);
  const savedCount = useDress((s) => s.saved.length);
  const stage = useStage();

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-display text-[32px] font-medium leading-tight text-fg">You</h1>
        <p className="mt-1 text-sm text-muted">
          Set once. Every look on Today is dressed for this.
        </p>
      </header>

      <Section title="Your colors">
        {personalSeason !== "any" ? <OwnSeasonCard season={personalSeason} /> : null}
        <ContrastCheck />
        <SeasonFinder />
        <div>
          <p className="text-sm font-medium text-fg">Season</p>
          <div className="chip-scroll -mx-1 mt-2 flex gap-1.5 overflow-x-auto px-1 pb-1">
            <SeasonChip
              active={personalSeason === "any"}
              onClick={() => setPersonalSeason("any")}
              label="Not set"
            />
            {PERSONAL_SEASONS.map((p) => (
              <SeasonChip
                key={p}
                active={personalSeason === p}
                onClick={() => setPersonalSeason(p)}
                label={PERSONAL_SEASON_LABEL[p]}
              />
            ))}
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-subtle">
            Tonal's twelve regions, after Munsell — boxes of temperature × value × chroma in
            the measured color system, not a fashion fan.
          </p>
        </div>
      </Section>

      <Section title="Wardrobe">
        <Segmented
          label="Wearing"
          value={gender}
          onChange={(v: Gender) => setGender(v)}
          options={[
            { value: "men", label: "Men" },
            { value: "women", label: "Women" },
          ]}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="max-w-md">
            <p className="text-sm font-medium text-fg">Dress from my closet</p>
            <p className="mt-0.5 text-[13px] leading-relaxed text-muted">
              {savedCount > 0
                ? "New looks may only use colors already in your saved looks."
                : "Save a look first — then Tonal can dress you from what you own."}
            </p>
          </div>
          <Button
            variant={closetMode ? "primary" : "outline"}
            aria-pressed={closetMode}
            disabled={savedCount === 0}
            onClick={() => setClosetMode(!closetMode)}
          >
            {closetMode ? "On" : "Off"}
          </Button>
        </div>
      </Section>

      <Section title="Stage">
        <Segmented
          label="Light"
          value={stage}
          onChange={(v: Stage) => setStage(v)}
          options={[
            { value: "daylight", label: "Daylight" },
            { value: "evening", label: "Evening" },
          ]}
        />
        <p className="text-[13px] leading-relaxed text-subtle">
          Both stages are neutral — the clothes keep the only color in the room, and the mat
          under the chord never changes.
        </p>
      </Section>

      <Link
        to="/learn"
        className="flex items-center justify-between gap-4 rounded-lg bg-surface px-4 py-4 shadow-[var(--shadow-border)] transition-transform duration-150 ease-out active:scale-[0.99]"
      >
        <div>
          <p className="font-display text-xl font-medium text-fg">Learn</p>
          <p className="mt-0.5 text-sm text-muted">
            The reference — chords, contrasts, the twelve regions, and the rules.
          </p>
        </div>
        <ChevronRight className="size-5 shrink-0 text-muted" />
      </Link>

      <InstallCard />

      <p className="pt-2 text-center font-mono text-[11px] text-subtle">TONAL {TONAL_VERSION}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-t border-border pt-5">
      <h2 className="text-sm font-semibold text-fg">{title}</h2>
      {children}
    </section>
  );
}

function SeasonChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "h-9 shrink-0 whitespace-nowrap rounded-full px-3.5 text-sm shadow-[var(--shadow-border)] transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.97]",
        active ? "bg-accent font-medium text-accent-fg" : "bg-surface text-muted hover:text-fg",
      )}
    >
      {label}
    </button>
  );
}

function OwnSeasonCard({ season }: { season: PersonalSeason }) {
  const g = SEASON_GUIDES[season];
  const region = SEASON_REGIONS[season];
  const kind =
    region.kind === "warm"
      ? "warm"
      : region.kind === "cool"
        ? "cool"
        : region.kind === "warm-neutral"
          ? "warm-leaning"
          : "cool-leaning";
  return (
    <article className="rounded-lg bg-surface px-4 py-4 shadow-[var(--shadow-border)]">
      <p className="text-[13px] text-subtle">{g.family}</p>
      <h3 className="mt-0.5 font-display text-2xl font-medium text-fg">
        {PERSONAL_SEASON_LABEL[season]}
      </h3>
      <p className="mt-2 text-sm text-fg">{g.chroma}</p>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-subtle">
        {`Region — ${kind} · value ${region.vMin}–${region.vMax} · chroma ${region.cMin}–${region.cMax}`}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{g.note}</p>
      <p className="mt-2 text-sm text-fg">Wear {g.best}.</p>
      <p className="mt-1 text-sm text-muted">Skip {g.avoid}.</p>
      <p className="mt-2 text-[13px] text-subtle">{g.metals}</p>
    </article>
  );
}

function InstallCard() {
  const { canInstall, installed, install } = useInstallPrompt();
  const [inShell] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.hasAttribute("data-android"),
  );

  if (inShell) return null;

  return (
    <section className="flex flex-col gap-2 rounded-lg bg-surface px-4 py-4 shadow-[var(--shadow-border)]">
      <h2 className="font-display text-xl font-medium text-fg">Tonal on the home screen</h2>
      {installed ? (
        <p className="flex items-start gap-2 text-sm leading-relaxed text-muted">
          <Check className="mt-0.5 size-4 shrink-0 text-fg" />
          Already installed — you are running Tonal as an app. Looks still save on this
          device.
        </p>
      ) : canInstall ? (
        <>
          <p className="text-sm leading-relaxed text-muted">
            Pin Tonal next to your other apps. It opens full-screen and works offline.
          </p>
          <div>
            <Button onClick={() => void install()}>
              <Download className="size-4" />
              Install Tonal
            </Button>
          </div>
        </>
      ) : (
        <p className="text-sm leading-relaxed text-muted">
          From the browser menu, choose Install app or Add to Home screen. Same result: a
          home-screen app, not a tab. On Android, Tonal also ships as a real app (Tonal.apk,
          from the Tonal GitHub releases) that updates itself.
        </p>
      )}
    </section>
  );
}
