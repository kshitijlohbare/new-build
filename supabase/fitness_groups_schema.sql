-- Create fitness_groups table
CREATE TABLE IF NOT EXISTS public.fitness_groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  latitude FLOAT,
  longitude FLOAT,
  category VARCHAR(50) NOT NULL,
  meeting_frequency VARCHAR(255),
  creator_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fitness_group_members table
CREATE TABLE IF NOT EXISTS public.fitness_group_members (
  id SERIAL PRIMARY KEY,
  group_id INTEGER REFERENCES public.fitness_groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  role VARCHAR(20) DEFAULT 'member' NOT NULL,
  UNIQUE(group_id, user_id)
);

-- Create fitness_group_events table (optional for future)
CREATE TABLE IF NOT EXISTS public.fitness_group_events (
  id SERIAL PRIMARY KEY,
  group_id INTEGER REFERENCES public.fitness_groups(id) ON DELETE CASCADE NOT NULL,
  creator_id UUID REFERENCES auth.users(id) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  latitude FLOAT,
  longitude FLOAT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_fitness_groups_creator ON public.fitness_groups(creator_id);
CREATE INDEX IF NOT EXISTS idx_fitness_group_members_user ON public.fitness_group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_fitness_group_members_group ON public.fitness_group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_fitness_group_events_group ON public.fitness_group_events(group_id);

-- Create function to automatically update updated_at columns
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating updated_at columns
CREATE TRIGGER update_fitness_groups_updated_at
BEFORE UPDATE ON public.fitness_groups
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_fitness_group_events_updated_at
BEFORE UPDATE ON public.fitness_group_events
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Example row level security policies
-- Enable RLS on tables
ALTER TABLE public.fitness_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitness_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitness_group_events ENABLE ROW LEVEL SECURITY;

-- Policy for reading fitness groups (anyone can read all groups)
CREATE POLICY read_fitness_groups ON public.fitness_groups
  FOR SELECT USING (TRUE);

-- Policy for creating fitness groups (authenticated users only)
CREATE POLICY create_fitness_groups ON public.fitness_groups
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy for updating fitness groups (only creator can update)
CREATE POLICY update_fitness_groups ON public.fitness_groups
  FOR UPDATE USING (creator_id = auth.uid());

-- Policy for deleting fitness groups (only creator can delete)
CREATE POLICY delete_fitness_groups ON public.fitness_groups
  FOR DELETE USING (creator_id = auth.uid());

-- Policy for reading group members (anyone can read)
CREATE POLICY read_group_members ON public.fitness_group_members
  FOR SELECT USING (TRUE);

-- Policy for joining groups (authenticated users only)
CREATE POLICY join_groups ON public.fitness_group_members
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid());

-- Policy for leaving groups (only the member can remove themselves)
CREATE POLICY leave_groups ON public.fitness_group_members
  FOR DELETE USING (user_id = auth.uid());

-- Policy for reading group events (anyone can read)
CREATE POLICY read_group_events ON public.fitness_group_events
  FOR SELECT USING (TRUE);

-- Policy for creating events (authenticated users who are group members)
CREATE POLICY create_group_events ON public.fitness_group_events
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM public.fitness_group_members
      WHERE user_id = auth.uid() AND group_id = NEW.group_id
    )
  );

-- Policy for updating events (only creator can update)
CREATE POLICY update_group_events ON public.fitness_group_events
  FOR UPDATE USING (creator_id = auth.uid());

-- Policy for deleting events (only creator can delete)
CREATE POLICY delete_group_events ON public.fitness_group_events
  FOR DELETE USING (creator_id = auth.uid());
