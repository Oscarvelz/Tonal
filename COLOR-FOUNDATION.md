# TONAL — color foundation (research verdict 2026-11-10; free-foundation revision, Oscar's order, 2026-11-10 evening)

The sources TONAL's color work is founded on. Methods and dimensions are
encoded in the app's own words; no book text, photos, or fan artwork is
ever copied, and the app is never marketed under the SciART™, 12
Blueprints™, or Color Me Beautiful™ names.

## What changed (superseding direction, 2026-11-10)

**The fan purchase is OFF — permanently.** No NDU or TCI fans, no Scaman
e-books, no swatch sets will be bought, ever. The 1.2 plan to transcribe
palettes from a purchased lineage is cancelled. In its place, the free
foundation below shipped as 1.3. Nothing in the app is, or claims to be,
SciART / TCI / NDU / Color Me Beautiful data.

## The free foundation (1.3, shipped)

1. **Palette source — the 1943 Munsell renotation.** Real measured color
   science: the renotation data published for study by the RIT Munsell
   Color Science Laboratory, available as sRGB hex in community sets
   (the set used here: `munsell-json`, erwinkn — hex + xyY generated from
   RIT's `real.dat`). Munsell's *A Color Notation* (1905) is public
   domain (Project Gutenberg #26054). This is color science, not a
   cloned fashion fan — that is precisely why it is usable. The full
   2,745-chip table lives in `src/lib/color/munsell.ts`; every app color
   resolves to its nearest renotation chip (hue / value / chroma).
2. **The 12 seasons are TONAL'S OWN REGIONS in Munsell space** — boxes
   defined by temperature (warm / cool / leaning), value (light / dark),
   and chroma (clear / soft), labelled honestly in the app and here:
   **"Tonal regions, after Munsell."** The boxes are the generator's
   filter (`paletteSeasons` in `munsell.ts`): the 60% must live in the
   region (or be near-neutral architecture the 30% carries), the 30%
   must not fight its temperature, neutrals must sit in its value band.
   That is what stops a Soft Summer being handed a camel coat. The boxes
   do not reproduce any fan's chips and do not need to. Validated over
   the whole catalog before shipping: no palette orphaned, none claimed
   by more than six regions, camel-dominant chords never land in a
   summer region.
3. **Color names are plain cloth names** in the spirit of the ISCC-NBS
   system (US National Bureau of Standards Circular 553, 1955 — US
   government work): navy, olive, rust — never invented marketing names.
4. **Harmony — Itten's geometry stays** (method only, no copied plates):
   the seven contrasts and the extension ratios (yellow:violet 1:3,
   orange:blue 1:2, red:green 1:1), encoded 1.2 in `theory.ts`.
5. **Flusser's two laws stay** (encoded 1.2 in `rules.ts`): (a) the
   clothes' contrast mirrors the wearer's skin↔hair/eyes contrast;
   (b) repeat a skin/hair tone near the face. Pattern rule: like
   patterns differ maximally in scale. No belt-matches-shoe matrix
   exists in Flusser — never attribute it to him. 60-30-10 and
   belt-matches-shoe are TONAL'S OWN speed habits, unattributed.
6. **Women = same boxes, different wardrobe.** No second engine, no
   separate women's color theory — seasons are not gendered. What
   changes is the grammar: near-the-face includes lip and blush (a red
   mouth is a red garment — already a rule); metal follows temperature
   and depth (cool coloring → silver, white gold, platinum; warm →
   yellow gold; neutral can wear either if the depth is right; Springs
   read lighter gold, Autumns deeper gold); jewellery is the 10% and
   must agree with the shoe; skirt, dress and trouser are the same
   color role.

## Product doctrine (adopted with the free foundation)

A more accurate palette does not shorten the morning — fewer legal
choices do. In leverage order, all shipped 1.3:

1. **A face-contrast check as the fast front door** (`contrast-check.tsx`
   on Theory), ahead of the drapes: hair against skin — high, medium,
   low. Ten seconds, any gender, any skin tone. The drapes stay the
   deeper test, with the honest warning: a phone selfie is a bad season
   test; daylight and cloth next to the face are the real test; screens
   shift color (Albers' one useful warning).
2. **Dress from what the user owns:** with Closet mode on, the generator
   refuses colors not in the Closet (a palette's 60% and 30% must sit
   within ΔE 26 of a held look's pieces).
3. **Two questions, then stop:** occasion and weather (the Weather
   refine drives the season). One look. Hold it.
4. **One temperature and one leather:** warm cloth with brown, cool
   dark cloth with black; watch, belt and bag join that leather; for
   women, the metal joins the same temperature.
5. **Say why in one line:** every generated look carries `whyLine` —
   "Navy, ivory, cognac — the cloth is warm, and your face takes the big
   value jump."
6. **Modern Miami clothes** (tees, shorts, sandals, sneakers) have no
   canonical manual — they are Tonal's own notes in `rules.ts` under
   the same contrast and temperature limits. A white sneaker is a light
   shoe, not a separate theory.

## Explicitly not doing

No purchases of any kind for the color foundation. No palette-blog
scraping presented as SciART. No Kibbe body-type layer. No second
women's engine. No AI season-reading from selfies. If money is ever
spent, the only item with a return is a library copy of Flusser for the
suit/shirt/pattern chapters — already encoded as method in 1.2.

## History (kept for the record)

- **1.2 (2026-11-10):** `rules.ts` re-founded on Flusser's two laws +
  pattern rule (wearer-contrast model keyed to the personal season);
  `theory.ts` re-founded on Itten's seven contrasts + extension ratios;
  diagnosis flow on the season dimensions (temperature × value × chroma;
  key drapes: Winter black / Spring gold / Summer silver / Autumn
  brown). The original research verdict — SciART via Scaman as the
  matching 12-season system, Jackson as front door only, Zyla for role
  labels; Caygill / Albers / Birren / Kibbe / Molloy rejected as
  foundations — stands as research; only its purchase path was
  cancelled.
- **1.3 (2026-11-10):** the free foundation above. The hand-written
  `personalSeasons` lists were removed from `palettes.ts` entirely;
  season membership is computed from measured data, every time.
