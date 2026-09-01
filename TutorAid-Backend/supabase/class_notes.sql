-- ============================================================
-- Class Notes (in-class pointers)
-- Teachers jot quick notes about a student / the class while a
-- live class is in session. Notes are tied to the meeting's
-- meet_code so no extra session lookup is needed client-side.
--
-- Run this once in the Supabase SQL editor.
-- ============================================================

create table if not exists public.class_notes (
  id          uuid primary key default gen_random_uuid(),
  teacher_id  uuid not null references public.teachers (id) on delete cascade,
  -- Optional: note is about one specific student (per-student record)
  student_id  uuid references public.students (id) on delete set null,
  meet_code   text not null,
  body        text not null,
  created_at  timestamptz not null default now()
);

create index if not exists idx_class_notes_meet
  on public.class_notes (meet_code);

create index if not exists idx_class_notes_student
  on public.class_notes (student_id);

create index if not exists idx_class_notes_teacher
  on public.class_notes (teacher_id);