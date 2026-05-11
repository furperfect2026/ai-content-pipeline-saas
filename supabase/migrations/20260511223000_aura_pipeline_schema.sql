create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null,
  avatar_url text,
  role text default 'owner',
  created_at timestamptz default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  brand_name text not null,
  industry text,
  target_audience text,
  brand_tone text,
  brand_description text,
  brand_colors text[] default array['#6366f1', '#14b8a6', '#f97316'],
  website text,
  social_links text,
  logo_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.generated_contents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete cascade,
  platform text not null,
  content_type text not null,
  tone text,
  goal text,
  prompt text not null,
  response text not null,
  status text default 'Draft' check (status in ('Draft', 'Approved', 'Scheduled', 'Published')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.generated_images (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete cascade,
  platform_size text not null,
  visual_style text,
  prompt text not null,
  image_url text not null,
  status text default 'Draft' check (status in ('Draft', 'Approved', 'Scheduled', 'Published')),
  created_at timestamptz default now()
);

create table if not exists public.scheduled_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete cascade,
  content_id uuid references public.generated_contents(id) on delete set null,
  platform text not null,
  scheduled_date date not null,
  scheduled_time time not null,
  status text default 'Scheduled' check (status in ('Draft', 'Approved', 'Scheduled', 'Published')),
  created_at timestamptz default now()
);

create table if not exists public.prompt_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  category text not null,
  prompt text not null,
  platform text not null,
  created_at timestamptz default now()
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text default 'editor',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.generated_contents enable row level security;
alter table public.generated_images enable row level security;
alter table public.scheduled_posts enable row level security;
alter table public.prompt_templates enable row level security;
alter table public.team_members enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

create policy "workspaces_owner_all" on public.workspaces for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "contents_owner_all" on public.generated_contents for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "images_owner_all" on public.generated_images for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "schedule_owner_all" on public.scheduled_posts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "templates_owner_or_global" on public.prompt_templates for select using (user_id is null or auth.uid() = user_id);
create policy "templates_owner_write" on public.prompt_templates for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
