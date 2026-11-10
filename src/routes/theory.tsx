import { createFileRoute } from "@tanstack/react-router";
import { catalogStats } from "@/lib/color/engine";
import { RULES, RULE_GROUP_LABEL, type RuleGroup } from "@/lib/color/rules";
import { STRATEGIES } from "@/lib/color/strategies";
import {
  EXTENSION_RATIOS,
  FAST_RULES,
  HARMONY_STUDY,
  OCCASION_STUDY,
  SEASON_GUIDES,
  SEVEN_CONTRASTS,
  SOPHISTICATION_STUDY,
} from "@/lib/color/theory";
import { SeasonFinder } from "@/components/season-finder";
import {
  HARMONIES,
  HARMONY_LABEL,
  OCCASION_LABEL,
  OCCASIONS,
  PERSONAL_SEASON_LABEL,
  PERSONAL_SEASONS,
  SOPHISTICATION_LABEL,
  SOPHISTICATIONS,
  type PersonalSeason,
} from "@/lib/color/types";
import { useDress } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/theory")({ component: TheoryPage });

const RULE_GROUPS: RuleGroup[] = [
  "proportion",
  "leather",
  "temperature",
  "formality",
  "season",
  "face",
  "errors",
  "speed",
];

function TheoryPage() {
  const personalSeason = useDress((s) => s.personalSeason);
  const setPersonalSeason = useDress((s) => s.setPersonalSeason);
  const stats = catalogStats();

  return (
    <div className="flex flex-col gap-12">
      <header>
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-subtle">
          Color theory
        </p>
        <h1 className="mt-1 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          Beyond complementary
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Dressing is slow when every piece auditions. {stats.strategies} strategies and{" "}
          {stats.rules} rules collapse the closet. {stats.palettes} palettes × wardrobe
          permutations is the live runway.
        </p>
      </header>

      <section>
        <h2 className="font-display text-3xl font-medium">60 · 30 · 10</h2>
        <div className="mt-4 overflow-hidden rounded-xl shadow-[var(--shadow-border)]">
          <div className="flex h-20">
            <div className="flex-[6] bg-navy px-4 py-3 text-sm text-fg">60 architecture</div>
            <div className="flex-[3] bg-camel px-4 py-3 text-sm text-accent-fg">30 second cloth</div>
            <div className="flex-[1] bg-cognac px-3 py-3 text-sm text-fg">10</div>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          Sixty is the coat, trouser, or dress. Thirty is the knit or shirt. Ten is the shoe,
          belt, or jewel. A fourth hue is almost always a mistake. The live generator is this
          ratio, applied.
        </p>
      </section>

      <section>
        <h2 className="font-display text-3xl font-medium">Strategies</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          {STRATEGIES.length} ways to decide the look before you open the closet. The generator
          picks one that fits the register, then dresses the chord.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {STRATEGIES.map((s) => (
            <article
              key={s.id}
              className="rounded-xl bg-surface px-4 py-4 shadow-[var(--shadow-border)]"
            >
              <h3 className="font-display text-2xl font-medium">{s.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg">{s.blurb}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.how}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.14em] text-subtle">
                {s.occasions.map((o) => OCCASION_LABEL[o]).join(" · ")}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-3xl font-medium">Harmonies</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {HARMONIES.map((h) => {
            const s = HARMONY_STUDY[h];
            return (
              <article
                key={h}
                className="rounded-xl bg-surface px-4 py-4 shadow-[var(--shadow-border)]"
              >
                <h3 className="font-display text-2xl font-medium">{HARMONY_LABEL[h]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg">{s.wheel}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.rule}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.14em] text-subtle">{s.when}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-display text-3xl font-medium">Seven contrasts</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Every chord in this app is one or two of these, turned up or down. Learn the seven
          and you can name what any look is doing — and what it is refusing to do.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {SEVEN_CONTRASTS.map((c) => (
            <article
              key={c.id}
              className="rounded-xl bg-surface px-4 py-4 shadow-[var(--shadow-border)]"
            >
              <h3 className="font-display text-2xl font-medium">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg">{c.body}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{c.dress}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-3xl font-medium">Extension — how much of each</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Balance between opposites is unequal areas, because hues carry unequal weight.
          The brighter hue takes the smaller field.
        </p>
        <div className="mt-5 flex flex-col gap-4">
          {EXTENSION_RATIOS.map((r) => (
            <div key={r.pair}>
              <div className="overflow-hidden rounded-xl shadow-[var(--shadow-border)]">
                <div className="flex h-14">
                  <div
                    className="px-4 py-3 text-sm text-fg"
                    style={{ flex: r.a, background: r.aHex }}
                  >
                    {r.aName} · {r.a}
                  </div>
                  <div
                    className="px-4 py-3 text-sm text-fg"
                    style={{ flex: r.b, background: r.bHex }}
                  >
                    {r.bName} · {r.b}
                  </div>
                </div>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{r.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-3xl font-medium">Registers</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {OCCASIONS.map((o) => {
            const s = OCCASION_STUDY[o];
            return (
              <article
                key={o}
                className="rounded-xl bg-surface px-4 py-4 shadow-[var(--shadow-border)]"
              >
                <h3 className="font-display text-2xl font-medium">{OCCASION_LABEL[o]}</h3>
                <p className="mt-2 text-sm text-fg">{s.blurb}</p>
                <p className="mt-3 text-sm text-muted">
                  <span className="text-fg">Do. </span>
                  {s.do}
                </p>
                <p className="mt-1 text-sm text-muted">
                  <span className="text-fg">Don't. </span>
                  {s.dont}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-display text-3xl font-medium">Taste ladder</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {SOPHISTICATIONS.map((s) => (
            <article
              key={s}
              className="rounded-xl bg-surface px-4 py-4 shadow-[var(--shadow-border)]"
            >
              <h3 className="font-display text-2xl font-medium">{SOPHISTICATION_LABEL[s]}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{SOPHISTICATION_STUDY[s]}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-3xl font-medium">Personal season</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          The twelve-season system is undertone × value × chroma. Set yours and the generator
          will bias studies toward cloth that does not fight your face.
        </p>
        <SeasonFinder />
        <div className="chip-scroll -mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1">
          <SeasonChip
            active={personalSeason === "any"}
            onClick={() => setPersonalSeason("any")}
            label="Skip"
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
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {PERSONAL_SEASONS.map((p: PersonalSeason) => {
            const g = SEASON_GUIDES[p];
            const on = personalSeason === p;
            return (
              <article
                key={p}
                className={cn(
                  "rounded-xl px-4 py-4 shadow-[var(--shadow-border)]",
                  on ? "bg-surface-2" : "bg-surface",
                )}
              >
                <p className="text-[11px] uppercase tracking-[0.14em] text-subtle">{g.family}</p>
                <h3 className="mt-1 font-display text-2xl font-medium">
                  {PERSONAL_SEASON_LABEL[p]}
                </h3>
                <p className="mt-2 text-sm text-fg">{g.chroma}</p>
                <p className="mt-2 text-sm text-muted">{g.note}</p>
                <p className="mt-3 text-sm text-fg">Wear {g.best}.</p>
                <p className="mt-1 text-sm text-muted">Skip {g.avoid}.</p>
                <p className="mt-2 text-xs uppercase tracking-[0.14em] text-subtle">{g.metals}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-display text-3xl font-medium">Fast rules</h2>
        <ol className="mt-5 space-y-4">
          {FAST_RULES.map((r, i) => (
            <li key={r.title} className="flex gap-4">
              <span className="font-display text-2xl tabular-nums text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-medium text-fg">{r.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{r.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="font-display text-3xl font-medium">Playbook</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          {RULES.length} dressing rules in eight groups. The generator pins a handful to each
          look. Read the rest when a morning goes slow.
        </p>
        <div className="mt-6 flex flex-col gap-10">
          {RULE_GROUPS.map((group) => {
            const items = RULES.filter((r) => r.group === group);
            return (
              <div key={group}>
                <h3 className="font-display text-2xl font-medium">{RULE_GROUP_LABEL[group]}</h3>
                <ol className="mt-4 space-y-4">
                  {items.map((r) => (
                    <li key={r.id}>
                      <h4 className="font-medium text-fg">{r.title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{r.body}</p>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </section>
    </div>
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
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-10 shrink-0 rounded-full px-3.5 text-sm transition-colors duration-150",
        active ? "bg-accent text-accent-fg" : "bg-surface text-muted shadow-[var(--shadow-border)]",
      )}
    >
      {label}
    </button>
  );
}
