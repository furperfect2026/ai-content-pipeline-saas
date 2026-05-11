import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import { api, setToken, getToken } from "@/services/api";
import type { AppData, UserProfile } from "@/types";

type AuthContextValue = {
  user: UserProfile | null;
  data: AppData | null;
  loading: boolean;
  isSupabaseMode: boolean;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase: SupabaseClient | null = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

function emptyData(): AppData {
  return { workspaces: [], contents: [], images: [], scheduledPosts: [], templates: [] };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const isSupabaseMode = Boolean(supabase);

  const refresh = async () => {
    if (supabase) {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      const sessionUser = session?.user;
      if (!sessionUser) {
        setToken(null);
        setUser(null);
        setData(emptyData());
        return;
      }
      setToken(session.access_token);
      const profile = {
        id: sessionUser.id,
        email: sessionUser.email ?? "",
        name: sessionUser.user_metadata?.name ?? sessionUser.email?.split("@")[0] ?? "Creator",
      };
      setUser(profile);
      const response = await api.auth.me().catch(() => null);
      setData(response?.data ?? emptyData());
      return;
    }

    if (!getToken()) {
      setUser(null);
      setData(emptyData());
      return;
    }
    const response = await api.auth.me();
    setUser(response.user);
    setData(response.data);
  };

  useEffect(() => {
    refresh()
      .catch(() => {
        setToken(null);
        setUser(null);
        setData(emptyData());
      })
      .finally(() => setLoading(false));

    if (!supabase) return undefined;
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      void refresh();
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      data,
      loading,
      isSupabaseMode,
      refresh,
      login: async (email, password) => {
        if (supabase) {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          await refresh();
          toast.success("Welcome back");
          return;
        }
        const response = await api.auth.login({ email, password });
        setToken(response.token);
        setUser(response.user);
        await refresh();
        toast.success("Welcome back");
      },
      signup: async (name, email, password) => {
        if (supabase) {
          const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
          if (error) throw error;
          await refresh();
          toast.success("Account created");
          return;
        }
        const response = await api.auth.signup({ name, email, password });
        setToken(response.token);
        setUser(response.user);
        await refresh();
        toast.success("Account created");
      },
      logout: async () => {
        if (supabase) await supabase.auth.signOut();
        else {
          await api.auth.logout().catch(() => undefined);
          setToken(null);
        }
        setUser(null);
        setData(emptyData());
        toast.success("Logged out");
      },
    }),
    [user, data, loading, isSupabaseMode],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
