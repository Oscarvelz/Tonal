import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { textOn } from "@/lib/color/convert";
import { PALETTES } from "@/lib/color/palettes";
import { SEASON_REGIONS } from "@/lib/color/munsell";
import { RULES, RULE_GROUP_LABEL, type RuleGroup } from "@/lib/color/rules";
import {
  EXTENSION_RATIOS,
  FAST_RULES,
  SEASON_GUIDES,
  SEVEN_CONTRASTS,
} from "@/lib/color/theory";
import {
  HARMONY_LABEL,
  PERSONAL_SEASON_LABEL,
  PERSONAL_SEASONS,
  type PersonalSeason,
} from "@/lib/color/types";
import { useDress } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/learn")({ component: LearnPage });

const GROUP_ORDER: RuleGroup[] = [
  "proportion",
  "leather",
  "temperature",
  "formality",
  "season",
  "face",
  "errors",
  "speed",
];

/**
 * Learn (2.0) — the reference, demoted from a destination to a bookshelf:
 * the chord, the contrasts, the regions, every chord in the book, and the
 * rules in one collapsed list. Nothing here is required to get dressed.
 */
function LearnPage() {
  const applyPalette = useDress((s) => s.applyPalette);
  const navigate = useNavigate();
  const demo = PALETTES.find((p) => p.id === "midnight-camel") ?? PALETTES[0]!;

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-display text-[32px] font-medium leading-tight text-fg">Learn</h1>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
          The reference. None of it is required at 7 a.m. — it's here when a morning goes
          slow.
        </p>
      </header>

      <Section title="The chord — 60 · 30 · 10">
        <div className="rounded-lg bg-mat p-2.5 sm:p-3">
          <div className="flex h-36 gap-1">
            {(
              [
                { hex: demo.colors.dominant.hex, grow: 6, label: "60" },
                { hex: demo.colors.secondary.hex, grow: 3, label: "30" },
                { hex: demo.colors.accent.hex, grow: 1, label: "10" },
              ] as const
            ).map((field) => (
              <div
                key={field.label}
                className="relative rounded-[2px]"
                style={{ flexGrow: field.grow, background: field.hex }}
              >
                <span
                  className="absolute bottom-1.5 left-2 font-mono text-[11px]"
                  style={{ color: textOn(field.hex) }}
                >
                  {field.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[15px] leading-relaxed text-fg">
          {demo.colors.dominant.name}, {demo.colors.secondary.name},{" "}
          {demo.colors.accent.name} — one chord at true proportion. Sixty is architecture,
          thirty is the second cloth, ten is the pulse.
        </p>
        <ul className="flex flex-col gap-3">
          {FAST_RULES.map((rule) => (
            <li key={rule.title}>
              <p className="text-sm font-medium text-fg">{rule.title}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-muted">{rule.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Extension — how much of each">
        <p className="text-sm leading-relaxed text-muted">
          Itten's ratios: equal-strength opposites balance at unequal areas. The stronger the
          color, the less of it the chord can carry.
        </p>
        <ul className="flex flex-col gap-4">
          {EXTENSION_RATIOS.map((ratio) => (
            <li key={ratio.pair}>
              <div className="flex h-9 gap-1">
                <div
                  className="rounded-[2px]"
                  style={{ flexGrow: ratio.a, background: ratio.aHex }}
                />
                <div
                  className="rounded-[2px]"
                  style={{ flexGrow: ratio.b, background: ratio.bHex }}
                />
              </div>
              <p className="mt-1.5 text-sm text-fg">
                {ratio.aName} : {ratio.bName}{" "}
                <span className="font-mono text-[12px] text-subtle">
                  {ratio.a}:{ratio.b}
                </span>
              </p>
              <p className="text-[13px] leading-relaxed text-muted">{ratio.note}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="The seven contrasts">
        <ul className="flex flex-col">
          {SEVEN_CONTRASTS.map((contrast) => (
            <li key={contrast.id} className="border-b border-border py-3 last:border-b-0">
              <p className="text-sm font-medium text-fg">{contrast.title}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-muted">{contrast.dress}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="The twelve regions">
        <p className="text-sm leading-relaxed text-muted">
          Tonal's own boxes in Munsell space — temperature × value × chroma, after the 1943
          renotation. Set yours in You; the generator then refuses chords whose large fields
          live outside it.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {PERSONAL_SEASONS.map((p: PersonalSeason) => (
            <RegionCard key={p} season={p} />
          ))}
        </div>
      </Section>

      <Section title="Chords">
        <p className="text-sm leading-relaxed text-muted">
          Every chord in the book, at true proportion. Tap one to wear it today.
        </p>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PALETTES.map((palette) => (
            <li
              key={palette.id}
              className="overflow-hidden rounded-lg bg-surface shadow-[var(--shadow-border)]"
            >
              <button
                type="button"
                onClick={() => {
                  applyPalette(palette.id);
                  void navigate({ to: "/" });
                }}
                className="block w-full text-left transition-transform duration-150 ease-out active:scale-[0.99]"
                aria-label={`Wear the ${palette.name} chord`}
              >
                <div className="flex h-16 gap-0.5 bg-mat p-1.5">
                  <div
                    className="rounded-[2px]"
                    style={{ flexGrow: 6, background: palette.colors.dominant.hex }}
                  />
                  <div
                    className="rounded-[2px]"
                    style={{ flexGrow: 3, background: palette.colors.secondary.hex }}
                  />
                  <div
                    className="rounded-[2px]"
                    style={{ flexGrow: 1, background: palette.colors.accent.hex }}
                  />
                </div>
                <div className="px-3.5 py-2.5">
                  <p className="font-display text-lg font-medium leading-tight text-fg">
                    {palette.name}
                  </p>
                  <p className="mt-0.5 text-[12px] text-muted">
                    {palette.colors.dominant.name} · {palette.colors.secondary.name} ·{" "}
                    {palette.colors.accent.name} — {HARMONY_LABEL[palette.harmony]}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="The rules">
        <p className="text-sm leading-relaxed text-muted">
          {RULES.length} dressing rules in eight groups. The generator pins a handful to each
          look; the rest are here.
        </p>
        <div className="flex flex-col">
          {GROUP_ORDER.map((group) => (
            <RuleGroupBlock key={group} group={group} />
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-t border-border pt-5">
      <h2 className="font-display text-2xl font-medium text-fg">{title}</h2>
      {children}
    </section>
  );
}

function RegionCard({ season }: { season: PersonalSeason }) {
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
      <p className="text-[12px] text-subtle">{g.family}</p>
      <h3 className="mt-0.5 font-display text-xl font-medium text-fg">
        {PERSONAL_SEASON_LABEL[season]}
      </h3>
      <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-subtle">
        {`${kind} · value ${region.vMin}–${region.vMax} · chroma ${region.cMin}–${region.cMax}`}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{g.note}</p>
      <p className="mt-2 text-sm text-fg">Wear {g.best}.</p>
      <p className="mt-0.5 text-sm text-muted">Skip {g.avoid}.</p>
    </article>
  );
}

function RuleGroupBlock({ group }: { group: RuleGroup }) {
  const [open, setOpen] = useState(false);
  const items = RULES.filter((r) => r.group === group);
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-3 text-left"
      >
        <span className="text-sm font-medium text-fg">
          {RULE_GROUP_LABEL[group]}{" "}
          <span className="font-mono text-[11px] text-subtle">{items.length}</span>
        </span>
        <ChevronDown
          className={cn("size-4 text-muted transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      {open ? (
        <ul className="flex flex-col gap-3 pb-4">
          {items.map((rule) => (
            <li key={rule.id}>
              <p className="text-sm font-medium text-fg">{rule.title}</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-muted">{rule.body}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
