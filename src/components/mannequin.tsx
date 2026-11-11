import { mixHex } from "@/lib/color/convert";
import type { Look } from "@/lib/color/types";

function shade(hex: string, t: number) {
  // Neutral mixes only (2.0): the figure must not import a warm tint of its
  // own — the chrome is achromatic, the clothes keep the hue.
  return mixHex(hex, t >= 0 ? "#ffffff" : "#000000", Math.min(0.42, Math.abs(t)));
}

function garmentKind(name: string, fallback: "sneaker" | "loafer" | "boot" | "pump") {
  const n = name.toLowerCase();
  if (n.includes("boot") || n.includes("chelsea") || n.includes("chukka")) return "boot";
  if (n.includes("pump") || n.includes("heel") || n.includes("sling") || n.includes("sandal"))
    return "pump";
  if (n.includes("sneaker") || n.includes("canvas")) return "sneaker";
  if (n.includes("loafer") || n.includes("oxford") || n.includes("derby") || n.includes("monk"))
    return "loafer";
  return fallback;
}

function Shoe({
  x,
  hex,
  kind,
  flip,
}: {
  x: number;
  hex: string;
  kind: ReturnType<typeof garmentKind>;
  flip?: boolean;
}) {
  const dark = shade(hex, -0.28);
  const lite = shade(hex, 0.12);
  const t = flip ? `translate(${x} 0) scale(-1 1) translate(-28 0)` : `translate(${x} 0)`;
  if (kind === "boot") {
    return (
      <g transform={t}>
        <path d="M8 478 h40 v28 c0 8-6 14-18 14 h-8 c-10 0-16-4-16-12 z" fill={hex} />
        <path d="M8 478 h40 v10 h-40 z" fill={dark} />
        <path d="M10 488 h10 v6 h-10 z" fill={lite} opacity="0.5" />
      </g>
    );
  }
  if (kind === "pump") {
    return (
      <g transform={t}>
        <path d="M10 498 c18-10 36-8 44 2 c2 4-2 8-8 8 h-28 c-10 0-14-4-8-10 z" fill={hex} />
        <path d="M12 504 h8 v10 c0 2-2 3-4 3 s-4-1-4-3 z" fill={dark} />
      </g>
    );
  }
  if (kind === "sneaker") {
    return (
      <g transform={t}>
        <path d="M6 492 h44 c6 0 10 4 10 8 v6 c0 4-4 6-10 6 h-36 c-8 0-14-4-14-10 0-6 4-10 6-10 z" fill={hex} />
        <path d="M8 502 h40" stroke={lite} strokeWidth="1.4" />
        <path d="M6 492 h16 v10 h-16 z" fill={dark} />
      </g>
    );
  }
  return (
    <g transform={t}>
      <path d="M8 494 h40 c8 2 12 6 12 10 0 4-4 6-12 6 h-32 c-10 0-16-4-16-9 0-5 4-8 8-7 z" fill={hex} />
      <path d="M10 500 h28" stroke={dark} strokeWidth="1.2" />
    </g>
  );
}

