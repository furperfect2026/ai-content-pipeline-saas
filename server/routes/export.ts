import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { readDb } from "../utils/db";

export const exportRouter = Router();
exportRouter.use(requireAuth);

async function userBundle(userId: string) {
  const db = await readDb();
  return {
    workspaces: db.workspaces.filter((item) => item.user_id === userId),
    contents: db.generated_contents.filter((item) => item.user_id === userId),
    images: db.generated_images.filter((item) => item.user_id === userId),
    scheduledPosts: db.scheduled_posts.filter((item) => item.user_id === userId),
  };
}

exportRouter.post("/json", async (req, res) => {
  const bundle = await userBundle(req.user!.id);
  res.json({ filename: "aura-campaign-export.json", content: JSON.stringify(bundle, null, 2) });
});

exportRouter.post("/markdown", async (req, res) => {
  const bundle = await userBundle(req.user!.id);
  const content = [
    "# Aura Campaign Export",
    "",
    "## Workspaces",
    ...bundle.workspaces.map((item) => `- ${item.brand_name} (${item.industry})`),
    "",
    "## Generated Content",
    ...bundle.contents.map((item) => `### ${item.platform} · ${item.content_type}\n\n${item.response}\n`),
    "",
    "## Schedule",
    ...bundle.scheduledPosts.map((item) => `- ${item.scheduled_date} ${item.scheduled_time}: ${item.title} on ${item.platform}`),
  ].join("\n");
  res.json({ filename: "aura-campaign-export.md", content });
});

exportRouter.post("/pdf", async (req, res) => {
  const bundle = await userBundle(req.user!.id);
  const lines = [
    "Aura Campaign Export",
    `Workspaces: ${bundle.workspaces.length}`,
    `Generated content: ${bundle.contents.length}`,
    `Images: ${bundle.images.length}`,
    `Scheduled posts: ${bundle.scheduledPosts.length}`,
    "Use Markdown or JSON exports for the full campaign handoff.",
  ];
  res.json({ filename: "aura-campaign-export.pdf", mime: "application/pdf", content: makeSimplePdf(lines) });
});

function escapePdfText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function makeSimplePdf(lines: string[]) {
  const textOps = lines.map((line, index) => `BT /F1 ${index === 0 ? 22 : 12} Tf 72 ${740 - index * 28} Td (${escapePdfText(line)}) Tj ET`).join("\n");
  const stream = `${textOps}\n`;
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    `5 0 obj\n<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}endstream\nendobj\n`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const object of objects) {
    offsets.push(Buffer.byteLength(pdf));
    pdf += object;
  }
  const xrefOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("");
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return pdf;
}
