import { FormEvent, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Page } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";

export function WorkspacesPage() {
  const { data, refresh } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    brand_name: "",
    industry: "",
    target_audience: "",
    brand_tone: "Confident, warm, concise",
    brand_description: "",
    brand_colors: "#6366f1,#14b8a6,#f97316",
    website: "",
    social_links: "",
  });

  async function createWorkspace(event: FormEvent) {
    event.preventDefault();
    if (!form.brand_name.trim()) return toast.error("Brand name is required");
    setSaving(true);
    try {
      await api.workspaces.create({ ...form, brand_colors: form.brand_colors.split(",").map((color) => color.trim()) });
      toast.success("Workspace created");
      setForm({ ...form, brand_name: "", industry: "", target_audience: "", brand_description: "", website: "", social_links: "" });
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create workspace");
    } finally {
      setSaving(false);
    }
  }

  async function deleteWorkspace(id: string) {
    await api.workspaces.delete(id);
    toast.success("Workspace deleted");
    await refresh();
  }

  return (
    <Page eyebrow="Brand memory" title="Workspaces">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Create brand workspace</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createWorkspace} className="grid gap-4">
              <Input placeholder="Brand name" value={form.brand_name} onChange={(e) => setForm({ ...form, brand_name: e.target.value })} />
              <Input placeholder="Industry" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
              <Input placeholder="Target audience" value={form.target_audience} onChange={(e) => setForm({ ...form, target_audience: e.target.value })} />
              <Input placeholder="Brand tone" value={form.brand_tone} onChange={(e) => setForm({ ...form, brand_tone: e.target.value })} />
              <Textarea placeholder="Brand description" value={form.brand_description} onChange={(e) => setForm({ ...form, brand_description: e.target.value })} />
              <Input placeholder="Brand colors, comma separated" value={form.brand_colors} onChange={(e) => setForm({ ...form, brand_colors: e.target.value })} />
              <Input placeholder="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              <Input placeholder="Social links" value={form.social_links} onChange={(e) => setForm({ ...form, social_links: e.target.value })} />
              <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-center text-sm font-semibold text-slate-500 dark:border-white/15">Logo upload placeholder</div>
              <Button variant="primary" disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Save workspace</Button>
            </form>
          </CardContent>
        </Card>
        <div className="grid gap-4">
          {(data?.workspaces ?? []).map((workspace) => (
            <Card key={workspace.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-black">{workspace.brand_name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{workspace.brand_description || "No description yet."}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {workspace.brand_colors.map((color) => <span key={color} className="h-8 w-8 rounded-full border border-slate-200" style={{ background: color }} />)}
                    </div>
                    <div className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-300">{workspace.industry} · {workspace.target_audience}</div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteWorkspace(workspace.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {(data?.workspaces.length ?? 0) === 0 && <Card><CardContent className="pt-6 text-center text-sm text-slate-500">Create a workspace to unlock brand-aware AI generation.</CardContent></Card>}
        </div>
      </div>
    </Page>
  );
}
