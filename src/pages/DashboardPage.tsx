import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { CalendarDays, CheckCircle2, Image, MessageSquareText, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Page } from "@/components/layout/Page";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { formatCompactDate } from "@/lib/utils";

const chart = [
  { day: "Mon", posts: 12 },
  { day: "Tue", posts: 18 },
  { day: "Wed", posts: 15 },
  { day: "Thu", posts: 26 },
  { day: "Fri", posts: 31 },
  { day: "Sat", posts: 22 },
  { day: "Sun", posts: 36 },
];

export function DashboardPage() {
  const { data } = useAuth();
  const contents = data?.contents ?? [];
  const scheduled = data?.scheduledPosts ?? [];
  const images = data?.images ?? [];

  return (
    <Page
      eyebrow="Overview"
      title="AI campaign dashboard"
      action={<Button variant="primary" onClick={() => (window.location.href = "/generator")}><Sparkles className="h-4 w-4" /> Quick generate</Button>}
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Generated posts" value={String(contents.length)} delta="+24%" icon={MessageSquareText} />
        <MetricCard label="AI visuals" value={String(images.length)} delta="+18%" icon={Image} />
        <MetricCard label="Scheduled items" value={String(scheduled.length)} delta="+12%" icon={CalendarDays} />
        <MetricCard label="Approval rate" value="82%" delta="+9%" icon={CheckCircle2} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.9fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Publishing momentum</CardTitle>
            <Badge>Live preview</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chart}>
                  <defs>
                    <linearGradient id="posts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="posts" stroke="#6366f1" fill="url(#posts)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendar preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 28 }).map((_, index) => {
                const active = scheduled[index % Math.max(scheduled.length, 1)];
                return <div key={index} className={`aspect-square rounded-xl border text-xs ${active && index % 5 === 0 ? "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-400/30 dark:bg-indigo-500/10" : "border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5"}`} />;
              })}
            </div>
            <div className="mt-5 space-y-3">
              {scheduled.slice(0, 3).map((post) => (
                <div key={post.id} className="rounded-2xl bg-slate-50 p-3 dark:bg-white/5">
                  <div className="text-sm font-bold">{post.title}</div>
                  <div className="text-xs text-slate-500">{post.platform} · {formatCompactDate(post.scheduled_date)} at {post.scheduled_time}</div>
                </div>
              ))}
              {scheduled.length === 0 && <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-white/5">No scheduled posts yet.</div>}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent AI generations</CardTitle>
            <Link className="text-sm font-bold text-indigo-600" to="/library">View library</Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {contents.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 p-4 dark:border-white/10">
                <div>
                  <div className="font-bold">{item.content_type}</div>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">{item.response}</p>
                </div>
                <Badge>{item.status}</Badge>
              </div>
            ))}
            {contents.length === 0 && <div className="rounded-2xl bg-slate-50 p-8 text-center text-sm text-slate-500 dark:bg-white/5">Generate your first campaign from the AI Writer.</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button variant="outline" onClick={() => (window.location.href = "/workspaces")}>Create workspace</Button>
            <Button variant="outline" onClick={() => (window.location.href = "/image-generator")}>Generate poster</Button>
            <Button variant="outline" onClick={() => (window.location.href = "/scheduler")}>Plan calendar</Button>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
