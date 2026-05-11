import { FormEvent, useState } from "react";
import { Copy, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Page } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";
import type { GeneratedContent, Platform } from "@/types";

const platforms: Platform[] = ["Instagram", "LinkedIn", "X/Twitter", "TikTok", "YouTube"];
const contentTypes = ["Instagram captions", "LinkedIn posts", "Twitter/X threads", "Hashtags", "Carousel text", "Short ad copy", "Campaign ideas", "Reel/video scripts"];

export function GeneratorPage() {
  const { data, refresh } = useAuth();
  const firstWorkspace = data?.workspaces[0]?.id ?? "";
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    workspace_id: firstWorkspace,
    platform: "Instagram" as Platform,
    content_type: "Instagram captions",
    tone: "Premium, clear, conversion-focused",
    goal: "Increase engagement",
    topic: "",
    cta: "Book a discovery call",
    variations: 3,
  });

  async function generate(event: FormEvent) {
    event.preventDefault();
    const workspaceId = form.workspace_id || firstWorkspace;
    if (!workspaceId) return toast.error("Create a workspace first");
    if (!form.topic.trim()) return toast.error("Add a topic");
    setLoading(true);
    try {
      const response = await api.ai.text({ ...form, workspace_id: workspaceId });
      setResult(response.content);
      toast.success(response.mode === "mock" ? "Mock AI response generated" : "Gemini response generated");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page eyebrow="Gemini writer" title="AI text generator">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader><CardTitle>Campaign brief</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={generate} className="grid gap-4">
              <Select value={form.workspace_id || firstWorkspace} onChange={(e) => setForm({ ...form, workspace_id: e.target.value })}>
                {(data?.workspaces ?? []).map((workspace) => <option key={workspace.id} value={workspace.id}>{workspace.brand_name}</option>)}
              </Select>
              <Select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value as Platform })}>{platforms.map((item) => <option key={item}>{item}</option>)}</Select>
              <Select value={form.content_type} onChange={(e) => setForm({ ...form, content_type: e.target.value })}>{contentTypes.map((item) => <option key={item}>{item}</option>)}</Select>
              <Input placeholder="Tone" value={form.tone} onChange={(e) => setForm({ ...form, tone: e.target.value })} />
              <Input placeholder="Goal" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} />
              <Textarea placeholder="Topic, product, campaign angle, or raw idea" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} />
              <Input placeholder="CTA" value={form.cta} onChange={(e) => setForm({ ...form, cta: e.target.value })} />
              <Input type="number" min={1} max={10} value={form.variations} onChange={(e) => setForm({ ...form, variations: Number(e.target.value) })} />
              <Button variant="primary" size="lg" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Generate content</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Generated output</CardTitle>
            {result && <Badge>{result.status}</Badge>}
          </CardHeader>
          <CardContent>
            {loading && <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50 p-8 text-center text-sm font-bold text-indigo-700 dark:border-indigo-400/20 dark:bg-indigo-500/10 dark:text-indigo-200">Generating brand-aware campaign copy...</div>}
            {!loading && result && (
              <div className="space-y-4">
                <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-5 text-sm leading-7 text-white scrollbar-thin">{result.response}</pre>
                <Button variant="outline" onClick={() => { void navigator.clipboard.writeText(result.response); toast.success("Copied"); }}><Copy className="h-4 w-4" /> Copy content</Button>
              </div>
            )}
            {!loading && !result && <div className="rounded-2xl bg-slate-50 p-10 text-center text-sm text-slate-500 dark:bg-white/5">Your generated content will appear here and be saved to the library.</div>}
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
