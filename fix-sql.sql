-- fix-practitioners-columns.sql
ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS conditions_treated TEXT[];
ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS session_formats TEXT[];
ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS availability_schedule TEXT;
ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS calendly_link TEXT;
