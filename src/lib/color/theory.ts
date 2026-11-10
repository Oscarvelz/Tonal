import type { Harmony, Occasion, PersonalSeason, Sophistication } from "./types";

export const HARMONY_STUDY: Record<
  Harmony,
  { title: string; wheel: string; rule: string; when: string }
> = {
  tonal: {
    title: "Tonal",
    wheel: "One hue, stepped in lightness. Not matching — a value ladder.",
    rule: "Change the cloth, not the color. Two navies of different L* read as tailored; two identical navies read as uniform.",
    when: "Smart casual through elegant. The fastest way to look expensive.",
  },
  monochrome: {
    title: "Monochrome",
    wheel: "Black, charcoal, silver, white. Hue is refused; finish does the work.",
    rule: "Vary value and surface (matte wool, silk, patent, metal). One black is costume; three blacks are evening.",
    when: "Formal, after dark, graphic dressing.",
  },
  analogous: {
    title: "Analogous",
    wheel: "Neighbors ±25–35° on the wheel. Sage + oatmeal, navy + ice, camel + rust.",
    rule: "Keep chroma similar so they feel related. A bright neighbor next to a dusty one looks accidental.",
    when: "Everyday through refined. The most natural 'I just grabbed this' look.",
  },
  complementary: {
    title: "Complementary",
    wheel: "Opposites: blue–orange, red–green, yellow–violet. In clothes, always buffered.",
    rule: "Never 50/50. 60 cool + 30 cream + 10 warm (or reverse). Cream or ivory is the peacemaker.",
    when: "Casual and smart casual. Navy + persimmon, indigo + terracotta.",
  },
  "split-complement": {
    title: "Split complement",
    wheel: "A hue plus the two neighbors of its opposite. Teal with rust and sand.",
    rule: "One dominant, one opposing, one light. This is a painter's chord — keep fashion chroma (dusty, dark).",
    when: "Elegant and avant-garde. Not for first-thing-in-the-morning unless you already know the chord.",
  },
  triadic: {
    title: "Triadic",
    wheel: "Three hues 120° apart. Dangerous at full saturation.",
    rule: "Mute two of the three. The third may speak. Sports triads fail because all three shout.",
    when: "Rare, editorial, reserved for avant-garde.",
  },
  "neutral-accent": {
    title: "Neutral + accent",
    wheel: "A grey-blue or stone axis, then one chromatic pulse at 10%.",
    rule: "The accent is a dark, desaturated relative (oxblood, cognac, bottle) — not a primary.",
    when: "Offices, travel, any day you need speed without looking blank.",
  },
  "high-contrast": {
    title: "High contrast",
    wheel: "Maximum value jump, minimum hue. Sand and ink. Bone and patent.",
    rule: "Silhouette first, color second. Do not add a third hue; it wrecks the graphic.",
    when: "Summer, evening, dressing in under a minute.",
  },
  "low-contrast": {
    title: "Low contrast",
    wheel: "Close values, often cool. Powder on morning grey.",
    rule: "Stay inside a 15–20 point L* range. Texture replaces contrast.",
    when: "Soft summers, quiet mornings, rooms with pale light.",
  },
  "earth-jewel": {
    title: "Earth & jewel",
    wheel: "Dirt colors (tan, loden, umber) plus one deeper gem (rust, bottle, oxblood).",
    rule: "The jewel is never the largest field. Earth is the room; jewel is the lamp.",
    when: "Autumn, country, forest-adjacent city dressing.",
  },
  sartorial: {
    title: "Sartorial",
    wheel: "The grammar of tailoring: navy, grey, camel, brown, ivory. Sometimes aubergine.",
    rule: "Brown shoes with warm or mid values; black shoes with cool darks. Belt matches shoe.",
    when: "The default for looking like you decided. Smart casual through semi-formal.",
  },
  "quiet-luxury": {
    title: "Quiet luxury",
    wheel: "Chroma refusal. Ivory, putty, taupe, chocolate. Depth through value, not hue.",
    rule: "A 20-point value range plus a dark anchor at the foot. Texture (cashmere, suede, poplin) replaces pattern.",
    when: "Anytime the room is already loud. The sophisticated everyday.",
  },
  unexpected: {
    title: "Unexpected",
    wheel: "A pairing that looks 'wrong' until the chroma is fashion-correct: fog + berry, olive + dried rose, ink + saffron.",
    rule: "Dust both colors. One is architecture, one is the odd piece. Black or umber shoes, not a third idea.",
    when: "When popular combos bore you. Avant-garde and refined evenings.",
  },
};

