-- Create optimized user_practices table if it doesn't exist
-- This SQL can be run in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.user_practices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  practices_data JSONB NOT NULL DEFAULT '{"practices": [], "progress": {"totalPoints": 0, "level": 1, "streakDays": 0, "totalCompleted": 0, "achievements": []}}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Add a unique constraint on user_id to ensure one row per user
  CONSTRAINT user_practices_user_id_key UNIQUE (user_id)
);

-- Add appropriate indexes
CREATE INDEX IF NOT EXISTS idx_user_practices_user_id ON public.user_practices(user_id);

-- Add RLS policies for security
ALTER TABLE public.user_practices ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see and modify their own practice data
CREATE POLICY "Users can view their own practices"
  ON public.user_practices
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own practices"
  ON public.user_practices
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own practices"
  ON public.user_practices
  FOR UPDATE
  USING (auth.uid() = user_id);
