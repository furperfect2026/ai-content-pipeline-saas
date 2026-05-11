import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";
import { ZodError } from "zod";
import { authRouter } from "./routes/auth";
import { workspacesRouter } from "./routes/workspaces";
import { aiRouter } from "./routes/ai";
import { contentRouter } from "./routes/content";
import { scheduleRouter } from "./routes/schedule";
import { exportRouter } from "./routes/export";

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "8mb" }));

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "aura-pipeline-api" }));
app.use("/api/auth", authRouter);
app.use("/api/workspaces", workspacesRouter);
app.use("/api/ai", aiRouter);
app.use("/api/content", contentRouter);
app.use("/api/schedule", scheduleRouter);
app.use("/api/export", exportRouter);

const clientDist = path.join(process.cwd(), "dist");
const clientIndex = path.join(clientDist, "index.html");

if (fs.existsSync(clientIndex)) {
  app.use(express.static(clientDist));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(clientIndex);
  });
}

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ZodError) return res.status(400).json({ error: error.errors[0]?.message ?? "Invalid request" });
  const message = error instanceof Error ? error.message : "Server error";
  const status = message.includes("not found") ? 404 : message.includes("registered") ? 409 : 500;
  if (status === 500) console.error(error);
  res.status(status).json({ error: message });
});

app.listen(port, () => {
  console.log(`Aura Pipeline API running on http://localhost:${port}`);
});
