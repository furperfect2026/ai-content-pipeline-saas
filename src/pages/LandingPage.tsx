import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CalendarCheck, Check, Image, Layers3, MessageSquareText, Sparkles, WandSparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const floatingPosts = [
  { platform: "Instagram", title: "Launch week teaser", color: "from-pink-500 to-orange-400", stat: "+38% saves" },
  { platform: "LinkedIn", title: "Founder story post", color: "from-sky-500 to-blue-600", stat: "12.4k reach" },
  { platform: "X Thread", title: "Feature narrative", color: "from-slate-700 to-slate-950", stat: "7 posts" },
];

const features = [
  { icon: WandSparkles, title: "Gemini AI writing", copy: "Captions, threads, carousels, scripts, hashtags, ad copy, and campaign concepts with brand-aware prompt templates." },
  { icon: Image, title: "Poster studio", copy: "Generate social visuals, save galleries, and keep brand colors consistent across sizes and platforms." },
  { icon: CalendarCheck, title: "Visual scheduler", copy: "Plan drafts, approvals, and scheduled campaigns across Instagram, LinkedIn, X, TikTok, and YouTube." },
  { icon: Layers3, title: "Workspace memory", copy: "Store brand voice, target audience, colors, links, and reusable campaign context per client or project." },
];

export function LandingPage() {
  return (
    <div className="min-h-screen aurora-bg text-slate-950 dark:text-white">
      <header className="sticky top-0 z-30 border-b border-white/50 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-3 font-black">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/25">
              <Sparkles className="h-5 w-5" />
            </span>
            Aura Pipeline
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 dark:text-slate-300 md:flex">
            <a href="#features">Features</a>
            <a href="#workflow">Workflow</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => (window.location.href = "/login")}>Login</Button>
            <Button variant="primary" onClick={() => (window.location.href = "/signup")}>Start free</Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden px-5 py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.95fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/70 px-4 py-2 text-sm font-bold text-indigo-700 shadow-sm dark:border-indigo-400/20 dark:bg-white/5 dark:text-indigo-200">
              <Zap className="h-4 w-4" /> Gemini-powered campaign pipeline
            </div>
            <h1 className="mt-6 max-w-4xl text-balance text-5xl font-black tracking-tight md:text-7xl">
              Create, approve, schedule, and export social content in one AI workspace.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              A premium SaaS command center for businesses, creators, and marketing teams that need campaign-ready posts, visuals, history, scheduling, and exports without duct-taping five tools together.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="primary" size="lg" onClick={() => (window.location.href = "/signup")}>
                Build my first campaign <ArrowRight className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => (window.location.href = "/login")}>View dashboard</Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="relative min-h-[560px]">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-4 shadow-2xl shadow-indigo-900/20">
              <div className="h-full rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Live campaign</p>
                    <h3 className="text-2xl font-black text-white">Summer Launch OS</h3>
                  </div>
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-200">AI drafting</span>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white p-4 text-slate-950">
                    <MessageSquareText className="h-5 w-5 text-indigo-600" />
                    <p className="mt-4 text-sm font-bold">LinkedIn thought leadership</p>
                    <p className="mt-2 text-xs text-slate-500">Generated 3 executive variations with softer CTA.</p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-pink-400 to-orange-300 p-4 text-white">
                    <p className="text-xs font-bold">Poster Preview</p>
                    <div className="mt-10 rounded-xl bg-white/20 p-3 text-sm font-black backdrop-blur">New drop, same brand magic.</div>
                  </div>
                </div>
                <div className="mt-5 rounded-2xl bg-white/10 p-4 text-white">
                  <div className="mb-3 flex items-center justify-between text-sm font-bold">
                    <span>Publishing calendar</span>
                    <span>14 posts</span>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 21 }).map((_, index) => (
                      <div key={index} className={`h-12 rounded-xl ${[3, 5, 8, 12, 14, 18].includes(index) ? "bg-cyan-300" : "bg-white/10"}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {floatingPosts.map((post, index) => (
              <motion.div
                key={post.platform}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute ${index === 0 ? "-left-3 top-12" : index === 1 ? "-right-4 top-56" : "bottom-10 left-10"} w-56 rounded-2xl bg-gradient-to-br ${post.color} p-4 text-white shadow-2xl`}
              >
                <p className="text-xs font-bold uppercase tracking-[0.18em] opacity-80">{post.platform}</p>
                <p className="mt-5 text-lg font-black">{post.title}</p>
                <p className="mt-3 text-sm font-semibold opacity-90">{post.stat}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="features" className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-500">Product system</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">Everything a modern content team expects.</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/5">
                <feature.icon className="h-6 w-6 text-indigo-600" />
                <h3 className="mt-5 text-lg font-black">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{feature.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="px-5 py-20">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/20 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Workflow</p>
              <h2 className="mt-3 text-4xl font-black">From brand brief to exportable campaign.</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {["Create workspace", "Generate content", "Approve and schedule"].map((step, index) => (
                <div key={step} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-sm font-black text-slate-950">{index + 1}</span>
                  <h3 className="mt-5 font-black">{step}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">Brand-aware context, production controls, and a clean handoff path for stakeholders.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-4xl font-black">Pricing that scales with output.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {["Creator", "Team", "Studio"].map((plan, index) => (
              <div key={plan} className={`rounded-2xl border p-6 shadow-sm ${index === 1 ? "border-indigo-300 bg-slate-950 text-white shadow-2xl shadow-indigo-950/20" : "border-slate-200 bg-white dark:border-white/10 dark:bg-white/5"}`}>
                <h3 className="text-xl font-black">{plan}</h3>
                <div className="mt-4 text-4xl font-black">${[19, 59, 149][index]}<span className="text-sm font-semibold opacity-60">/mo</span></div>
                <div className="mt-6 space-y-3 text-sm">
                  {["AI text generation", "Image gallery", "Scheduling workspace", "Campaign exports"].map((item) => (
                    <div key={item} className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> {item}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {["Feels like our content strategist and designer finally share one brain.", "The approval board alone saves us hours every week.", "Mock mode let our dev team demo before production Gemini keys were ready."].map((quote) => (
            <div key={quote} className="rounded-2xl border border-slate-200 bg-white p-6 text-lg font-bold shadow-sm dark:border-white/10 dark:bg-white/5">"{quote}"</div>
          ))}
        </div>
      </section>

      <section id="faq" className="px-5 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-4xl font-black">FAQ</h2>
          <div className="mt-8 space-y-3">
            {["Are Gemini keys exposed?", "Can I use Supabase Auth?", "Does posting go live automatically?"].map((q, i) => (
              <details key={q} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
                <summary className="cursor-pointer font-black">{q}</summary>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {i === 0 ? "No. Gemini calls are server-side only." : i === 1 ? "Yes. Add Supabase URL and anon key; otherwise the secure local JWT backend works for development." : "Scheduling is visual planning only; direct posting is intentionally out of scope."}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white/70 px-5 py-10 dark:border-white/10 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="font-black">Aura Pipeline AI</div>
          <div className="flex items-center gap-5 text-sm font-semibold text-slate-500">
            <span>Privacy</span><span>Terms</span><span>Security</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
