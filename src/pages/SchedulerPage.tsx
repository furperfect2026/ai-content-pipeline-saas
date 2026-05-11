import { FormEvent, useState } from "react";
import { CalendarPlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Page } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";
import type { Platform } from "@/types";

const platforms: Platform[] = ["Instagram", "LinkedIn", "X/Twitter", "TikTok", "YouTube"];

export function SchedulerPage() {
  const { data, refresh } = useAuth();
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [form, setForm] = useState({
    workspace_id: data?.workspaces[0]?.id ?? "",
    content_id: data?.contents[0]?.id ?? "",
    title: "",
    platform: "Instagram" as Platform,
    scheduled_date: new Date().toISOString().slice(0, 10),
    scheduled_time: "09:30",
    status: "Scheduled" as const,
  });

  async function create(event: FormEvent) {
    event.preventDefault();
    const workspaceId = form.workspace_id || data?.workspaces[0]?.id;
    if (!workspaceId) return toast.error("Create a workspace first");
    await api.schedule.create({ ...form, workspace_id: workspaceId, title: form.title || "Scheduled campaign post" });
    toast.success("Post scheduled");
    await refresh();
  }

  async function remove(id: string) {
    await api.schedule.delete(id);
    toast.success("Scheduled post removed");
    await refresh();
  }

  return (
    <Page eyebrow="Planner" title="Scheduling calendar" action={<div className="rounded-2xl bg-white p-1 shadow-sm dark:bg-white/5"><Button variant={view === "calendar" ? "default" : "ghost"} size="sm" onClick={() => setView("calendar")}>Calendar</Button><Button variant={view === "list" ? "default" : "ghost"} size="sm" onClick={() => setView("list")}>List</Button></div>}>
      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <Card>
          <CardHeader><CardTitle>Create scheduled post</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={create} className="grid gap-4">
              <Select value={form.workspace_id || (data?.workspaces[0]?.id ?? "")} onChange={(e) => setForm({ ...form, workspace_id: e.target.value })}>
                {(data?.workspaces ?? []).map((workspace) => <option key={workspace.id} value={workspace.id}>{workspace.brand_name}</option>)}
              </Select>
              <Select value={form.content_id} onChange={(e) => setForm({ ...form, content_id: e.target.value })}>
                <option value="">No linked content</option>
                {(data?.contents ?? []).map((content) => <option key={content.id} value={content.id}>{content.content_type} · {content.platform}</option>)}
              </Select>
              <Input placeholder="Post title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value as Platform })}>{platforms.map((platform) => <option key={platform}>{platform}</option>)}</Select>
              <Input type="date" value={form.scheduled_date} onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })} />
              <Input type="time" value={form.scheduled_time} onChange={(e) => setForm({ ...form, scheduled_time: e.target.value })} />
              <Button variant="primary"><CalendarPlus className="h-4 w-4" /> Add to schedule</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{view === "calendar" ? "Visual calendar" : "Scheduled list"}</CardTitle></CardHeader>
          <CardContent>
            {view === "calendar" ? (
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, index) => {
                  const post = (data?.scheduledPosts ?? [])[index % Math.max(data?.scheduledPosts.length ?? 1, 1)];
                  const show = post && index % 4 === 0;
                  return (
                    <div key={index} className="min-h-28 rounded-2xl border border-slate-200 bg-slate-50 p-2 dark:border-white/10 dark:bg-white/5">
                      <div className="text-xs font-bold text-slate-400">{index + 1}</div>
                      {show && <div draggable className="mt-2 rounded-xl bg-indigo-600 p-2 text-xs font-bold text-white shadow-lg">{post.platform}<br />{post.scheduled_time}</div>}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3">
                {(data?.scheduledPosts ?? []).map((post) => (
                  <div key={post.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4 dark:border-white/10">
                    <div>
                      <div className="font-bold">{post.title}</div>
                      <div className="text-sm text-slate-500">{post.platform} · {post.scheduled_date} · {post.scheduled_time}</div>
                    </div>
                    <div className="flex items-center gap-2"><Badge>{post.status}</Badge><Button variant="ghost" size="icon" onClick={() => remove(post.id)}><Trash2 className="h-4 w-4" /></Button></div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
