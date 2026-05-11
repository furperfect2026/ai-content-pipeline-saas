import { useMemo, useState } from "react";
import { Copy, RefreshCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Page } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";
import type { ContentStatus } from "@/types";

export function LibraryPage() {
  const { data, refresh } = useAuth();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const items = useMemo(() => (data?.contents ?? []).filter((item) => {
    const matchesQuery = `${item.platform} ${item.content_type} ${item.response}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "All" || item.status === status;
    return matchesQuery && matchesStatus;
  }), [data, query, status]);

  async function updateStatus(id: string, next: ContentStatus) {
    await api.content.update(id, { status: next });
    toast.success("Status updated");
    await refresh();
  }

  async function remove(id: string) {
    await api.content.delete(id);
    toast.success("Content deleted");
    await refresh();
  }

  return (
    <Page eyebrow="Repository" title="Content library">
      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_220px]">
        <Input placeholder="Search content, platform, type..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          {["All", "Draft", "Approved", "Scheduled", "Published"].map((item) => <option key={item}>{item}</option>)}
        </Select>
      </div>
      <div className="grid gap-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                <div className="max-w-4xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{item.platform}</Badge><Badge>{item.content_type}</Badge><Badge>{item.status}</Badge>
                  </div>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-200">{item.response}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => { void navigator.clipboard.writeText(item.response); toast.success("Copied"); }}><Copy className="h-4 w-4" /> Copy</Button>
                  <Button variant="outline" size="sm" onClick={() => updateStatus(item.id, item.status === "Draft" ? "Approved" : "Draft")}><RefreshCcw className="h-4 w-4" /> Toggle</Button>
                  <Button variant="danger" size="sm" onClick={() => remove(item.id)}><Trash2 className="h-4 w-4" /> Delete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && <Card><CardContent className="pt-6 text-center text-sm text-slate-500">No content matches your filters.</CardContent></Card>}
      </div>
    </Page>
  );
}
