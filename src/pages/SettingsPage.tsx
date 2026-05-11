import { ShieldCheck } from "lucide-react";
import { Page } from "@/components/layout/Page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

export function SettingsPage() {
  const { user, isSupabaseMode } = useAuth();
  return (
    <Page eyebrow="Account" title="Settings">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between rounded-2xl bg-slate-50 p-4 dark:bg-white/5"><span>Name</span><strong>{user?.name}</strong></div>
            <div className="flex justify-between rounded-2xl bg-slate-50 p-4 dark:bg-white/5"><span>Email</span><strong>{user?.email}</strong></div>
            <div className="flex justify-between rounded-2xl bg-slate-50 p-4 dark:bg-white/5"><span>Auth mode</span><Badge>{isSupabaseMode ? "Supabase" : "JWT backend"}</Badge></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Security posture</CardTitle></CardHeader>
          <CardContent>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200">
              <ShieldCheck className="h-6 w-6" />
              <h3 className="mt-4 font-black">Server-side AI keys</h3>
              <p className="mt-2 text-sm leading-6">Gemini API keys are read only by the backend. The frontend never receives secrets.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
