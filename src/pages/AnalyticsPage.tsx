import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Page } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";

export function AnalyticsPage() {
  const { data } = useAuth();
  const platformData = ["Instagram", "LinkedIn", "X/Twitter", "TikTok", "YouTube"].map((platform) => ({
    platform,
    content: (data?.contents ?? []).filter((item) => item.platform === platform).length + Math.floor(Math.random() * 4),
  }));
  const statusData = ["Draft", "Approved", "Scheduled", "Published"].map((status) => ({
    status,
    value: (data?.contents ?? []).filter((item) => item.status === status).length + 1,
  }));

  async function exportData(type: "markdown" | "json" | "pdf") {
    const response = await api.export[type]({ data });
    const href = `data:${"mime" in response ? response.mime : "text/plain"};charset=utf-8,${encodeURIComponent(response.content)}`;
    const link = document.createElement("a");
    link.href = href;
    link.download = response.filename;
    link.click();
    toast.success(`${type.toUpperCase()} export ready`);
  }

  return (
    <Page eyebrow="Insights" title="Analytics and exports" action={<div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => exportData("markdown")}><Download className="h-4 w-4" /> Markdown</Button><Button variant="outline" onClick={() => exportData("json")}>JSON</Button><Button variant="primary" onClick={() => exportData("pdf")}>PDF</Button></div>}>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Content by platform</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="content" radius={[12, 12, 0, 0]} fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Approval workflow</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="status" innerRadius={70} outerRadius={110} paddingAngle={5}>
                  {statusData.map((_, i) => <Cell key={i} fill={["#6366f1", "#14b8a6", "#f97316", "#ec4899"][i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Team collaboration mock UI</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {["Strategist approved LinkedIn set", "Designer requested poster variation", "Client left comment on carousel"].map((item) => (
            <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold dark:bg-white/5">{item}</div>
          ))}
        </CardContent>
      </Card>
    </Page>
  );
}
