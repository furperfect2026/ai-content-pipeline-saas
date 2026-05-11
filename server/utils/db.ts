import fs from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";
import type { DatabaseShape, Profile } from "../types";

const dbPath = path.join(process.cwd(), "server", "data", "db.json");

const templates = [
  { id: "tpl-caption", title: "Conversion Caption", category: "Caption", platform: "Instagram", prompt: "Write a sharp caption with hook, value, proof, CTA, and hashtags." },
  { id: "tpl-linkedin", title: "Founder Insight", category: "Thought leadership", platform: "LinkedIn", prompt: "Write a credible LinkedIn post with a human opening, practical insight, and soft CTA." },
  { id: "tpl-thread", title: "Launch Thread", category: "Thread", platform: "X/Twitter", prompt: "Create a concise thread with numbered posts, each under 260 characters." },
] satisfies DatabaseShape["prompt_templates"];

const emptyDb: DatabaseShape = {
  profiles: [],
  workspaces: [],
  generated_contents: [],
  generated_images: [],
  scheduled_posts: [],
  prompt_templates: templates,
};

async function ensureDb() {
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  try {
    await fs.access(dbPath);
  } catch {
    await fs.writeFile(dbPath, JSON.stringify(emptyDb, null, 2));
  }
}

export async function readDb(): Promise<DatabaseShape> {
  await ensureDb();
  const raw = await fs.readFile(dbPath, "utf8");
  const parsed = JSON.parse(raw) as DatabaseShape;
  return { ...emptyDb, ...parsed, prompt_templates: parsed.prompt_templates?.length ? parsed.prompt_templates : templates };
}

export async function writeDb(db: DatabaseShape) {
  await ensureDb();
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

export async function mutateDb<T>(callback: (db: DatabaseShape) => T | Promise<T>) {
  const db = await readDb();
  const result = await callback(db);
  await writeDb(db);
  return result;
}

export async function ensureStarterWorkspace(user: Profile) {
  await mutateDb((db) => {
    if (db.workspaces.some((workspace) => workspace.user_id === user.id)) return;
    const now = new Date().toISOString();
    db.workspaces.push({
      id: nanoid(),
      user_id: user.id,
      brand_name: "Launch Studio",
      industry: "AI-assisted marketing",
      target_audience: "Founders, creators, and lean marketing teams",
      brand_tone: "Premium, clear, useful, confident",
      brand_description: "A nimble brand workspace for campaign planning, social content, and visual storytelling.",
      brand_colors: ["#6366f1", "#14b8a6", "#f97316"],
      website: "https://example.com",
      social_links: "Instagram, LinkedIn, X",
      created_at: now,
      updated_at: now,
    });
  });
}

export function publicProfile(profile: Profile) {
  return { id: profile.id, email: profile.email, name: profile.name, created_at: profile.created_at };
}
