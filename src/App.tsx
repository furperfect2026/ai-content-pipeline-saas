import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { AppShell } from "@/components/layout/AppShell";
import { LandingPage } from "@/pages/LandingPage";
import { AuthPage } from "@/pages/AuthPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { WorkspacesPage } from "@/pages/WorkspacesPage";
import { GeneratorPage } from "@/pages/GeneratorPage";
import { ImageGeneratorPage } from "@/pages/ImageGeneratorPage";
import { LibraryPage } from "@/pages/LibraryPage";
import { SchedulerPage } from "@/pages/SchedulerPage";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { SettingsPage } from "@/pages/SettingsPage";

function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center aurora-bg text-sm font-semibold">Loading workspace...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <AppShell>{children}</AppShell>;
}

function PublicAuth({ mode }: { mode: "login" | "signup" }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center aurora-bg text-sm font-semibold">Checking session...</div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return <AuthPage mode={mode} />;
}

export function App() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicAuth mode="login" />} />
        <Route path="/signup" element={<PublicAuth mode="signup" />} />
        <Route path="/forgot-password" element={<PublicAuth mode="login" />} />
        <Route path="/dashboard" element={<Protected><DashboardPage /></Protected>} />
        <Route path="/workspaces" element={<Protected><WorkspacesPage /></Protected>} />
        <Route path="/generator" element={<Protected><GeneratorPage /></Protected>} />
        <Route path="/image-generator" element={<Protected><ImageGeneratorPage /></Protected>} />
        <Route path="/library" element={<Protected><LibraryPage /></Protected>} />
        <Route path="/scheduler" element={<Protected><SchedulerPage /></Protected>} />
        <Route path="/analytics" element={<Protected><AnalyticsPage /></Protected>} />
        <Route path="/settings" element={<Protected><SettingsPage /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
