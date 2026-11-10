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
