#!/bin/sh
set -e
# Static TONAL for GitHub Pages (docs/), fleet pattern: SPA build + postbuild
# (service-worker version/precache, 404 fallback, .nojekyll).
cd "$(dirname "$0")"
npx vite build -c vite.spa.config.ts
node scripts/postbuild.mjs
ls -la docs
