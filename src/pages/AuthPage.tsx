import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, CalendarDays, Image, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

export function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const { login, signup, isSupabaseMode } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!email.includes("@")) return toast.error("Enter a valid email address");
    if (password.length < 8) return toast.error("Password must be at least 8 characters");
    if (mode === "signup" && name.trim().length < 2) return toast.error("Add your name");
    setLoading(true);
    try {
      if (mode === "signup") await signup(name, email, password);
      else await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen aurora-bg lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden p-10 lg:block">
        <div className="flex items-center gap-3 text-lg font-black">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 text-white"><Sparkles className="h-5 w-5" /></span>
          Aura Pipeline
        </div>
        <div className="mt-20 max-w-xl">
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-6xl font-black tracking-tight">
            Your AI campaign studio, already organized.
          </motion.h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">Generate brand-safe content, visual concepts, approvals, and scheduled campaigns from one focused workspace.</p>
        </div>
        <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute bottom-24 left-16 w-72 rounded-3xl bg-white p-5 shadow-2xl dark:bg-slate-900">
          <Image className="h-5 w-5 text-pink-500" />
          <div className="mt-8 rounded-2xl bg-gradient-to-br from-pink-400 to-orange-300 p-4 text-white">
            <div className="text-2xl font-black">Fresh visual generated</div>
            <div className="mt-8 text-sm font-bold">Instagram square poster</div>
          </div>
        </motion.div>
        <motion.div animate={{ y: [0, 14, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute right-16 top-36 w-80 rounded-3xl bg-slate-950 p-5 text-white shadow-2xl">
          <CalendarDays className="h-5 w-5 text-cyan-300" />
          <p className="mt-5 text-sm text-slate-300">Scheduled this week</p>
          <div className="mt-3 grid grid-cols-7 gap-2">{Array.from({ length: 14 }).map((_, i) => <span key={i} className={`h-10 rounded-xl ${i % 4 === 0 ? "bg-cyan-300" : "bg-white/10"}`} />)}</div>
        </motion.div>
      </section>
      <section className="flex items-center justify-center px-5 py-12">
        <motion.form initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="glass w-full max-w-md rounded-[2rem] p-7">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500"><ArrowRight className="h-4 w-4 rotate-180" /> Back home</Link>
          <h2 className="text-3xl font-black">{mode === "signup" ? "Create your workspace" : "Welcome back"}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {mode === "signup" ? "Start with secure email/password auth and a production-ready workspace." : "Login to continue building your content pipeline."}
          </p>
          <div className="mt-6 space-y-4">
            {mode === "signup" && <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" autoComplete="name" />}
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" autoComplete="email" />
            <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} />
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-2xl bg-indigo-50 p-3 text-xs font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200">
            <AlertCircle className="mt-0.5 h-4 w-4" />
            {isSupabaseMode ? "Supabase Auth is active." : "Local JWT auth is active because Supabase env vars are not configured."}
          </div>
          <Button variant="primary" size="lg" className="mt-6 w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signup" ? "Create account" : "Login"}
          </Button>
          <p className="mt-5 text-center text-sm text-slate-500">
            {mode === "signup" ? "Already have an account?" : "New to Aura?"}{" "}
            <Link className="font-bold text-indigo-600" to={mode === "signup" ? "/login" : "/signup"}>
              {mode === "signup" ? "Login" : "Create account"}
            </Link>
          </p>
        </motion.form>
      </section>
    </div>
  );
}
