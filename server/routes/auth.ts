import { Router } from "express";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { z } from "zod";
import { ensureStarterWorkspace, mutateDb, publicProfile, readDb } from "../utils/db";
import { requireAuth, signToken } from "../middleware/auth";

export const authRouter = Router();

const authSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
  password: z.string().min(8),
});

authRouter.post("/signup", async (req, res) => {
  const input = authSchema.parse(req.body);
  const password_hash = await bcrypt.hash(input.password, 12);
  const profile = await mutateDb((db) => {
    if (db.profiles.some((item) => item.email.toLowerCase() === input.email.toLowerCase())) {
      throw new Error("Email is already registered");
    }
    const now = new Date().toISOString();
    const next = { id: nanoid(), email: input.email.toLowerCase(), name: input.name || input.email.split("@")[0], password_hash, created_at: now };
    db.profiles.push(next);
    return next;
  });
  await ensureStarterWorkspace(profile);
  res.json({ token: signToken(profile), user: publicProfile(profile) });
});

authRouter.post("/login", async (req, res) => {
  const input = authSchema.omit({ name: true }).parse(req.body);
  const db = await readDb();
  const profile = db.profiles.find((item) => item.email.toLowerCase() === input.email.toLowerCase());
  if (!profile?.password_hash || !(await bcrypt.compare(input.password, profile.password_hash))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  res.json({ token: signToken(profile), user: publicProfile(profile) });
});

authRouter.post("/logout", (_req, res) => res.json({ ok: true }));

authRouter.get("/me", requireAuth, async (req, res) => {
  const db = await readDb();
  const userId = req.user!.id;
  const profile = db.profiles.find((item) => item.id === userId);
  if (profile) await ensureStarterWorkspace(profile);
  const fresh = await readDb();
  res.json({
    user: req.user,
    data: {
      workspaces: fresh.workspaces.filter((item) => item.user_id === userId),
      contents: fresh.generated_contents.filter((item) => item.user_id === userId).sort((a, b) => b.created_at.localeCompare(a.created_at)),
      images: fresh.generated_images.filter((item) => item.user_id === userId).sort((a, b) => b.created_at.localeCompare(a.created_at)),
      scheduledPosts: fresh.scheduled_posts.filter((item) => item.user_id === userId).sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date)),
      templates: fresh.prompt_templates,
    },
  });
});
