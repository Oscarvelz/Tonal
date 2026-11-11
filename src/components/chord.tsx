import { useState, type CSSProperties } from "react";
import { ChevronDown } from "lucide-react";
import { ratioParts } from "@/lib/color/engine";
import { textOn } from "@/lib/color/convert";
import { munsellNotation } from "@/lib/color/munsell";
import type { Look, Piece } from "@/lib/color/types";
import { cn } from "@/lib/utils";

/**
 * The chord hero (2.0) — the look's 60/30/10 rendered as proportional
 * fields on the mat, Coolors' lesson: the palette is the interface. Fields
 * are square-cornered like Munsell chips, carry no text but their ratio
 * (set in the field's own readable ink), and morph old chord → new chord
 * through the registered --c60/--cBtm/--c30/--c10 properties (the one
 * signature motion). Where @property transitions don't run, the change is
 * instant — never blocked, never theatrical. Since 2.2 the trousers' own
 * colour joins as a fourth field whenever a layer takes the anchor, so
 * every major colour the figure wears is accounted for on the mat.
 */
export function ChordFields({ look }: { look: Look }) {
  const parts = ratioParts(look);
  const byKey = (key: string) => parts.find((part) => part.key === key)?.piece.hex;
  const vars = {
    "--c60": byKey("60"),
    "--cBtm": byKey("btm") ?? look.pieces.bottom.hex,
    "--c30": byKey("30"),
    "--c10": byKey("10"),
  } as CSSProperties;
  const backgrounds: Record<string, string> = {
    "60": "var(--c60)",
    btm: "var(--cBtm)",
    "30": "var(--c30)",
    "10": "var(--c10)",
  };

  return (
    <div
      className="rounded-lg bg-mat p-2.5 sm:p-3"
      style={{ ...vars, viewTransitionName: "chord-hero" }}
    >
      <div className="flex h-52 gap-1 sm:h-60">
        {parts.map((part) => (
          <div
            key={part.key}
            className="chord-field relative rounded-[2px]"
            style={{ flexGrow: part.grow, background: backgrounds[part.key] }}
          >
            <span
              className="absolute bottom-1.5 left-2 font-mono text-[11px]"
              style={{ color: textOn(part.piece.hex) }}
            >
              {part.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** The pieces in dressing order — one numbered list (GarmentStack and
 *  "Dress in order" were the same information typeset twice). */
export function PiecesList({ look }: { look: Look }) {
  const rows: Array<{ role: string; piece: Piece }> = [
    { role: "Bottom", piece: look.pieces.bottom },
    { role: "Top", piece: look.pieces.top },
    ...(look.pieces.layer && look.layerKind !== "none"
      ? [{ role: "Layer", piece: look.pieces.layer }]
      : []),
    { role: "Shoes", piece: look.pieces.shoes },
    ...(look.pieces.accessory
      ? [{ role: "Finishing", piece: look.pieces.accessory }]
      : []),
  ];

  return (
    <ol className="divide-y divide-border">
      {rows.map((row, i) => (
        <li key={row.role} className="flex items-center gap-3 py-3">
          <span className="w-6 shrink-0 font-mono text-xs text-subtle">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span
            className="size-10 shrink-0 rounded-[4px] shadow-[var(--shadow-border)]"
            style={{ background: row.piece.hex }}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <p className="font-display text-[17px] leading-tight text-fg">
              {row.piece.colorName}
            </p>
            <p className="truncate text-[13px] text-muted">
              {row.piece.garment} · {row.role.toLowerCase()}
            </p>
          </div>
          <div className="shrink-0 text-right font-mono text-[11px] leading-relaxed text-subtle">
            <p>{munsellNotation(row.piece.hex)}</p>
            <p>{row.piece.hex}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Why it works — present but collapsed; the morning doesn't read essays. */
export function WhyBlock({ look }: { look: Look }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="border-t border-border pt-4">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-sm font-medium text-fg">Why it works</span>
        <ChevronDown
          className={cn("size-4 text-muted transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      {open ? (
        <div className="mt-3 flex flex-col gap-3">
          <p className="text-[15px] leading-relaxed text-fg">{look.theory}</p>
          <p className="text-[15px] leading-relaxed text-muted">{look.wear}</p>
          {look.ruleTitles && look.ruleTitles.length ? (
            <ul className="flex flex-wrap gap-1.5">
              {look.ruleTitles.map((title) => (
                <li
                  key={title}
                  className="rounded-full bg-surface-2 px-2.5 py-1 text-xs text-muted"
                >
                  {title}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
