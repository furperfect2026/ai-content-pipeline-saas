import type { LucideIcon } from "lucide-react";

export function MetricCard({ label, value, delta, icon: Icon }: { label: string; value: string; delta: string; icon: LucideIcon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70 dark:border-white/10 dark:bg-slate-950 dark:hover:shadow-black/20">
      <div className="flex items-center justify-between">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
          <Icon className="h-5 w-5" />
        </div>
        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-500/10">{delta}</span>
      </div>
      <div className="mt-5 text-3xl font-black">{value}</div>
      <div className="text-sm font-medium text-slate-500">{label}</div>
    </div>
  );
}
