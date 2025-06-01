-- fix-practitioners-columns.sql
-- Adds missing columns to practitioners table based on form submission requirements

-- Add conditions_treated as a text array (since it's a multi-select in the form)
ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS conditions_treated TEXT[];

-- Add session_formats as a text array (since it's a multi-select in the form)
ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS session_formats TEXT[];

-- Add availability_schedule as text field
ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS availability_schedule TEXT;

-- Add calendly_link as text field
ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS calendly_link TEXT;
