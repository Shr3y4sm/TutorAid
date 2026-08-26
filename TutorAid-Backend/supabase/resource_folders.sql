-- ============================================================
-- Resource Repository: folder structure
-- Teachers organize resources into nested folders (one tree per
-- teacher). Students get read-only access through the API layer
-- (the server uses the service-role key, so authorization is
-- enforced in Express middleware, not RLS).
--
-- Run this once in the Supabase SQL editor.
-- ============================================================

create table if not exists public.resource_folders (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teachers (id) on delete cascade,
  parent_id uuid references public.resource_folders (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- No two sibling folders with the same name for the same teacher
  unique (teacher_id, parent_id, name)
);

create index if not exists idx_resource_folders_parent
  on public.resource_folders (parent_id);

create index if not exists idx_resource_folders_teacher
  on public.resource_folders (teacher_id);

-- Files live inside folders. Deleting a folder cascades to its
-- sub-folders; files inside fall back to the repository root
-- (folder_id becomes null) so nothing is silently lost.
alter table public.resources
  add column if not exists folder_id uuid
  references public.resource_folders (id) on delete set null;

create index if not exists idx_resources_folder
  on public.resources (folder_id);
