-- ============================================================
-- ONE-CLICK FIX FOR THE LIVE DATABASE
-- ============================================================
-- Proven missing by the automated E2E test (13 PASS / 5 FAIL; all 5
-- failures are "schema cache" errors for the objects below).
--
-- Run this ENTIRE block once in the Supabase SQL editor.
-- It is idempotent (safe to re-run).
-- ============================================================

-- ------------------------------------------------------------------
-- 1) Live class sessions + participants (fixes "Class History")
-- ------------------------------------------------------------------
create table if not exists meeting_sessions (
  id          uuid primary key default gen_random_uuid(),
  teacher_id  uuid not null,
  schedule_id uuid,
  subject     text,
  meet_code   text unique not null,
  status      text not null default 'live' check (status in ('live','ended')),
  started_at  timestamp with time zone default now(),
  ended_at    timestamp with time zone,
  created_at  timestamp with time zone default now()
);

create table if not exists meeting_participants (
  id         uuid primary key default gen_random_uuid(),
  session_id uuid not null references meeting_sessions(id) on delete cascade,
  student_id uuid not null,
  joined_at  timestamp with time zone default now(),
  left_at    timestamp with time zone,
  unique (session_id, student_id)
);

create index if not exists idx_mp_session on meeting_participants(session_id);
create index if not exists idx_mp_student on meeting_participants(student_id);

-- ------------------------------------------------------------------
-- 2) Class notes (in-class pointers)
-- ------------------------------------------------------------------
create table if not exists class_notes (
  id          uuid primary key default gen_random_uuid(),
  teacher_id  uuid not null references teachers(id) on delete cascade,
  student_id  uuid references students(id) on delete set null,
  meet_code   text not null,
  body        text not null,
  created_at  timestamptz not null default now()
);

create index if not exists idx_class_notes_meet on class_notes (meet_code);
create index if not exists idx_class_notes_student on class_notes (student_id);
create index if not exists idx_class_notes_teacher on class_notes (teacher_id);

-- ------------------------------------------------------------------
-- 3) attendance.class_date — the entire backend writes/reads class_date,
--    but the live table only has attendance_date. Add + backfill so
--    attendance marking and meeting auto-marking stop 500ing.
-- ------------------------------------------------------------------
alter table attendance add column if not exists class_date date;

-- Backfill from existing attendance_date values
update attendance
   set class_date = attendance_date
 where class_date is null
   and attendance_date is not null;

-- De-duplicate so the unique index below can be created
delete from attendance a
 using attendance b
where a.student_id = b.student_id
  and coalesce(a.class_date, a.attendance_date) = coalesce(b.class_date, b.attendance_date)
  and a.created_at < b.created_at;

-- The API upserts with onConflict "student_id,class_date", so a unique
-- index on those two columns is required.
create unique index if not exists attendance_student_class_unique
  on attendance (student_id, class_date);

-- Common lookup index
create index if not exists idx_attendance_student
  on attendance (student_id);