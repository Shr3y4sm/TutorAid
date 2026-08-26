ALTER TABLE public.assignment_submissions
  ADD COLUMN IF NOT EXISTS content text;