import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";
import { mutateDb, publicProfile } from "../utils/db";
import type { Profile } from "../types";

declare global {
  namespace Express {
    interface Request {
      user?: ReturnType<typeof publicProfile>;
    }
  }
}

const jwtSecret = process.env.JWT_SECRET || "dev-secret-change-me";

export function signToken(profile: Profile) {
  return jwt.sign({ sub: profile.id, email: profile.email, name: profile.name }, jwtSecret, { expiresIn: "7d" });
}

async function resolveSupabaseUser(token: string): Promise<Profile | null> {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user?.email) return null;
  const now = new Date().toISOString();
  return mutateDb((db) => {
    let profile = db.profiles.find((item) => item.id === data.user.id);
    if (!profile) {
      profile = {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name ?? data.user.email!.split("@")[0],
        created_at: now,
      };
      db.profiles.push(profile);
    }
    return profile;
  });
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) return res.status(401).json({ error: "Authentication required" });

  try {
    const decoded = jwt.verify(token, jwtSecret) as { sub: string };
    const profile = await mutateDb((db) => db.profiles.find((item) => item.id === decoded.sub));
    if (!profile) return res.status(401).json({ error: "Invalid session" });
    req.user = publicProfile(profile);
    return next();
  } catch {
    const supabaseProfile = await resolveSupabaseUser(token);
    if (!supabaseProfile) return res.status(401).json({ error: "Invalid session" });
    req.user = publicProfile(supabaseProfile);
    return next();
  }
}
