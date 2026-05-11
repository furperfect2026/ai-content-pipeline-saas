import type { AppData, GeneratedContent, GeneratedImage, ScheduledPost, Workspace } from "@/types";

const API_URL = import.meta.env.VITE_API_URL || "";
const TOKEN_KEY = "aura_jwt";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...options.headers,
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `Request failed: ${response.status}`);
  }
  return payload as T;
}

export const api = {
  auth: {
    signup: (body: { name: string; email: string; password: string }) =>
      request<{ token: string; user: { id: string; email: string; name: string } }>("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    login: (body: { email: string; password: string }) =>
      request<{ token: string; user: { id: string; email: string; name: string } }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    me: () => request<{ user: { id: string; email: string; name: string }; data: AppData }>("/api/auth/me"),
    logout: () => request<{ ok: boolean }>("/api/auth/logout", { method: "POST" }),
  },
  workspaces: {
    list: () => request<{ workspaces: Workspace[] }>("/api/workspaces"),
    create: (body: Partial<Workspace>) => request<{ workspace: Workspace }>("/api/workspaces", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: Partial<Workspace>) =>
      request<{ workspace: Workspace }>(`/api/workspaces/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id: string) => request<{ ok: boolean }>(`/api/workspaces/${id}`, { method: "DELETE" }),
  },
  ai: {
    text: (body: Record<string, unknown>) =>
      request<{ content: GeneratedContent; mode: "gemini" | "mock" }>("/api/ai/generate-text", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    image: (body: Record<string, unknown>) =>
      request<{ image: GeneratedImage; mode: "gemini" | "mock" }>("/api/ai/generate-image", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },
  content: {
    list: () => request<{ contents: GeneratedContent[] }>("/api/content"),
    create: (body: Partial<GeneratedContent>) => request<{ content: GeneratedContent }>("/api/content", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: Partial<GeneratedContent>) =>
      request<{ content: GeneratedContent }>(`/api/content/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id: string) => request<{ ok: boolean }>(`/api/content/${id}`, { method: "DELETE" }),
  },
  schedule: {
    list: () => request<{ scheduledPosts: ScheduledPost[] }>("/api/schedule"),
    create: (body: Partial<ScheduledPost>) => request<{ scheduledPost: ScheduledPost }>("/api/schedule", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: Partial<ScheduledPost>) =>
      request<{ scheduledPost: ScheduledPost }>(`/api/schedule/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id: string) => request<{ ok: boolean }>(`/api/schedule/${id}`, { method: "DELETE" }),
  },
  export: {
    markdown: (body: unknown) => request<{ filename: string; content: string }>("/api/export/markdown", { method: "POST", body: JSON.stringify(body) }),
    json: (body: unknown) => request<{ filename: string; content: string }>("/api/export/json", { method: "POST", body: JSON.stringify(body) }),
    pdf: (body: unknown) => request<{ filename: string; content: string; mime: string }>("/api/export/pdf", { method: "POST", body: JSON.stringify(body) }),
  },
};
