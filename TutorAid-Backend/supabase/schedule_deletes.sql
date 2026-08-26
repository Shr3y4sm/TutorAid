-- ============================================================
-- Schedule deletes: meetings reference scheduled slots.
-- If meeting_sessions.schedule_id has a plain FK to schedule,
-- deleting a slot that ever had a meeting fails with a
-- foreign-key violation. Meetings should survive (unlinked)
-- rather than block deletion.
--
-- Run once in the Supabase SQL editor.
-- ============================================================

alter table public.meeting_sessions
  drop constraint if exists meeting_sessions_schedule_id_fkey;

alter table public.meeting_sessions
  add constraint meeting_sessions_schedule_id_fkey
  foreign key (schedule_id)
  references public.schedule (id)
  on delete set null;
