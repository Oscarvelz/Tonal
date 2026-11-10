# TONAL — project instructions (Oscar's fleet)

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
Theory page. The palettes.ts transcription wave is QUEUED: it waits on
Oscar buying one fan lineage (TCI or NDU — never mix), and nobody buys
anything on his behalf.
