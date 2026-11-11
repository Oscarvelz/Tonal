# MATIZ — project instructions (Oscar's fleet)

This app was created by Grok Build and adopted into Oscar's app fleet on
2026-11-10. Where `AGENTS.md` (Grok Build's sandbox contract) conflicts with
this file, THIS file wins: TONAL no longer runs in Grok's sandbox, is not
deployed to Vercel, and carries no Grok branding injector — do not restore
the preview bridge, the Grok PWA chrome (`public/__grok/` is legacy), or the
“Created with Grok” pill.

Standing fleet rules for this repo:

- The web app is a static SPA built from the Grok source: `sh build.sh`
  produces `docs/` (GitHub Pages). Never edit `docs/` by hand.
- Keep the original source intact: SPA adaptations live in `spa/`,
  `spa-public/`, `src/spa/` and `vite.spa.config.ts`. The only edits inside
  Grok's own files so far: `src/styles.css` (@source lines for the SPA root),
  `src/routes/install.tsx` (the APK now exists, so its text says so), and
  `package.json` (name/version).
- The Android shell in `android/` follows the fleet pattern (WebView over
  the live Pages site, `TonalNative` bridge, self-update from releases
  `android-N`). Its signing key never enters this repo.
- Version shows at the bottom of Settings — TONAL has no Settings screen;
  the shell version is `1.0.<versionCode>` and the web build's service-worker
  version is content-hashed by `scripts/postbuild.mjs`.

1.1 (2026-11-10): Studio answers on-device. The brief interpreter lives in
`src/lib/ai/local-look.ts` (deterministic, vocabulary-based, wired to the
color engine; looks it composes carry `source: "studio"`). Studio must not
call `generateAiLook` again — Oscar's order: no AI engine required.

1.2 (2026-11-10): color foundation waves (see COLOR-FOUNDATION.md) —
rules.ts carries Flusser's two laws + pattern rule with a wearer-contrast
model keyed to the personal season; theory.ts carries Itten's seven
contrasts + extension ratios; the diagnosis flow (three drapes) lives in
src/lib/color/diagnosis.ts + src/components/season-finder.tsx on the
Theory page.

1.3 (2026-11-10): the FREE foundation — Oscar cancelled the fan purchase
PERMANENTLY (no NDU/TCI fans, no Scaman e-books, no swatch sets, ever;
nobody buys anything). src/lib/color/munsell.ts carries the 1943 Munsell
renotation table (RIT data via the community munsell-json set) and
SEASON_REGIONS: the twelve seasons are Tonal's own boxes in Munsell
HVC space, labelled "Tonal regions, after Munsell" — never claim
SciART/TCI/NDU data anywhere. paletteSeasons() computes season
membership from palette colors; the hand-written personalSeasons lists
were removed from palettes.ts and the Palette type. Also shipped: the
ten-second face-contrast check (Theory + Refine), Closet-only
generation (closetHexes, ΔE 26), the Weather refine, per-look whyLine,
and the Miami-cloth rules (r-tee, r-shorts, r-sandals). Women use the
same regions — no second engine.

2.0 (2026-11-10): the full redesign under Oscar's creative license, after a
research-first team pass (briefs in ~/workspace/tonal-work/redesign/). The
server build is RETIRED (auth/db/preview/generate-look deleted); routes are
/, /saved, /you, /learn ONLY, and src/routeTree.gen.ts is maintained by hand
(no router plugin in the SPA build). The brain is frozen: src/lib/color/*,
local-look.ts and the store's persisted tonal-v1 slice do not change shape.
The face law: chrome chroma = 0 (Daylight/Evening stage tokens), the chord
is the hero on the mat, serif (Newsreader, self-hosted) is a voice not a
system, mono is for data, eyebrows are abolished, looks never change
themselves. Version is stamped from package.json via __TONAL_VERSION__.
