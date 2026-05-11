import { Router } from "express";
import { nanoid } from "nanoid";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { mutateDb, readDb } from "../utils/db";

export const workspacesRouter = Router();
workspacesRouter.use(requireAuth);

const schema = z.object({
  brand_name: z.string().min(1),
  industry: z.string().optional().default(""),
  target_audience: z.string().optional().default(""),
  brand_tone: z.string().optional().default("Clear and premium"),
  brand_description: z.string().optional().default(""),
  brand_colors: z.array(z.string()).optional().default(["#6366f1", "#14b8a6", "#f97316"]),
  website: z.string().optional(),
  social_links: z.string().optional(),
  logo_url: z.string().optional(),
});

workspacesRouter.get("/", async (req, res) => {
  const db = await readDb();
  res.json({ workspaces: db.workspaces.filter((item) => item.user_id === req.user!.id) });
});

workspacesRouter.post("/", async (req, res) => {
  const input = schema.parse(req.body);
  const workspace = await mutateDb((db) => {
    const now = new Date().toISOString();
    const next = { id: nanoid(), user_id: req.user!.id, ...input, created_at: now, updated_at: now };
    db.workspaces.push(next);
    return next;
  });
  res.json({ workspace });
});

workspacesRouter.put("/:id", async (req, res) => {
  const input = schema.partial().parse(req.body);
  const workspace = await mutateDb((db) => {
    const item = db.workspaces.find((candidate) => candidate.id === req.params.id && candidate.user_id === req.user!.id);
    if (!item) throw new Error("Workspace not found");
    Object.assign(item, input, { updated_at: new Date().toISOString() });
    return item;
  });
  res.json({ workspace });
});

workspacesRouter.delete("/:id", async (req, res) => {
  await mutateDb((db) => {
    db.workspaces = db.workspaces.filter((item) => !(item.id === req.params.id && item.user_id === req.user!.id));
  });
  res.json({ ok: true });
});
