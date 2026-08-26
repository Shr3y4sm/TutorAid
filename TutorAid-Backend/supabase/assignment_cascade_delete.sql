-- ============================================================
-- Assignment deletes: make child rows cascade automatically so a
-- teacher can always delete an assignment, even after students
-- have submitted. (The service layer also deletes children
-- explicitly; this is defense-in-depth.)
--
-- Run once in the Supabase SQL editor.
-- ============================================================

-- Drop existing plain FK constraints if present, then recreate
-- with ON DELETE CASCADE.
alter table public.assignment_submissions
  drop constraint if exists assignment_submissions_assignment_id_fkey;

alter table public.assignment_submissions
  add constraint assignment_submissions_assignment_id_fkey
  foreign key (assignment_id)
  references public.assignments (id)
  on delete cascade;

alter table public.assignment_students
  drop constraint if exists assignment_students_assignment_id_fkey;

alter table public.assignment_students
  add constraint assignment_students_assignment_id_fkey
  foreign key (assignment_id)
  references public.assignments (id)
  on delete cascade;
