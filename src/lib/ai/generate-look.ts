import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { rulesForLook } from "@/lib/color/rules";
import type { Look } from "@/lib/color/types";
import {
  GENDERS,
  HARMONIES,
  OCCASIONS,
  SEASONS,
  SOPHISTICATIONS,
} from "@/lib/color/types";

const Hex = z.string().regex(/^#[0-9A-Fa-f]{6}$/);

const PieceSchema = z.object({
  hex: Hex,
  colorName: z.string().min(1).max(48),
  garment: z.string().min(1).max(64),
});

const AiLookSchema = z.object({
  name: z.string().min(1).max(48),
  harmony: z.enum(HARMONIES),
  sophistication: z.enum(SOPHISTICATIONS),
  mood: z.string().min(1).max(80),
  undertone: z.enum(["warm", "cool", "neutral"]),
  theory: z.string().min(1).max(420),
  wear: z.string().min(1).max(280),
  season: z.enum(SEASONS),
  bottomKind: z.enum(["pants", "skirt", "wide", "shorts"]),
  layerKind: z.enum(["coat", "blazer", "jacket", "knit", "none"]),
  pieces: z.object({
    layer: PieceSchema.nullable().optional(),
    top: PieceSchema,
    bottom: PieceSchema,
    shoes: PieceSchema,
    accessory: PieceSchema.nullable().optional(),
  }),
});

const InputSchema = z.object({
  gender: z.enum(GENDERS),
  occasion: z.enum(OCCASIONS),
  sophistication: z.union([z.enum(SOPHISTICATIONS), z.literal("any")]),
  harmony: z.union([z.enum(HARMONIES), z.literal("any")]),
  notes: z.string().max(240).optional(),
});

export type AiLookResult =
  | { ok: true; look: Look }
  | { ok: false; error: string };

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced?.[1] ?? text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("No JSON object");
  return JSON.parse(raw.slice(start, end + 1));
}

export const generateAiLook = createServerFn({ method: "POST" })
  .validator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<AiLookResult> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false, error: "AI is not available in this environment." };
    }

    const prompt = `You are a master colorist for menswear and womenswear. Propose ONE complete outfit as JSON only (no markdown).

Audience: ${data.gender}
Occasion: ${data.occasion}
Sophistication: ${data.sophistication}
Harmony preference: ${data.harmony}
Notes: ${data.notes?.trim() || "none"}

Rules:
- Advanced color theory, not Pinterest basics. Prefer sartorial, quiet-luxury, tonal, earth-jewel, unexpected chords at fashion chroma (dusty, dark). Avoid costume primaries.
- 60-30-10. Belt-level accessory should match shoe leather when present.
- Hex colors must be real fashion cloth colors (navy, camel, oxblood, forest, ivory, charcoal, bottle, aubergine, sage, fog...).
- Garment names are specific (e.g. "unstructured navy blazer", "ivory merino polo", "cognac suede loafers") not generic "shirt".
- theory: 2-3 sentences on WHY the colors work (hue, value, chroma, undertone).
- wear: one paragraph on how to put it on.
- For men, bottomKind must be "pants". For women, skirt/wide/pants as appropriate to occasion.
- If layerKind is "none", pieces.layer must be null.

JSON shape:
{
  "name": "Midnight Camel",
  "harmony": "sartorial",
  "sophistication": "sartorial",
  "mood": "short mood",
  "undertone": "warm",
  "season": "autumn",
  "theory": "...",
  "wear": "...",
  "bottomKind": "pants",
  "layerKind": "coat",
  "pieces": {
    "layer": { "hex": "#1b2a4a", "colorName": "Midnight navy", "garment": "wool overcoat" },
    "top": { "hex": "#efe6d6", "colorName": "Ivory", "garment": "merino polo" },
    "bottom": { "hex": "#c4a574", "colorName": "Camel", "garment": "tropical wool trousers" },
    "shoes": { "hex": "#6b3a2a", "colorName": "Cognac", "garment": "suede loafers" },
    "accessory": { "hex": "#6b3a2a", "colorName": "Cognac", "garment": "leather belt" }
  }
}`;

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.8,
        max_tokens: 900,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "Return only valid JSON matching the user's schema. No markdown.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      return { ok: false, error: `Grok could not dress this look (${res.status}).` };
    }

    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = body.choices?.[0]?.message?.content ?? "";
    try {
      const parsed = AiLookSchema.parse(extractJson(text));
      const look: Look = {
        id: `ai-${Date.now()}`,
        name: parsed.name,
        harmony: parsed.harmony,
        occasion: data.occasion,
        gender: data.gender,
        season: parsed.season,
        sophistication: parsed.sophistication,
        mood: parsed.mood,
        undertone: parsed.undertone,
        theory: parsed.theory,
        wear: parsed.wear,
        source: "ai",
        ruleTitles: rulesForLook({
          occasion: data.occasion,
          harmony: parsed.harmony,
          sophistication: parsed.sophistication,
          season: parsed.season,
        }).map((r) => r.title),
        pieces: {
          layer: parsed.pieces.layer ?? undefined,
          top: parsed.pieces.top,
          bottom: parsed.pieces.bottom,
          shoes: parsed.pieces.shoes,
          accessory: parsed.pieces.accessory ?? undefined,
        },
        bottomKind: data.gender === "men" ? "pants" : parsed.bottomKind,
        layerKind: parsed.layerKind,
        createdAt: Date.now(),
      };
      return { ok: true, look };
    } catch {
      return { ok: false, error: "Grok returned a look we could not parse. Try again." };
    }
  });
