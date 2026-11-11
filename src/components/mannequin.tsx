import type { ReactNode } from "react";
import { mixHex } from "@/lib/color/convert";
import type { Look } from "@/lib/color/types";

/**
 * The Figure (2.1) — a ghost-mannequin dress form wearing the look.
 *
 * Redrawn from the research brief (redesign/brief-figure-research.md):
 * a faceless, hairless tailor's form on an 8.5-head grid, garments drawn
 * as body-shaped technical flats. Colour truth is a hard rule — at least
 * three quarters of every garment is the exact piece hex; one shadow
 * tone for under-planes only, construction carried by lines, never a
 * whole side darker (the old figure's two-tone trouser leg invented a
 * colour the chord never promised).
 */

function shade(hex: string, t: number) {
  // Neutral mixes only: the figure must not import a tint of its own —
  // the chrome is achromatic, the clothes keep the hue.
  return mixHex(hex, t >= 0 ? "#ffffff" : "#000000", Math.min(0.42, Math.abs(t)));
}

type ShoeKind = "boot" | "sneaker" | "sandal" | "pump" | "oxford" | "loafer";

function shoeKind(name: string, female: boolean): ShoeKind {
  const n = name.toLowerCase();
  if (n.includes("boot") || n.includes("chelsea") || n.includes("chukka")) return "boot";
  if (n.includes("sandal") || n.includes("mule") || n.includes("slide")) return "sandal";
  if (n.includes("sneaker") || n.includes("canvas") || n.includes("trainer")) return "sneaker";
  if (n.includes("oxford") || n.includes("derby") || n.includes("monk") || n.includes("brogue"))
    return "oxford";
  if (n.includes("pump") || n.includes("heel") || n.includes("sling"))
    // A man's opera pump is a patent loafer, never a heel.
    return female ? "pump" : "loafer";
  return "loafer";
}

function Shoe({ hex, kind, form }: { hex: string; kind: ShoeKind; form: string }) {
  const dark = shade(hex, -0.3);
  const line = { stroke: dark, strokeWidth: 1.3, fill: "none", opacity: 0.55 } as const;
  // Local frame: origin at the shoe's centre on the floor, y up-negative.
  if (kind === "boot") {
    // The shaft stays inside the trouser hem's span — only the foot
    // emerges, as a worn boot actually reads.
    return (
      <g>
        <path
          d="M-11 0 L-11 -56 C-11 -61 11 -61 11 -56 L11 -14 C17 -11 20 -6 20 -1 L20 0 Z"
          fill={hex}
          data-region="shoes"
        />
        <path d="M-11 -5 L20 -5 L20 0 L-11 0 Z" fill={dark} />
        <path d="M-11 -15 L11 -15" {...line} />
      </g>
    );
  }
  if (kind === "sandal") {
    return (
      <g>
        <path
          d="M-17 -2 L-17 -7 C-10 -12 10 -12 17 -7 L17 -2 Z"
          fill={form}
        />
        <path d="M-20 -3 L20 -3 L20 0 L-20 0 Z" fill={hex} data-region="shoes" />
        <path d="M-13 -8 L13 -10 M-11 -4 L15 -5" stroke={hex} strokeWidth="3.4" fill="none" />
      </g>
    );
  }
  if (kind === "pump") {
    return (
      <g>
        <path
          d="M-20 0 L-20 -5 C-13 -15 6 -18 15 -12 C20 -9 22 -4 22 0 Z"
          fill={hex}
          data-region="shoes"
        />
        <path d="M11 -9 L17 -9 L16 0 L12.5 0 Z" fill={dark} />
      </g>
    );
  }
  if (kind === "sneaker") {
    return (
      <g>
        <path
          d="M-22 -8 L22 -8 L22 0 L-22 0 Z"
          fill={shade(hex, -0.35)}
        />
        <path
          d="M-22 -8 C-22 -19 -12 -24 0 -24 C14 -24 22 -17 22 -8 Z"
          fill={hex}
          data-region="shoes"
        />
        <path d="M-16 -15 C-8 -19 6 -19 14 -14" {...line} />
      </g>
    );
  }
  // loafer + oxford share a body; the oxford gets lace ticks.
  return (
    <g>
      <path d="M-21 -5 L21 -5 L21 0 L-21 0 Z" fill={dark} />
      <path
        d="M-21 -5 L-21 -11 C-21 -20 -12 -25 -2 -25 L6 -25 C16 -25 21 -18 21 -10 L21 -5 Z"
        fill={hex}
        data-region="shoes"
      />
      <path d="M-14 -16 C-6 -20 6 -20 14 -16" {...line} />
      {kind === "oxford" ? (
        <path d="M-5 -20 L3 -18 M-5 -16 L3 -14 M-5 -12 L3 -10" {...line} />
      ) : null}
    </g>
  );
}

