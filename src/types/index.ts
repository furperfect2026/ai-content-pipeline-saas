export type Platform = "Instagram" | "LinkedIn" | "X/Twitter" | "TikTok" | "YouTube";
export type ContentStatus = "Draft" | "Approved" | "Scheduled" | "Published";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string | null;
  role?: string;
  created_at?: string;
}

export interface Workspace {
  id: string;
  user_id: string;
  brand_name: string;
  industry: string;
  target_audience: string;
  brand_tone: string;
  brand_description: string;
  brand_colors: string[];
  website?: string;
  social_links?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface GeneratedContent {
  id: string;
  user_id: string;
  workspace_id: string;
  platform: Platform;
  content_type: string;
  tone: string;
  goal: string;
  prompt: string;
  response: string;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface GeneratedImage {
  id: string;
  user_id: string;
  workspace_id: string;
  platform_size: string;
  visual_style: string;
  prompt: string;
  image_url: string;
  status: ContentStatus;
  created_at: string;
}

export interface ScheduledPost {
  id: string;
  user_id: string;
  workspace_id: string;
  content_id?: string;
  title: string;
  platform: Platform;
  scheduled_date: string;
  scheduled_time: string;
  status: ContentStatus;
  created_at: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  prompt: string;
  platform: Platform;
}

export interface AppData {
  workspaces: Workspace[];
  contents: GeneratedContent[];
  images: GeneratedImage[];
  scheduledPosts: ScheduledPost[];
  templates: PromptTemplate[];
}