export function Mannequin({ look, className }: { look: Look; className?: string }) {
  const top = look.pieces.top.hex;
  const bottom = look.pieces.bottom.hex;
  const layer = look.pieces.layer?.hex;
  const shoes = look.pieces.shoes.hex;
  const hasLayer = Boolean(layer) && look.layerKind !== "none";
  const longCoat = look.layerKind === "coat";
  const knit = look.layerKind === "knit";
  const skirt = look.bottomKind === "skirt";
  const wide = look.bottomKind === "wide";
  const female = look.gender === "women";
  const skin = "var(--color-mannequin)";
  const hair = female ? "#2a221c" : "#1a1814";
  const shoeKind = garmentKind(look.pieces.shoes.garment, female ? "pump" : "loafer");
  const topDark = shade(top, -0.18);
  const bottomDark = shade(bottom, -0.2);
  const layerDark = layer ? shade(layer, -0.22) : topDark;
  const layerLite = layer ? shade(layer, 0.14) : top;

  const shoulder = female ? 54 : 62;
  const waist = female ? 38 : 48;
  const hip = female ? 58 : 52;
  const cx = 100;

  const pantTop = hasLayer && longCoat ? 268 : 250;
  const coatHem = longCoat ? 390 : knit ? 268 : 300;

  return (
    <svg
      viewBox="12 8 176 520"
      className={className}
      role="img"
      aria-label={`${look.name} on a figure`}
    >
      <ellipse cx="100" cy="516" rx="52" ry="8" fill="currentColor" opacity="0.08" />

      {/* legs / skirt */}
      {skirt ? (
        <path
          d={`M${cx - waist} 248
             C ${cx - hip - 6} 300, ${cx - hip - 14} 360, ${cx - 62} 418
             L ${cx + 62} 418
             C ${cx + hip + 14} 360, ${cx + hip + 6} 300, ${cx + waist} 248 Z`}
          fill={bottom}
        />
      ) : (
        <g>
          <path
            d={`M${cx - waist} ${pantTop}
               L ${cx - (wide ? 28 : 18)} ${pantTop}
               L ${cx - (wide ? 34 : 16)} 494
               L ${cx - (wide ? 54 : 36)} 494
               L ${cx - hip} 300
               Z`}
            fill={bottom}
          />
          <path
            d={`M${cx + waist} ${pantTop}
               L ${cx + (wide ? 28 : 18)} ${pantTop}
               L ${cx + (wide ? 34 : 16)} 494
               L ${cx + (wide ? 54 : 36)} 494
               L ${cx + hip} 300
               Z`}
            fill={bottomDark}
          />
          <path
            d={`M${cx - 8} ${pantTop} L ${cx + 8} ${pantTop} L ${cx + 4} 310 L ${cx - 4} 310 Z`}
            fill={shade(bottom, -0.08)}
          />
        </g>
      )}

      {skirt ? (
        <g>
          <path d={`M${cx - 22} 418 L ${cx - 16} 494 L ${cx - 34} 494 L ${cx - 42} 418 Z`} fill={skin} />
          <path d={`M${cx + 22} 418 L ${cx + 16} 494 L ${cx + 34} 494 L ${cx + 42} 418 Z`} fill={skin} />
        </g>
      ) : null}

      {/* shirt / torso */}
      <path
        d={`M${cx - shoulder} 118
           C ${cx - shoulder - 4} 150, ${cx - waist - 4} 200, ${cx - waist} 252
           L ${cx + waist} 252
           C ${cx + waist + 4} 200, ${cx + shoulder + 4} 150, ${cx + shoulder} 118
           L ${cx + 16} 108 L ${cx} 128 L ${cx - 16} 108 Z`}
        fill={top}
      />
      <path
        d={`M${cx - 16} 108 L ${cx} 128 L ${cx + 16} 108 L ${cx + 10} 118 L ${cx} 132 L ${cx - 10} 118 Z`}
        fill={topDark}
      />

      {/* sleeves as shirt if no layer */}
      {!hasLayer ? (
        <g>
          <path
            d={`M${cx - shoulder} 118 C ${cx - 88} 150, ${cx - 92} 210, ${cx - 78} 268
               L ${cx - 62} 268 C ${cx - 70} 210, ${cx - 64} 160, ${cx - 48} 130 Z`}
            fill={topDark}
          />
          <path
            d={`M${cx + shoulder} 118 C ${cx + 88} 150, ${cx + 92} 210, ${cx + 78} 268
               L ${cx + 62} 268 C ${cx + 70} 210, ${cx + 64} 160, ${cx + 48} 130 Z`}
            fill={shade(top, -0.08)}
          />
        </g>
      ) : null}

      {/* layer */}
      {hasLayer && layer ? (
        <g>
          <path
            d={`M${cx - shoulder - 6} 112
               C ${cx - shoulder - 10} 160, ${cx - hip - 8} 230, ${cx - hip - (longCoat ? 8 : 2)} ${coatHem}
               L ${cx - 10} ${coatHem}
               L ${cx} 140
               L ${cx + 10} ${coatHem}
               L ${cx + hip + (longCoat ? 8 : 2)} ${coatHem}
               C ${cx + hip + 8} 230, ${cx + shoulder + 10} 160, ${cx + shoulder + 6} 112
               L ${cx + 18} 108 L ${cx} 148 L ${cx - 18} 108 Z`}
            fill={layer}
          />
          <path
            d={`M${cx - 18} 108 L ${cx} 148 L ${cx - 6} 200 L ${cx - 22} 118 Z`}
            fill={layerLite}
          />
          <path
            d={`M${cx + 18} 108 L ${cx} 148 L ${cx + 6} 200 L ${cx + 22} 118 Z`}
            fill={layerDark}
          />
          <path
            d={`M${cx - shoulder - 6} 112 C ${cx - 96} 150, ${cx - 100} 220, ${cx - 84} ${knit ? 250 : 280}
               L ${cx - 66} ${knit ? 250 : 280} C ${cx - 74} 210, ${cx - 70} 150, ${cx - 50} 124 Z`}
            fill={layerDark}
          />
          <path
            d={`M${cx + shoulder + 6} 112 C ${cx + 96} 150, ${cx + 100} 220, ${cx + 84} ${knit ? 250 : 280}
               L ${cx + 66} ${knit ? 250 : 280} C ${cx + 74} 210, ${cx + 70} 150, ${cx + 50} 124 Z`}
            fill={shade(layer, -0.1)}
          />
        </g>
      ) : null}

      {/* neck + head */}
      <path d={`M${cx - 10} 86 L ${cx + 10} 86 L ${cx + 12} 108 L ${cx - 12} 108 Z`} fill={skin} />
      <ellipse cx={cx} cy="62" rx={female ? 24 : 26} ry={female ? 28 : 30} fill={skin} />

      {female ? (
        <path
          d={`M${cx - 24} 54 C ${cx - 34} 20, ${cx - 10} 12, ${cx} 18
             C ${cx + 10} 12, ${cx + 34} 20, ${cx + 24} 54
             C ${cx + 38} 80, ${cx + 36} 140, ${cx + 28} 168
             L ${cx + 22} 166 C ${cx + 28} 130, ${cx + 22} 80, ${cx + 16} 70
             L ${cx - 16} 70 C ${cx - 22} 80, ${cx - 28} 130, ${cx - 22} 166
             L ${cx - 28} 168 C ${cx - 36} 140, ${cx - 38} 80, ${cx - 24} 54 Z`}
          fill={hair}
        />
      ) : (
        <path
          d={`M${cx - 26} 58 C ${cx - 28} 22, ${cx - 8} 18, ${cx} 20
             C ${cx + 8} 18, ${cx + 28} 22, ${cx + 26} 58
             C ${cx + 24} 48, ${cx} 44, ${cx - 24} 48 Z`}
          fill={hair}
        />
      )}

      {/* hands */}
      <ellipse cx={hasLayer ? 22 : 28} cy={knit ? 252 : 272} rx="7" ry="9" fill={skin} />
      <ellipse cx={hasLayer ? 178 : 172} cy={knit ? 252 : 272} rx="7" ry="9" fill={skin} />

      <Shoe x={wide ? 38 : 48} hex={shoes} kind={shoeKind} />
      <Shoe x={wide ? 134 : 124} hex={shade(shoes, -0.12)} kind={shoeKind} />
    </svg>
  );
}

