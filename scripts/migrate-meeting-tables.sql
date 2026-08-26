-- ============================================================
-- Migration: meeting_sessions + meeting_participants tables
-- Run this in the Supabase SQL editor before using /meetings/*.
--
-- Requirement: "Only students who joined get marked Present —
-- everyone else is left untouched."
--   meeting_sessions     — one row per live class started by a teacher
--   meeting_participants — one row per student who joined a session
-- On meeting end, the backend upserts a "Present" attendance row
-- for every participant ONLY. Non-joiners are never touched.
-- ============================================================

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
