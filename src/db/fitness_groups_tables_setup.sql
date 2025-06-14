-- SQL to create the necessary tables for the Fitness Groups feature

-- Create fitness groups table
CREATE TABLE IF NOT EXISTS public.fitness_groups (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  location_coordinates JSONB, -- Stores latitude and longitude
  member_count INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  meeting_frequency TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create fitness group members junction table
CREATE TABLE IF NOT EXISTS public.fitness_group_members (
  id SERIAL PRIMARY KEY,
  group_id INTEGER REFERENCES public.fitness_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  role TEXT DEFAULT 'member', -- 'admin' or 'member'
  UNIQUE(group_id, user_id) -- Prevent duplicate memberships
);

-- Create fitness group events table
CREATE TABLE IF NOT EXISTS public.fitness_group_events (
  id SERIAL PRIMARY KEY,
  group_id INTEGER REFERENCES public.fitness_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  location_coordinates JSONB, -- Stores latitude and longitude
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create trigger to update member count when members join or leave
CREATE OR REPLACE FUNCTION update_fitness_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.fitness_groups 
    SET member_count = member_count + 1 
    WHERE id = NEW.group_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.fitness_groups 
    SET member_count = member_count - 1 
    WHERE id = OLD.group_id AND member_count > 0;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS fitness_group_member_count_trigger ON public.fitness_group_members;
CREATE TRIGGER fitness_group_member_count_trigger
AFTER INSERT OR DELETE ON public.fitness_group_members
FOR EACH ROW
EXECUTE FUNCTION update_fitness_group_member_count();

-- Apply Row Level Security (RLS) policies
-- Enable RLS on the tables
ALTER TABLE public.fitness_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitness_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitness_group_events ENABLE ROW LEVEL SECURITY;

-- Create policy for fitness_groups - Anyone can view, only creator can modify
CREATE POLICY fitness_groups_select_policy ON public.fitness_groups 
  FOR SELECT USING (true);
  
CREATE POLICY fitness_groups_insert_policy ON public.fitness_groups 
  FOR INSERT WITH CHECK (auth.uid() = creator_id);
  
CREATE POLICY fitness_groups_update_policy ON public.fitness_groups 
  FOR UPDATE USING (auth.uid() = creator_id);
  
CREATE POLICY fitness_groups_delete_policy ON public.fitness_groups 
  FOR DELETE USING (auth.uid() = creator_id);

-- Create policy for fitness_group_members - Members can see their own memberships
CREATE POLICY fitness_group_members_select_policy ON public.fitness_group_members 
  FOR SELECT USING (true);
  
CREATE POLICY fitness_group_members_insert_policy ON public.fitness_group_members 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY fitness_group_members_delete_policy ON public.fitness_group_members 
  FOR DELETE USING (auth.uid() = user_id);

-- Create policy for fitness_group_events - Anyone can view, only group admins can modify
CREATE POLICY fitness_group_events_select_policy ON public.fitness_group_events 
  FOR SELECT USING (true);
  
CREATE POLICY fitness_group_events_insert_policy ON public.fitness_group_events 
  FOR INSERT WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM public.fitness_group_members 
      WHERE group_id = NEW.group_id AND user_id = auth.uid() AND role = 'admin'
    )
  );
  
CREATE POLICY fitness_group_events_update_policy ON public.fitness_group_events 
  FOR UPDATE USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM public.fitness_group_members 
      WHERE group_id = OLD.group_id AND user_id = auth.uid() AND role = 'admin'
    )
  );
  
CREATE POLICY fitness_group_events_delete_policy ON public.fitness_group_events 
  FOR DELETE USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM public.fitness_group_members 
      WHERE group_id = OLD.group_id AND user_id = auth.uid() AND role = 'admin'
    )
  );

-- Grant access to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fitness_groups TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fitness_group_members TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fitness_group_events TO authenticated;

-- Grant usage on sequences
GRANT USAGE, SELECT ON SEQUENCE public.fitness_groups_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.fitness_group_members_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.fitness_group_events_id_seq TO authenticated;