export function GarmentStack({ look }: { look: Look }) {
  const items = [
    look.pieces.layer && look.layerKind !== "none"
      ? { label: "Layer", piece: look.pieces.layer, shape: look.layerKind }
      : null,
    { label: "Top", piece: look.pieces.top, shape: "top" as const },
    { label: "Bottom", piece: look.pieces.bottom, shape: look.bottomKind },
    { label: "Shoes", piece: look.pieces.shoes, shape: "shoes" as const },
  ].filter(Boolean) as Array<{
    label: string;
    piece: { hex: string; colorName: string; garment: string };
    shape: string;
  }>;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl bg-surface px-4 py-4 shadow-[var(--shadow-border)]"
        >
          <div
            className="mb-3 flex h-16 items-end justify-center rounded-lg"
            style={{ background: shade(item.piece.hex, -0.45) }}
          >
            <MiniGarment hex={item.piece.hex} shape={item.shape} />
          </div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">
            {item.label}
          </p>
          <p className="mt-1 text-sm leading-snug text-fg">{item.piece.colorName}</p>
          <p className="mt-0.5 text-xs leading-snug text-muted">{item.piece.garment}</p>
        </div>
      ))}
    </div>
  );
}

function MiniGarment({ hex, shape }: { hex: string; shape: string }) {
  const dark = shade(hex, -0.2);
  if (shape === "coat" || shape === "blazer" || shape === "jacket" || shape === "knit") {
    return (
      <svg viewBox="0 0 64 64" className="h-12 w-12">
        <path d="M12 10 L32 22 L52 10 L58 18 L48 58 H16 L6 18 Z" fill={hex} />
        <path d="M32 22 L28 58 H16 L22 18 Z" fill={dark} />
      </svg>
    );
  }
  if (shape === "skirt") {
    return (
      <svg viewBox="0 0 64 64" className="h-12 w-12">
        <path d="M22 8 H42 L54 56 H10 Z" fill={hex} />
        <path d="M32 8 V56" stroke={dark} strokeWidth="1.5" />
      </svg>
    );
  }
  if (shape === "shoes") {
    return (
      <svg viewBox="0 0 64 64" className="h-12 w-12">
        <path d="M8 36 H40 C52 36 56 42 56 48 C56 54 50 56 40 56 H16 C8 56 6 50 6 46 C6 40 8 36 8 36 Z" fill={hex} />
        <path d="M8 36 H22 V46 H8 Z" fill={dark} />
      </svg>
    );
  }
  if (shape === "wide") {
    return (
      <svg viewBox="0 0 64 64" className="h-12 w-12">
        <path d="M18 8 H30 L26 56 H8 Z" fill={hex} />
        <path d="M34 8 H46 L56 56 H38 Z" fill={dark} />
      </svg>
    );
  }
  if (shape === "top") {
    return (
      <svg viewBox="0 0 64 64" className="h-12 w-12">
        <path d="M16 12 L32 22 L48 12 L56 20 L48 56 H16 L8 20 Z" fill={hex} />
        <path d="M32 22 L28 56 H16 L20 18 Z" fill={dark} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" className="h-11 w-11">
      <path d="M20 8 H30 L28 56 H14 Z" fill={hex} />
      <path d="M34 8 H44 L50 56 H36 Z" fill={dark} />
    </svg>
  );
}
