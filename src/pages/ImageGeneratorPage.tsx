import { FormEvent, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Page } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";
import type { GeneratedImage } from "@/types";

export function ImageGeneratorPage() {
  const { data, refresh } = useAuth();
  const [image, setImage] = useState<GeneratedImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    workspace_id: data?.workspaces[0]?.id ?? "",
    platform_size: "Instagram square poster 1080x1080",
    visual_style: "Editorial, premium, bright, modern",
    brand_colors: "#6366f1,#14b8a6,#f97316",
    prompt: "",
  });

  async function generate(event: FormEvent) {
    event.preventDefault();
    const workspaceId = form.workspace_id || data?.workspaces[0]?.id;
    if (!workspaceId) return toast.error("Create a workspace first");
    if (!form.prompt.trim()) return toast.error("Describe the image");
    setLoading(true);
    try {
      const response = await api.ai.image({ ...form, workspace_id: workspaceId });
      setImage(response.image);
      toast.success(response.mode === "mock" ? "Mock poster generated" : "Gemini image generated");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page eyebrow="Visual studio" title="AI image generator">
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader><CardTitle>Visual brief</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={generate} className="grid gap-4">
              <Select value={form.workspace_id || (data?.workspaces[0]?.id ?? "")} onChange={(e) => setForm({ ...form, workspace_id: e.target.value })}>
                {(data?.workspaces ?? []).map((workspace) => <option key={workspace.id} value={workspace.id}>{workspace.brand_name}</option>)}
              </Select>
              <Select value={form.platform_size} onChange={(e) => setForm({ ...form, platform_size: e.target.value })}>
                {["Instagram square poster 1080x1080", "Instagram story 1080x1920", "LinkedIn banner 1584x396", "X/Twitter post visual", "Campaign poster", "Carousel image"].map((item) => <option key={item}>{item}</option>)}
              </Select>
              <Input value={form.visual_style} onChange={(e) => setForm({ ...form, visual_style: e.target.value })} />
              <Input value={form.brand_colors} onChange={(e) => setForm({ ...form, brand_colors: e.target.value })} />
              <Textarea placeholder="Prompt/details" value={form.prompt} onChange={(e) => setForm({ ...form, prompt: e.target.value })} />
              <Button variant="primary" size="lg" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />} Generate image</Button>
            </form>
          </CardContent>
        </Card>
        <div className="grid gap-6">
          <Card>
            <CardHeader><CardTitle>Preview</CardTitle></CardHeader>
            <CardContent>
              <div className="grid min-h-[420px] place-items-center rounded-[2rem] bg-slate-100 p-5 dark:bg-white/5">
                {loading && <div className="text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600" /><p className="mt-4 text-sm font-bold text-slate-500">Rendering poster concept...</p></div>}
                {!loading && image && <img src={image.image_url} alt={image.prompt} className="max-h-[520px] rounded-2xl shadow-2xl" />}
                {!loading && !image && <p className="text-sm text-slate-500">Generated visuals will appear here.</p>}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Image gallery</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(data?.images ?? []).map((item) => <img key={item.id} src={item.image_url} alt={item.prompt} className="aspect-square rounded-2xl object-cover shadow-sm" />)}
              {(data?.images.length ?? 0) === 0 && <div className="rounded-2xl bg-slate-50 p-8 text-center text-sm text-slate-500 dark:bg-white/5 sm:col-span-2 lg:col-span-3">No saved images yet.</div>}
            </CardContent>
          </Card>
        </div>
      </div>
    </Page>
  );
}
