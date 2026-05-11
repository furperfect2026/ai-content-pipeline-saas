import { Router } from "express";
import { nanoid } from "nanoid";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { mutateDb, readDb } from "../utils/db";

export const contentRouter = Router();
contentRouter.use(requireAuth);

contentRouter.get("/", async (req, res) => {
  const db = await readDb();
  res.json({ contents: db.generated_contents.filter((item) => item.user_id === req.user!.id) });
});

contentRouter.post("/", async (req, res) => {
  const input = z.object({ workspace_id: z.string(), platform: z.string(), content_type: z.string(), response: z.string(), status: z.string().optional() }).parse(req.body);
  const content = await mutateDb((db) => {
    const now = new Date().toISOString();
    const next = { id: nanoid(), user_id: req.user!.id, workspace_id: input.workspace_id, platform: input.platform as never, content_type: input.content_type, tone: "", goal: "", prompt: "Manual content", response: input.response, status: (input.status || "Draft") as never, created_at: now, updated_at: now };
    db.generated_contents.push(next);
    return next;
  });
  res.json({ content });
});

contentRouter.put("/:id", async (req, res) => {
  const input = z.object({ response: z.string().optional(), status: z.string().optional() }).parse(req.body);
  const content = await mutateDb((db) => {
    const item = db.generated_contents.find((candidate) => candidate.id === req.params.id && candidate.user_id === req.user!.id);
    if (!item) throw new Error("Content not found");
    Object.assign(item, input, { updated_at: new Date().toISOString() });
    return item;
  });
  res.json({ content });
});

contentRouter.delete("/:id", async (req, res) => {
  await mutateDb((db) => {
    db.generated_contents = db.generated_contents.filter((item) => !(item.id === req.params.id && item.user_id === req.user!.id));
  });
  res.json({ ok: true });
});
