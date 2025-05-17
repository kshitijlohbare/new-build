-- Schema for community_delights table for Supabase

-- Create the community_delights table
CREATE TABLE IF NOT EXISTS public.community_delights (
  id BIGSERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cheers INTEGER DEFAULT 0,
  
  -- Add constraints as needed
  CONSTRAINT text_not_empty CHECK (LENGTH(TRIM(text)) > 0)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS community_delights_user_id_idx ON public.community_delights(user_id);
CREATE INDEX IF NOT EXISTS community_delights_created_at_idx ON public.community_delights(created_at);

-- Row level security
ALTER TABLE public.community_delights ENABLE ROW LEVEL SECURITY;

-- Policies: Everyone can read, but only the owner can modify their own entries
CREATE POLICY "Everyone can read community delights" 
  ON public.community_delights FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own delights" 
  ON public.community_delights FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own delights" 
  ON public.community_delights FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own delights" 
  ON public.community_delights FOR DELETE 
  USING (auth.uid() = user_id);

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_delights TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.community_delights_id_seq TO authenticated;
