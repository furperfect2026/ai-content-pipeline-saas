import { Router } from "express";
import { nanoid } from "nanoid";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { mutateDb, readDb } from "../utils/db";

export const scheduleRouter = Router();
scheduleRouter.use(requireAuth);

const schema = z.object({
  workspace_id: z.string(),
  content_id: z.string().optional().or(z.literal("")),
  title: z.string(),
  platform: z.string(),
  scheduled_date: z.string(),
  scheduled_time: z.string(),
  status: z.string().optional().default("Scheduled"),
});

scheduleRouter.get("/", async (req, res) => {
  const db = await readDb();
  res.json({ scheduledPosts: db.scheduled_posts.filter((item) => item.user_id === req.user!.id) });
});

scheduleRouter.post("/", async (req, res) => {
  const input = schema.parse(req.body);
  const scheduledPost = await mutateDb((db) => {
    const next = { id: nanoid(), user_id: req.user!.id, ...input, content_id: input.content_id || undefined, platform: input.platform as never, status: input.status as never, created_at: new Date().toISOString() };
    db.scheduled_posts.push(next);
    return next;
  });
  res.json({ scheduledPost });
});

scheduleRouter.put("/:id", async (req, res) => {
  const input = schema.partial().parse(req.body);
  const scheduledPost = await mutateDb((db) => {
    const item = db.scheduled_posts.find((candidate) => candidate.id === req.params.id && candidate.user_id === req.user!.id);
    if (!item) throw new Error("Scheduled post not found");
    Object.assign(item, input);
    return item;
  });
  res.json({ scheduledPost });
});

scheduleRouter.delete("/:id", async (req, res) => {
  await mutateDb((db) => {
    db.scheduled_posts = db.scheduled_posts.filter((item) => !(item.id === req.params.id && item.user_id === req.user!.id));
  });
  res.json({ ok: true });
});
