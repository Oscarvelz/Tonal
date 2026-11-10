export type RuleGroup =
  | "proportion"
  | "leather"
  | "temperature"
  | "formality"
  | "season"
  | "face"
  | "errors"
  | "speed";

export type Rule = {
  id: string;
  group: RuleGroup;
  title: string;
  body: string;
};

export const RULE_GROUP_LABEL: Record<RuleGroup, string> = {
  proportion: "Proportion",
  leather: "Leather",
  temperature: "Temperature",
  formality: "Formality",
  season: "Season",
  face: "Near the face",
  errors: "Fast errors",
  speed: "Speed",
};

export const RULES: Rule[] = [
  { id: "r-60", group: "proportion", title: "60-30-10", body: "Sixty is architecture. Thirty is the second cloth. Ten is the pulse. A fourth hue is almost always a mistake." },
  { id: "r-anchor", group: "proportion", title: "Anchor before you open the closet", body: "Decide whether the layer or the bottom is 60%. Dressing is slow when every piece auditions for lead." },
  { id: "r-one-chroma", group: "proportion", title: "One chromatic story", body: "You may have many neutrals. You may have one chroma. Two chromas need a buffer (ivory) and a reason." },
  { id: "r-10-once", group: "proportion", title: "The 10% appears once", body: "Oxblood loafer or oxblood knit — not both loud. The pulse is a lamp, not a room." },
  { id: "r-value-before-hue", group: "proportion", title: "Value before hue", body: "If the lightness pattern is wrong, no hue will save it. Check the outfit in greyscale in your head." },
  { id: "r-cloth-not-color", group: "proportion", title: "Change the cloth, not the color", body: "Tonal dressing fails when two identical navies meet. Hopsack plus merino plus fresco is the point." },
  { id: "r-silhouette", group: "proportion", title: "Silhouette is a color decision", body: "Wide-leg wants a quieter chord so cut can speak. Slim dark trousers can take a louder knit." },
  { id: "r-belt-shoe", group: "leather", title: "Belt matches shoe", body: "Leather is one story. Cognac with cognac, black with black. A mismatch is the fastest unfinished look." },
  { id: "r-brown-warm", group: "leather", title: "Brown with warmth", body: "Camel, khaki, olive, rust, sand want brown. Black cloth, aubergine, true-navy evening want black." },
  { id: "r-grey-either", group: "leather", title: "Grey takes either", body: "Mid grey takes brown or black. Choose by the rest of the chord, then commit." },
  { id: "r-suede-day", group: "leather", title: "Suede is a day leather", body: "Suede loafer and chukka belong to daylight. Patent and calf belong to evening. Mix with intent." },
  { id: "r-bag-joins", group: "leather", title: "The bag joins the leather story", body: "A third leather color is a fourth hue. The tote is not a free chromatic vote." },
  { id: "r-metal-temp", group: "leather", title: "Metal follows temperature", body: "Silver with cool darks. Gold, bronze, antique gold with warmth. Mixing both needs a reason." },
  { id: "r-warm-cool", group: "temperature", title: "Do not mix undertones in the large fields", body: "Ivory-yellow with pink-beige is the quiet-luxury failure mode. Check them in daylight." },
  { id: "r-navy-brown", group: "temperature", title: "Navy and brown are allowed", body: "Navy is a cool dark that still takes brown shoes. It is the bridge between warm and cool wardrobes." },
  { id: "r-black-camel", group: "temperature", title: "Black with camel is a hard mix", body: "Camel wants brown. Black wants a cool partner. Use charcoal instead of black, or chocolate instead of camel." },
  { id: "r-olive-black", group: "temperature", title: "Olive and black fight", body: "Olive is a warm dark yellow-green. Black turns it sickly. Chocolate, umber, or dark olive shoes." },
  { id: "r-sage-white", group: "temperature", title: "Sage hates optic white", body: "Dusty green looks dirty against blue-white. Bone, oatmeal, calico." },
  { id: "r-burgundy-cream", group: "temperature", title: "Burgundy wants cool ivory, not yellow cream", body: "Yellow cream warms the red into costume. Cool ivory or silver-ivory keeps it adult." },
  { id: "r-teal-brown", group: "temperature", title: "Teal can take tan at the foot", body: "Cool-on-cool stacks look clinical. A small earth note at the shoe keeps teal human." },
  { id: "r-casual-still", group: "formality", title: "Casual still has a chord", body: "A tee is allowed. A random sports primary is not. 60-30-10 survives the weekend." },
  { id: "r-smart-one-tailored", group: "formality", title: "Smart casual is one tailored piece", body: "Jacket or fine knit or leather shoe — at least one adult object. Not all three shouting." },
  { id: "r-elegant-chroma", group: "formality", title: "Elegant lowers chroma", body: "Not a dress code — a temperature. Wool, silk, cashmere. Dusty, not bright." },
  { id: "r-formal-true-black", group: "formality", title: "Formal black is true black", body: "Navy pretending to be black tie is a creative-black-tie decision, not a default. White shirt optically white." },
  { id: "r-no-brown-black-suit", group: "formality", title: "No brown shoes with a black suit", body: "The oldest rule still holds. Grey takes brown. Black does not." },
  { id: "r-tie-optional", group: "formality", title: "A knit tie is smart casual, a grenadine is elegant", body: "The tie is a 10% that can jump the register. Use it on purpose." },
  { id: "r-summer-black", group: "season", title: "Summer refuses black more than winter does", body: "Black absorbs heat and deadens cool skin in noon light. Navy, slate, sand are the warm-weather darks." },
  { id: "r-winter-texture", group: "season", title: "Winter is texture season", body: "Flannel, cashmere, suede, heavy cotton. The chord can stay the same; the cloth changes." },
  { id: "r-spring-clear", group: "season", title: "Spring can take clearer chroma", body: "True and bright springs wear rust and camel that would overwhelm a soft summer. Still one pulse." },
  { id: "r-autumn-earth", group: "season", title: "Autumn is the earth palette", body: "Camel, rust, forest, cream, cognac. Icy blue and fuchsia are usually a miss." },
  { id: "r-linen-wrinkle", group: "season", title: "Linen is a summer cloth with a summer chord", body: "Sand, olive, ivory, rust. Pairing linen with black suiting shoes fights the cloth." },
  { id: "r-white-sneaker-winter", group: "season", title: "White sneakers in deep winter look lost", body: "They are a summer-to-spring 10%. In snow, switch to leather or suede in the chord." },
  { id: "r-face-light", group: "face", title: "A light near the face", body: "Ivory, bone, powder, or a pale knit. A dark turtleneck can work; a muddy mid-tone rarely does." },
  { id: "r-season-face", group: "face", title: "Personal season is a face rule", body: "Camel as a large field salllows many cool winters. Black as a large field eats many light springs." },
  { id: "r-metal-face", group: "face", title: "Jewelry is 10% at the face", body: "It counts as the pulse if it is large. A gold collar on a cool-silver chord is a second story." },
  { id: "r-lip-counts", group: "face", title: "A red mouth is a red garment", body: "If the lip is chromatic, the shoe cannot also be. This is the French summer rule." },
  { id: "r-contrast-face", group: "face", title: "High contrast near the face is a winter gift", body: "Summers often want a softer step — powder, not ink, against the cheek." },
  { id: "r-khaki-black", group: "errors", title: "Black shoes with khaki", body: "Uniform error. Brown leather is mandatory with khaki, stone, and olive chinos." },
  { id: "r-white-sage", group: "errors", title: "Optic white with dusty color", body: "Makes sage, olive, camel, putty look soiled. Ivory." },
  { id: "r-two-reds", group: "errors", title: "Two reds", body: "Shoe and knit, or shoe and lip. Pick one." },
  { id: "r-logo-sport", group: "errors", title: "Logo sports color", body: "A primary from a jersey is not a 10% pulse. It is a costume." },
  { id: "r-navy-black-shoes-camel", group: "errors", title: "Black shoes with a camel coat", body: "The coat is warm. The foot should be. Charcoal coat if you need black shoes." },
  { id: "r-matching-set", group: "errors", title: "Identical navy on navy", body: "Looks like a uniform. Step the value or change the cloth." },
  { id: "r-three-loud", group: "errors", title: "Three loud garments", body: "A complementary pair plus a triad accent. The eye has nowhere to rest." },
  { id: "r-grey-beige-mix", group: "errors", title: "Cool grey with yellow beige", body: "The quiet-luxury failure. Pick a temperature and stay there." },
  { id: "r-patent-day", group: "errors", title: "Patent in daylight", body: "Patent is evening shine. Calf or suede for noon." },
  { id: "r-distress-elegant", group: "errors", title: "Distressed denim in an elegant register", body: "The register is the cloth, not the hue. Rips lower the occasion regardless of navy." },
  { id: "r-start-bottom", group: "speed", title: "Start with the bottom", body: "Most people dress top-first and then fight the trousers. Reverse it. The generator does." },
  { id: "r-hold", group: "speed", title: "Hold when the chord is right", body: "Do not keep cycling. The point of a live runway is to stop." },
  { id: "r-repeat", group: "speed", title: "Repeat a chord, vary the cloth", body: "A uniform is a solved equation. Navy-ivory-cognac can be five outfits if the garments change." },
  { id: "r-three-outfit", group: "speed", title: "Three outfits from one chord", body: "Same palettes, three bottoms — denim, chino, wool. The 30% and 10% stay. That is dressing faster." },
  { id: "r-daylight-check", group: "speed", title: "Check ivory against camel in daylight", body: "Indoor yellow light lies. The last step is a window, not a mirror bulb." },
  { id: "r-photograph", group: "speed", title: "A phone photo is a greyscale test", body: "Desaturate the shot. If the value pattern collapses, the chord was chroma-only and will fail in the street." },
  { id: "r-one-new", group: "speed", title: "One new piece per look", body: "When buying, add a piece that slots into a chord you already run. Orphans slow you down." },
  { id: "r-capsule-five", group: "speed", title: "Five large fields is a wardrobe", body: "Navy, charcoal, ivory, camel, forest — or your season's equivalent. Shoes in two leathers. You can leave the house." },
  { id: "r-mirror-distance", group: "speed", title: "Step back two meters", body: "Color studies fail at pocket distance. Proportion is a room-scale fact." },
  { id: "r-weather-layer", group: "speed", title: "The layer is weather, not decoration", body: "If you will remove the coat indoors, the underneath must still be a chord. Dress the inside." },
  { id: "r-socks", group: "speed", title: "Socks join the trouser or the shoe", body: "Not a third hue. Invisible, or tonal to the leg, or matched to the leather." },
  { id: "r-watch-strap", group: "leather", title: "The watch strap is leather or metal", body: "A bright NATO in a fourth hue is a sports accent. Steel or the shoe's leather." },
  { id: "r-denim-jacket-indigo", group: "errors", title: "Indigo jacket on indigo jean", body: "Canadian tuxedo unless the values and cloths differ hard — and even then, it is a costume to most rooms." },
  { id: "r-white-after-labor", group: "season", title: "Optic white after Labor Day is a myth", body: "The real rule is undertone and dust. Ivory all year. Optic white when the light is hard and the cloth is crisp." },
  { id: "r-double-monk-brown", group: "leather", title: "Monk straps follow the same leather law", body: "They are not a free pass to mix brown hardware with a black suit." },
  { id: "r-evening-shine", group: "formality", title: "Evening can take shine, day rarely", body: "Satin, patent, silk. One shine. Matte wool holding it." },
  { id: "r-cool-pink", group: "face", title: "Pink must be greyed to enter an adult wardrobe", body: "Powder, dusty rose, dried rose. Salmon and hot pink are seasonal and rare." },
  { id: "r-chartreuse", group: "errors", title: "Chartreuse at full chroma", body: "Mute it and sit it on olive-charcoal. Full acid is a costume unless you are on a stage." },
  { id: "r-cobalt-one", group: "proportion", title: "Cobalt is one garment", body: "Bone as everything else. Tan shoes, not black. Stop." },
  { id: "r-green-red-xmas", group: "errors", title: "Evergreen plus bright red", body: "That is December. Rust, terracotta, cognac are the earth reds that keep green in the forest." },
  { id: "r-fit-is-color", group: "speed", title: "Fit is part of the color study", body: "A perfect chord in a ballooning shirt still fails. Color cannot disguise proportion of cloth." },
  { id: "r-repeat-success", group: "speed", title: "Save the chord that worked", body: "The closet is a library of solved looks. If a morning was fast, hold it and save it." },
];

export function rulesForLook(input: {
  occasion: string;
  harmony: string;
  sophistication: string;
  season: string;
}): Rule[] {
  const picks: Rule[] = [];
  const add = (id: string) => {
    const r = RULES.find((x) => x.id === id);
    if (r && !picks.includes(r)) picks.push(r);
  };
  add("r-60");
  add("r-belt-shoe");
  add("r-anchor");
  if (input.harmony === "tonal") add("r-cloth-not-color");
  if (input.harmony === "complementary") add("r-one-chroma");
  if (input.harmony === "quiet-luxury") add("r-warm-cool");
  if (input.harmony === "monochrome") add("r-evening-shine");
  if (input.harmony === "unexpected") add("r-10-once");
  if (input.occasion === "casual") add("r-casual-still");
  if (input.occasion === "smart-casual") add("r-smart-one-tailored");
  if (input.occasion === "elegant") add("r-elegant-chroma");
  if (input.occasion === "formal") add("r-formal-true-black");
  if (input.season === "summer") add("r-summer-black");
  if (input.season === "winter") add("r-winter-texture");
  if (input.season === "autumn") add("r-autumn-earth");
  if (input.season === "spring") add("r-spring-clear");
  add("r-start-bottom");
  return picks.slice(0, 6);
}