export const OCCASION_STUDY: Record<
  Occasion,
  { blurb: string; do: string; dont: string }
> = {
  casual: {
    blurb: "Cloth can be washed. Color still has a job.",
    do: "Denim, chino, knit, sneaker or loafer. Keep a 60-30-10 even in a tee.",
    dont: "Logo sports color, optic white with dusty sage, black shoes with khaki.",
  },
  "smart-casual": {
    blurb: "The fastest adult register: one tailored piece, one soft piece.",
    do: "Unstructured blazer or fine knit. Leather on the foot. Shirt or polo that takes a collar.",
    dont: "Tie + sneaker irony, athletic shorts, a third chromatic color.",
  },
  elegant: {
    blurb: "Not a dress code — a temperature. Cloth is finer, chroma is lower.",
    do: "Wool, silk, cashmere. Camel coat, ivory column, bottle green, aubergine.",
    dont: "Visible logos, high-chroma primaries, distressed denim.",
  },
  formal: {
    blurb: "Black, midnight, ivory. Texture is the only variation.",
    do: "True black cloth, optically white shirt, satin as a different black. Silver metal.",
    dont: "Navy pretending to be black tie, brown shoes, a novelty color.",
  },
};

export const SOPHISTICATION_STUDY: Record<Sophistication, string> = {
  everyday: "Foundation codes: indigo and ecru, khaki and brown, navy and white. Correct, not boring, if the fit is clean.",
  refined: "Dusty chroma, one unexpected neighbor, shoes that match the theory. The look of someone who edits.",
  sartorial: "Tailoring grammar and tonal dressing. Cloth changes; hue does not. The most sophisticated popular register.",
  "avant-garde": "Unexpected chords at fashion chroma. Fog and berry, celadon and chocolate, muted chartreuse. Not costume — still 60-30-10.",
};

export const SEASON_GUIDES: Record<
  PersonalSeason,
  {
    family: "spring" | "summer" | "autumn" | "winter";
    chroma: string;
    metals: string;
    best: string;
    avoid: string;
    note: string;
  }
