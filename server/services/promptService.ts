import type { Workspace } from "../types";

export function buildTextPrompt(input: {
  workspace: Workspace;
  platform: string;
  content_type: string;
  tone: string;
  goal: string;
  topic: string;
  cta: string;
  variations: number;
}) {
  return [
    "You are a senior social media strategist and conversion copywriter.",
    `Brand: ${input.workspace.brand_name}`,
    `Industry: ${input.workspace.industry}`,
    `Audience: ${input.workspace.target_audience}`,
    `Brand tone: ${input.workspace.brand_tone}`,
    `Brand description: ${input.workspace.brand_description}`,
    `Platform: ${input.platform}`,
    `Content type: ${input.content_type}`,
    `Requested tone: ${input.tone}`,
    `Goal: ${input.goal}`,
    `Topic: ${input.topic}`,
    `CTA: ${input.cta}`,
    `Create ${input.variations} polished variations. Include formatting, hooks, CTA, and relevant hashtags when useful.`,
  ].join("\n");
}
