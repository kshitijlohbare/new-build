-- fix-practitioners-schema-complete.sql
-- Adds ALL missing columns to practitioners table for complete onboarding form support

-- Add user_id column (required for linking to auth.users)
ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add bio column (required for practitioner description)
ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add years_experience column 
ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS years_experience INTEGER;

-- Add languages column as text array
ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT '{"English"}';

-- Add approach column (therapeutic approach)
ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS approach TEXT;

-- Add certifications column
ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS certifications TEXT;

-- Add insurance_accepted column as text array
ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS insurance_accepted TEXT[] DEFAULT '{}';

-- Add session_format column as text array (note: using singular form to match form)
ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS session_format TEXT[] DEFAULT '{"Individual Therapy"}';

-- Add availability column (note: using singular form to match form)
ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS availability TEXT;

-- Add updated_at column if not exists
ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS practitioners_user_id_idx ON public.practitioners(user_id);

-- Update existing calendly_link column to ensure it exists
ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS calendly_link TEXT;