> = {
  "light-spring": {
    family: "spring",
    chroma: "Warm, light, clear",
    metals: "Light gold, champagne",
    best: "Ivory, peach, camel, warm sky, coral-not-magenta",
    avoid: "Black, burgundy, icy grey, dusty mauve",
    note: "You wear light more than dark. Soft black will eat you; ivory is your white.",
  },
  "true-spring": {
    family: "spring",
    chroma: "Warm, medium, clear",
    metals: "Yellow gold",
    best: "Camel, rust, warm navy, ivory, grass, coral",
    avoid: "Blue-black, dusty rose, cool grey, burgundy",
    note: "Clear warmth. Tomato and camel love you; oxblood usually does not.",
  },
  "bright-spring": {
    family: "spring",
    chroma: "Warm-leaning, high-chroma, clear",
    metals: "Bright gold, some silver",
    best: "Ivory, true red, cobalt, camel, black in small doses",
    avoid: "Muted olive, dusty mauve, beige-without-yellow",
    note: "You can take chroma others cannot. Still: one loud piece, not three.",
  },
  "light-summer": {
    family: "summer",
    chroma: "Cool, light, soft",
    metals: "Silver, rose gold",
    best: "Powder, rose, lavender-grey, icy blue, pearl",
    avoid: "Orange, camel, black, mustard, olive",
    note: "Contrast must stay low. Powder on grey, not ink on wheat.",
  },
  "true-summer": {
    family: "summer",
    chroma: "Cool, medium, muted",
    metals: "Silver, white gold",
    best: "Rose, slate, powder, burgundy-cool, navy, grey",
    avoid: "Warm camel, tomato, orange, olive, ivory-yellow",
    note: "The most common cool palette. Navy and grey are architecture; pink must be greyed.",
  },
  "soft-summer": {
    family: "summer",
    chroma: "Cool-neutral, muted, medium",
    metals: "Brushed silver, pewter",
    best: "Sage, taupe, cocoa-cool, dusty rose, fog",
    avoid: "Primary red, black-white graphic, bright white, orange",
    note: "You share a border with soft autumn. Dust is your friend; clarity is not.",
  },
  "soft-autumn": {
    family: "autumn",
    chroma: "Warm-neutral, muted, medium",
    metals: "Antique gold, bronze",
    best: "Sage, putty, terracotta-dusty, olive, cream",
    avoid: "Icy pink, black-white, cobalt, optic white",
    note: "Workshop quiet. Celadon, dried rose, olive — the still-life palette.",
  },
  "true-autumn": {
    family: "autumn",
    chroma: "Warm, medium-deep, rich",
    metals: "Gold, bronze, copper",
    best: "Camel, rust, forest, cream, cognac, olive, terracotta",
    avoid: "Icy blue, fuchsia, black-as-only-dark, cool grey",
    note: "The earth palette. Navy is allowed if warm-biased; true black is usually too cool.",
  },
  "dark-autumn": {
    family: "autumn",
    chroma: "Warm, deep, dense",
    metals: "Antique gold, dark bronze",
    best: "Espresso, burgundy, forest, camel, oxblood, ivory",
    avoid: "Pastel, icy silver, light grey, baby pink",
    note: "You can take dark better than true autumn. Still warm — chocolate, not charcoal-blue.",
  },
  "dark-winter": {
    family: "winter",
    chroma: "Cool, deep, clear",
    metals: "Silver, platinum, some gold",
    best: "Black, burgundy-cool, emerald, true navy, icy white, charcoal",
    avoid: "Camel, orange, dusty olive, warm beige",
    note: "High contrast is your native language. Beige will sallow you.",
  },
  "true-winter": {
    family: "winter",
    chroma: "Cool, high-contrast, clear",
    metals: "Silver, white gold",
    best: "Black, white, true red, cobalt, hot pink, navy, emerald",
    avoid: "Camel, orange, gold-beige, dusty anything",
    note: "Primary-adjacent colors, not earth. Bone is safer than yellow-ivory.",
  },
  "bright-winter": {
    family: "winter",
    chroma: "Cool-leaning, high-chroma, clear",
    metals: "Silver, bright white gold",
    best: "Icy white, true black, cobalt, fuchsia, emerald, lemon-clear",
    avoid: "Muted earth, khaki, dusty rose, camel",
    note: "You share brightness with bright spring but stay cooler. Clarity is non-negotiable.",
  },
};

export const FAST_RULES = [
  {
    title: "60-30-10",
    body: "Sixty percent is architecture (trouser, coat, dress). Thirty is the second cloth (knit, shirt, bag-sized). Ten is the pulse — shoe, belt, jewel. A fourth hue is almost always a mistake.",
  },
  {
    title: "Belt matches shoe",
    body: "Leather is one story. Cognac with cognac, black with black. A mismatch is the fastest way to look unfinished.",
  },
  {
    title: "Brown with warmth, black with cool darks",
    body: "Camel, khaki, olive, rust want brown shoes. Black cloth, aubergine, true navy evening want black. Grey takes either — choose by the rest of the chord.",
  },
  {
    title: "Ivory, not optic white, with dusty color",
    body: "Sage, olive, camel and putty look dirty against blue-white. Switch to ivory, bone, or calico.",
  },
  {
    title: "One red",
    body: "Lip or shoe or knit — pick one. Two reds is a uniform. Burgundy and oxblood count as red.",
  },
  {
    title: "Texture replaces pattern",
    body: "When chroma is low, hopsack, merino, suede and poplin do the talking. Pattern on pattern fights the color study.",
  },
  {
    title: "Anchor either the layer or the bottom",
    body: "Decide which piece is 60% before you open the closet. Dressing is slow when every piece auditions for lead.",
  },
  {
    title: "Summer refuses black more than winter does",
    body: "Black absorbs heat and deadens cool skin in noon light. Navy, slate and sand are the warm-weather darks.",
  },
];