export function Mannequin({ look, className }: { look: Look; className?: string }) {
  const topHex = look.pieces.top.hex;
  const bottomHex = look.pieces.bottom.hex;
  const layerHex = look.pieces.layer?.hex;
  const shoeHex = look.pieces.shoes.hex;
  const hasLayer = Boolean(layerHex) && look.layerKind !== "none";
  const female = look.gender === "women";
  const form = "var(--color-mannequin)";

  const sKind = shoeKind(look.pieces.shoes.garment, female);
  const topName = look.pieces.top.garment.toLowerCase();
  const isShirt = /shirt|polo|oxford|blouse/.test(topName);
  const shortSleeve = /tee|polo|short/.test(topName);
  const cardigan =
    hasLayer && look.layerKind === "knit" && /cardigan/.test(look.pieces.layer!.garment.toLowerCase());

  // The grid (240 × 640, 8.5 heads). Gender is three width numbers.
  const CX = 120;
  const sh = female ? 41 : 47; // shoulder half-width
  const wa = female ? 25 : 31; // waist half-width
  const hip = female ? 41 : 37; // hip half-width
  const nk = female ? 8 : 9; // neck half-width

  const line = (hex: string) =>
    ({ stroke: shade(hex, -0.3), strokeWidth: 1.25, fill: "none", opacity: 0.5 }) as const;

  // Mirrored half: draw the left, flip for the right.
  const Mirror = ({ children }: { children: ReactNode }) => (
    <>
      {children}
      <g transform="translate(240 0) scale(-1 1)">{children}</g>
    </>
  );

  const formArm = (
    <path
      d={`M ${CX - sh} 126
          C ${CX - sh - 7} 190, ${CX - sh - 12} 245, ${CX - sh - 13} 292
          L ${CX - sh - 1} 297
          C ${CX - sh} 235, ${CX - wa - 1} 185, ${CX - wa + 3} 148 Z`}
      fill={form}
    />
  );
  const formHand = (
    <path
      d={`M ${CX - sh - 13} 292 L ${CX - sh + 1} 292 L ${CX - sh} 316
          C ${CX - sh - 0.5} 327, ${CX - sh - 11.5} 327, ${CX - sh - 12} 316 Z`}
      fill={form}
    />
  );
  const formLeg = (
    <path
      d={`M ${CX - 24} 300 L ${CX - 3} 300 L ${CX - 25} 604 L ${CX - 43} 604 Z`}
      fill={form}
    />
  );

  const sleeve = (hex: string, short: boolean) =>
    short ? (
      <path
        d={`M ${CX - sh - 2} 118
            C ${CX - sh - 9} 145, ${CX - sh - 11} 172, ${CX - sh - 11} 196
            L ${CX - wa + 2} 178
            C ${CX - wa + 1} 158, ${CX - wa + 3} 136, ${CX - sh + 4} 124 Z`}
        fill={hex}
      />
    ) : (
      <path
        d={`M ${CX - sh - 2} 118
            C ${CX - sh - 9} 175, ${CX - sh - 12} 240, ${CX - sh - 13} 290
            L ${CX - sh + 2} 295
            C ${CX - sh + 1} 235, ${CX - wa} 180, ${CX - wa + 3} 140 Z`}
        fill={hex}
      />
    );

  const topTorso = (
    <path
      d={`M ${CX - sh} 120
          C ${CX - sh - 3} 175, ${CX - wa - 3} 205, ${CX - wa - 2} 250
          L ${CX + wa + 2} 250
          C ${CX + wa + 3} 205, ${CX + sh + 3} 175, ${CX + sh} 120
          L ${CX + nk + 2} 108 L ${CX} 120 L ${CX - nk - 2} 108 Z`}
      fill={topHex}
      data-region="top"
    />
  );

  const bottomPart = (() => {
    const waistband = (
      <>
        <path
          d={`M ${CX - hip - 1} 226 L ${CX + hip + 1} 226 L ${CX + hip + 1} 239 L ${CX - hip - 1} 239 Z`}
          fill={bottomHex}
        />
        <path d={`M ${CX} 241 L ${CX} 255`} {...line(bottomHex)} />
        <circle cx={CX} cy={232.5} r={2} fill={shade(bottomHex, -0.35)} />
      </>
    );
    if (look.bottomKind === "skirt") {
      return (
        <>
          <path
            d={`M ${CX - wa - 1} 230 L ${CX + wa + 1} 230 L ${CX + 58} 458
                C ${CX + 30} 467, ${CX - 30} 467, ${CX - 58} 458 Z`}
            fill={bottomHex}
            data-region="bottom"
          />
          <path d={`M ${CX - 52} 448 L ${CX + 52} 448`} {...line(bottomHex)} />
          <path d={`M ${CX} 246 L ${CX} 450`} {...line(bottomHex)} opacity={0.3} />
          {waistband}
        </>
      );
    }
    if (look.bottomKind === "shorts") {
      const leg = (
        <>
          <path
            d={`M ${CX - hip - 1} 232 L ${CX - 2} 232 L ${CX - 2} 312
                L ${CX - 18} 418 L ${CX - 47} 418 L ${CX - hip - 1} 320 Z`}
            fill={bottomHex}
            data-region="bottom"
          />
          <path d={`M ${CX - 45} 408 L ${CX - 20} 408`} {...line(bottomHex)} />
        </>
      );
      return (
        <>
          <Mirror>{leg}</Mirror>
          {waistband}
        </>
      );
    }
    const wide = look.bottomKind === "wide";
    const leg = (
      <>
        <path
          d={
            wide
              ? `M ${CX - hip - 2} 232 L ${CX - 3} 232 L ${CX - 3} 312
                   L ${CX - 4} 596 L ${CX - 56} 596 L ${CX - hip - 2} 320 Z`
              : `M ${CX - hip - 1} 232 L ${CX - 2} 232 L ${CX - 2} 310
                   L ${CX - 21} 600 L ${CX - 47} 600 L ${CX - hip - 1} 320 Z`
          }
          fill={bottomHex}
          data-region="bottom"
        />
        <path
          d={`M ${CX - 34} 386 L ${CX - 34} 590`}
          {...line(bottomHex)}
          opacity={0.32}
        />
      </>
    );
    return (
      <>
        <Mirror>{leg}</Mirror>
        {waistband}
      </>
    );
  })();

  const layerPart = (() => {
    if (!hasLayer || !layerHex) return null;
    const kind = look.layerKind;
    const sleeves = <Mirror>{sleeve(layerHex, false)}</Mirror>;
    const cuff = (
      <Mirror>
        <path d={`M ${CX - sh - 12} 282 L ${CX - sh + 1} 286`} {...line(layerHex)} />
      </Mirror>
    );
    if (kind === "blazer") {
      const panel = (
        <>
          <path
            d={`M ${CX - sh - 3} 118
                C ${CX - sh - 5} 180, ${CX - hip - 5} 245, ${CX - hip - 4} 300
                L ${CX - 14} 300
                C ${CX - 10} 272, ${CX - 6} 252, ${CX - 4} 235
                L ${CX - 17} 160 L ${CX - nk - 1} 108 Z`}
            fill={layerHex}
            data-region="layer"
          />
          <path
            d={`M ${CX - nk - 1} 108 L ${CX - 21} 154 L ${CX - 5} 232 L ${CX - 12} 174 Z`}
            fill={shade(layerHex, 0.1)}
          />
          <path d={`M ${CX - nk - 1} 108 L ${CX - 21} 154`} {...line(layerHex)} />
          <path d={`M ${CX - hip + 3} 274 L ${CX - hip + 19} 274`} {...line(layerHex)} />
        </>
      );
      return (
        <>
          {sleeves}
          <Mirror>{panel}</Mirror>
          <circle cx={CX - 3.5} cy={235} r={2.4} fill={shade(layerHex, -0.35)} />
          {cuff}
        </>
      );
    }
    if (kind === "coat") {
      return (
        <>
          {sleeves}
          <path
            d={`M ${CX - sh - 3} 118
                C ${CX - sh - 5} 200, ${CX - hip - 6} 300, ${CX - hip - 6} 398
                L ${CX + hip + 6} 398
                C ${CX + hip + 6} 300, ${CX + sh + 5} 200, ${CX + sh + 3} 118
                L ${CX + nk + 1} 110 L ${CX - nk - 1} 110 Z`}
            fill={layerHex}
            data-region="layer"
          />
          <path
            d={`M ${CX - nk} 106 L ${CX + nk} 106 L ${CX} 148 Z`}
            fill={topHex}
          />
          <Mirror>
            <path
              d={`M ${CX - nk - 1} 108 L ${CX - 19} 152 L ${CX - 7} 196 L ${CX - 10} 130 Z`}
              fill={shade(layerHex, 0.1)}
            />
          </Mirror>
          <path d={`M ${CX} 150 L ${CX} 390`} {...line(layerHex)} />
          {[238, 298, 358].map((y) => (
            <circle key={y} cx={CX} cy={y} r={2.2} fill={shade(layerHex, -0.35)} />
          ))}
          {cuff}
        </>
      );
    }
    if (kind === "knit" && cardigan) {
      const panel = (
        <path
          d={`M ${CX - sh - 3} 118
              C ${CX - sh - 5} 180, ${CX - hip - 5} 245, ${CX - hip - 4} 300
              L ${CX - 10} 300 L ${CX - 8} 112 L ${CX - nk - 1} 108 Z`}
          fill={layerHex}
          data-region="layer"
        />
      );
      return (
        <>
          {sleeves}
          <Mirror>{panel}</Mirror>
          {[150, 182, 214, 246, 278].map((y) => (
            <circle key={y} cx={CX - 9} cy={y} r={1.7} fill={shade(layerHex, -0.32)} />
          ))}
          <Mirror>
            <path d={`M ${CX - hip - 4} 288 L ${CX - 11} 288`} {...line(layerHex)} />
          </Mirror>
          {cuff}
        </>
      );
    }
    // jacket + plain knit: closed body, band details only.
    const isKnit = kind === "knit";
    return (
      <>
        {sleeves}
        <path
          d={`M ${CX - sh - 3} 118
              C ${CX - sh - 5} 180, ${CX - hip - 5} 245, ${CX - hip - 4} 300
              L ${CX + hip + 4} 300
              C ${CX + hip + 5} 245, ${CX + sh + 5} 180, ${CX + sh + 3} 118
              L ${CX + nk + 1} 110 L ${CX - nk - 1} 110 Z`}
          fill={layerHex}
          data-region="layer"
        />
        {isKnit ? (
          <path
            d={`M ${CX - nk - 3} 110 C ${CX - 4} 122, ${CX + 4} 122, ${CX + nk + 3} 110`}
            stroke={shade(layerHex, -0.2)}
            strokeWidth={3.4}
            fill="none"
          />
        ) : (
          <>
            <path
              d={`M ${CX - nk - 5} 104 L ${CX + nk + 5} 104 L ${CX + nk + 3} 120 L ${CX - nk - 3} 120 Z`}
              fill={shade(layerHex, -0.15)}
            />
            <path d={`M ${CX} 122 L ${CX} 290`} {...line(layerHex)} />
          </>
        )}
        <Mirror>
          <path d={`M ${CX - hip - 4} 288 L ${CX - 12} 288`} {...line(layerHex)} />
        </Mirror>
        {cuff}
      </>
    );
  })();

  const belt =
    !hasLayer && look.pieces.accessory && /belt/i.test(look.pieces.accessory.garment) ? (
      <>
        <path
          d={`M ${CX - wa - 2} 233 L ${CX + wa + 2} 233 L ${CX + wa + 2} 241 L ${CX - wa - 2} 241 Z`}
          fill={look.pieces.accessory.hex}
          data-region="accessory"
        />
        <rect
          x={CX - 4}
          y={234.5}
          width={8}
          height={5}
          fill="none"
          stroke={shade(look.pieces.accessory.hex, -0.4)}
          strokeWidth={1.1}
        />
      </>
    ) : null;

  return (
    <svg
      viewBox="0 0 240 640"
      className={className}
      role="img"
      aria-label={`${look.name} on a figure`}
    >
      <ellipse cx={CX} cy={628} rx={74} ry={7} fill="#000000" opacity={0.1} />

      {/* the form: head, neck, arms, legs — a tailor's dummy, no person */}
      <ellipse cx={CX} cy={52} rx={25} ry={33} fill={form} />
      <path
        d={`M ${CX - nk} 82 L ${CX + nk} 82 L ${CX + nk + 1} 114 L ${CX - nk - 1} 114 Z`}
        fill={form}
      />
      <Mirror>{formArm}</Mirror>
      <Mirror>{formLeg}</Mirror>

      {/* shoes first: hems and shafts overlap them, never the reverse */}
      <g transform={`translate(${CX - 34} 626)`}>
        <Shoe hex={shoeHex} kind={sKind} form={form} />
      </g>
      <g transform={`translate(${CX + 34} 626) scale(-1 1)`}>
        <Shoe hex={shoeHex} kind={sKind} form={form} />
      </g>

      {/* top, with its sleeves when it is the outer garment */}
      {!hasLayer ? <Mirror>{sleeve(topHex, shortSleeve)}</Mirror> : null}
      {topTorso}
      {isShirt && !hasLayer ? (
        <>
          <Mirror>
            <path
              d={`M ${CX - nk - 1} 106 L ${CX - 1} 124 L ${CX - 19} 132 L ${CX - 21} 114 Z`}
              fill={shade(topHex, -0.08)}
            />
          </Mirror>
          <path d={`M ${CX} 128 L ${CX} 246`} {...line(topHex)} />
          {[168, 198, 228].map((y) => (
            <circle key={y} cx={CX} cy={y} r={1.6} fill={shade(topHex, -0.32)} />
          ))}
        </>
      ) : null}
      {isShirt && hasLayer ? (
        <Mirror>
          <path
            d={`M ${CX - nk - 1} 106 L ${CX - 1} 122 L ${CX - 16} 128 L ${CX - 18} 112 Z`}
            fill={shade(topHex, -0.08)}
          />
        </Mirror>
      ) : null}
      {!isShirt ? (
        <path
          d={`M ${CX - nk - 2} 109 C ${CX - 4} 120, ${CX + 4} 120, ${CX + nk + 2} 109`}
          stroke={shade(topHex, -0.2)}
          strokeWidth={3}
          fill="none"
        />
      ) : null}

      {/* bottom over the top's hem — a tucked read */}
      {bottomPart}

      {/* layer over everything beneath it */}
      {layerPart}
      {belt}

      {/* hands last: attached at the sleeve ends, never floating */}
      <Mirror>{formHand}</Mirror>
    </svg>
  );
}
