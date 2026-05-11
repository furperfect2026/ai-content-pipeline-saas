import { Link, NavLink } from "react-router-dom";
import { BarChart3, CalendarDays, ChevronDown, Image, LayoutDashboard, Library, LogOut, Moon, PenLine, Settings, Sparkles, Sun, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { initials } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/workspaces", label: "Workspaces", icon: Users },
  { to: "/generator", label: "AI Writer", icon: PenLine },
  { to: "/image-generator", label: "Image Studio", icon: Image },
  { to: "/library", label: "Library", icon: Library },
  { to: "/scheduler", label: "Scheduler", icon: CalendarDays },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, data, logout } = useAuth();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-950 dark:bg-[#080b12] dark:text-white">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200/70 bg-white/85 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80 lg:block">
        <Link to="/dashboard" className="flex items-center gap-3 rounded-2xl px-3 py-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/25">
            <Sparkles className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-base font-black">Aura Pipeline</span>
            <span className="text-xs font-medium text-slate-500">AI content OS</span>
          </span>
        </Link>
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Workspace</div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <div>
              <div className="text-sm font-bold">{data?.workspaces[0]?.brand_name ?? "Launch Studio"}</div>
              <div className="text-xs text-slate-500">{data?.workspaces[0]?.industry ?? "Social growth"}</div>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </div>
        </div>
        <nav className="mt-5 space-y-1">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive ? "bg-slate-950 text-white shadow-lg shadow-slate-950/10 dark:bg-white dark:text-slate-950" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/75 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">Command center</div>
              <div className="text-xl font-black">Social Media Content Pipeline</div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setDark((value) => !value)} aria-label="Toggle theme">
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <div className="hidden rounded-2xl border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-white/5 sm:flex sm:items-center sm:gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-indigo-600 to-teal-500 text-sm font-black text-white">
                  {initials(user?.name)}
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-bold">{user?.name}</div>
                  <div className="text-xs text-slate-500">{user?.email}</div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={logout} aria-label="Logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
