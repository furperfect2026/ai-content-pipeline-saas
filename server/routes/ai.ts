import { Router } from "express";
import { nanoid } from "nanoid";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { generateImage, generateText } from "../services/aiService";
import { mutateDb, readDb } from "../utils/db";

export const aiRouter = Router();
aiRouter.use(requireAuth);

aiRouter.post("/generate-text", async (req, res) => {
  const input = z.object({
    workspace_id: z.string(),
    platform: z.string(),
    content_type: z.string(),
    tone: z.string(),
    goal: z.string(),
    topic: z.string(),
    cta: z.string(),
    variations: z.number().min(1).max(10),
  }).parse(req.body);
  const db = await readDb();
  const workspace = db.workspaces.find((item) => item.id === input.workspace_id && item.user_id === req.user!.id);
  if (!workspace) return res.status(404).json({ error: "Workspace not found" });
  const generated = await generateText({ ...input, workspace });
  const content = await mutateDb((state) => {
    const now = new Date().toISOString();
    const next = { id: nanoid(), user_id: req.user!.id, workspace_id: workspace.id, platform: input.platform as never, content_type: input.content_type, tone: input.tone, goal: input.goal, prompt: generated.prompt, response: generated.response, status: "Draft" as const, created_at: now, updated_at: now };
    state.generated_contents.push(next);
    return next;
  });
  res.json({ content, mode: generated.mode });
});

aiRouter.post("/generate-image", async (req, res) => {
  const input = z.object({
    workspace_id: z.string(),
    platform_size: z.string(),
    visual_style: z.string(),
    brand_colors: z.string(),
    prompt: z.string(),
  }).parse(req.body);
  const db = await readDb();
  const workspace = db.workspaces.find((item) => item.id === input.workspace_id && item.user_id === req.user!.id);
  if (!workspace) return res.status(404).json({ error: "Workspace not found" });
  const generated = await generateImage({ ...input, workspace });
  const image = await mutateDb((state) => {
    const now = new Date().toISOString();
    const next = { id: nanoid(), user_id: req.user!.id, workspace_id: workspace.id, platform_size: input.platform_size, visual_style: input.visual_style, prompt: generated.prompt, image_url: generated.image_url, status: "Draft" as const, created_at: now };
    state.generated_images.push(next);
    return next;
  });
  res.json({ image, mode: generated.mode });
});
