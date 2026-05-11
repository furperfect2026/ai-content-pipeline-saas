import type { Workspace } from "../types";
import { buildTextPrompt } from "./promptService";

const textModel = process.env.GEMINI_TEXT_MODEL || "gemini-1.5-flash";
const imageModel = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image-preview";

async function callGeminiText(prompt: string) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${textModel}:generateContent?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  if (!response.ok) throw new Error(`Gemini text request failed: ${response.status}`);
  const json = (await response.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  return json.candidates?.[0]?.content?.parts?.map((part) => part.text).filter(Boolean).join("\n") ?? null;
}

export async function generateText(input: {
  workspace: Workspace;
  platform: string;
  content_type: string;
  tone: string;
  goal: string;
  topic: string;
  cta: string;
  variations: number;
}) {
  const prompt = buildTextPrompt(input);
  const gemini = await callGeminiText(prompt);
  if (gemini) return { prompt, response: gemini, mode: "gemini" as const };
  const response = Array.from({ length: input.variations || 3 })
    .map((_, index) => [
      `Variation ${index + 1}: ${input.topic}`,
      `Hook: The fastest way to make ${input.workspace.brand_name} stand out on ${input.platform} is to make the message unmistakably useful.`,
      `Body: Speak to ${input.workspace.target_audience}, lead with the outcome, and support it with a crisp proof point. Keep the tone ${input.tone.toLowerCase()}.`,
      `CTA: ${input.cta}`,
      "#BrandGrowth #SocialMediaStrategy #AIMarketing",
    ].join("\n"))
    .join("\n\n---\n\n");
  return { prompt, response, mode: "mock" as const };
}

function svgPoster(input: { workspace: Workspace; platform_size: string; visual_style: string; prompt: string; brand_colors: string }) {
  const colors = input.brand_colors.split(",").map((c) => c.trim()).filter(Boolean);
  const [a = "#6366f1", b = "#14b8a6", c = "#f97316"] = colors;
  const title = input.workspace.brand_name.replace(/[<>&]/g, "");
  const prompt = input.prompt.replace(/[<>&]/g, "").slice(0, 88);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${a}"/><stop offset=".52" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient></defs>
    <rect width="1080" height="1080" fill="#f8fafc"/>
    <circle cx="900" cy="130" r="260" fill="${a}" opacity=".18"/>
    <circle cx="140" cy="870" r="320" fill="${b}" opacity=".20"/>
    <rect x="86" y="92" width="908" height="896" rx="72" fill="url(#g)"/>
    <rect x="130" y="136" width="820" height="808" rx="54" fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.38)" stroke-width="2"/>
    <text x="170" y="260" fill="white" font-family="Inter,Arial" font-size="42" font-weight="800" letter-spacing="6">${input.platform_size.toUpperCase()}</text>
    <text x="170" y="520" fill="white" font-family="Inter,Arial" font-size="78" font-weight="900">${title}</text>
    <foreignObject x="170" y="570" width="740" height="190"><div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Inter,Arial;color:white;font-size:42px;font-weight:800;line-height:1.15">${prompt}</div></foreignObject>
    <text x="170" y="860" fill="white" opacity=".82" font-family="Inter,Arial" font-size="34" font-weight="700">${input.visual_style}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

async function callGeminiImage(prompt: string) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${imageModel}:generateContent?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  if (!response.ok) return null;
  const json = (await response.json()) as { candidates?: Array<{ content?: { parts?: Array<{ inlineData?: { mimeType: string; data: string } }> } }> };
  const inline = json.candidates?.[0]?.content?.parts?.find((part) => part.inlineData)?.inlineData;
  return inline ? `data:${inline.mimeType};base64,${inline.data}` : null;
}

export async function generateImage(input: { workspace: Workspace; platform_size: string; visual_style: string; prompt: string; brand_colors: string }) {
  const prompt = `Create a premium social media visual. Brand: ${input.workspace.brand_name}. Size: ${input.platform_size}. Style: ${input.visual_style}. Brand colors: ${input.brand_colors}. Brief: ${input.prompt}`;
  const gemini = await callGeminiImage(prompt);
  return { prompt, image_url: gemini ?? svgPoster(input), mode: gemini ? ("gemini" as const) : ("mock" as const) };
}
