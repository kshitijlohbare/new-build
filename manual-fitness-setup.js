#!/usr/bin/env node

console.log(`
🏃 FITNESS GROUPS TABLES SETUP INSTRUCTIONS

Since automated table creation is having network issues, please follow these steps:

1. GO TO SUPABASE DASHBOARD:
   • Open https://supabase.com/dashboard
   • Select your project (svnczxevigicuskppyfz)

2. OPEN SQL EDITOR:
   • Click on "SQL Editor" in the left sidebar
   • Click "New query"

3. COPY AND PASTE THIS SQL:

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
  creator_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fitness_group_members table
CREATE TABLE IF NOT EXISTS public.fitness_group_members (
  id SERIAL PRIMARY KEY,
  group_id INTEGER REFERENCES public.fitness_groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  role VARCHAR(20) DEFAULT 'member' NOT NULL,
  UNIQUE(group_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.fitness_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitness_group_members ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY IF NOT EXISTS read_fitness_groups ON public.fitness_groups
  FOR SELECT USING (TRUE);

CREATE POLICY IF NOT EXISTS create_fitness_groups ON public.fitness_groups
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS update_fitness_groups ON public.fitness_groups
  FOR UPDATE USING (creator_id = auth.uid());

CREATE POLICY IF NOT EXISTS delete_fitness_groups ON public.fitness_groups
  FOR DELETE USING (creator_id = auth.uid());

CREATE POLICY IF NOT EXISTS read_group_members ON public.fitness_group_members
  FOR SELECT USING (TRUE);

CREATE POLICY IF NOT EXISTS join_groups ON public.fitness_group_members
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid());

CREATE POLICY IF NOT EXISTS leave_groups ON public.fitness_group_members
  FOR DELETE USING (user_id = auth.uid());

-- Add sample data
INSERT INTO public.fitness_groups (name, description, location, latitude, longitude, category, meeting_frequency, creator_id) VALUES
('Morning Yoga Warriors', 'Start your day with peaceful yoga sessions in the park. All skill levels welcome!', 'Central Park, Mumbai', 19.0760, 72.8777, 'yoga', 'Mon, Wed, Fri 7:00 AM', '00000000-0000-0000-0000-000000000000'),
('Weekend Hiking Club', 'Explore beautiful trails and connect with nature every weekend. Great workout and fresh air!', 'Sanjay Gandhi National Park', 19.2147, 72.9101, 'hiking', 'Saturdays 6:00 AM', '00000000-0000-0000-0000-000000000000'),
('Beach Running Group', 'Run along the beautiful coastline with a supportive group. Beginner to advanced runners welcome.', 'Juhu Beach, Mumbai', 19.0969, 72.8267, 'running', 'Tue, Thu, Sun 6:30 AM', '00000000-0000-0000-0000-000000000000'),
('Cycling Enthusiasts', 'Join us for scenic cycling routes around the city. Bikes and helmets provided!', 'Marine Drive, Mumbai', 18.9439, 72.8238, 'cycling', 'Weekends 7:00 AM', '00000000-0000-0000-0000-000000000000'),
('Swimming Squad', 'Improve your swimming technique and endurance in a supportive group environment.', 'Olympic Pool Complex', 19.0596, 72.8295, 'swimming', 'Mon, Wed, Fri 6:00 PM', '00000000-0000-0000-0000-000000000000');

4. RUN THE QUERY:
   • Click the "Run" button
   • Wait for completion message

5. VERIFY TABLES:
   • Go to "Table Editor" in left sidebar
   • You should see:
     - fitness_groups table
     - fitness_group_members table

6. TEST THE APPLICATION:
   • The fitness groups feature should now work
   • No more 400/404 errors

✅ After completing these steps, the fitness groups feature will be fully functional!
`);

// Also create a quick verification script
console.log('\n📋 VERIFICATION SCRIPT:');
console.log('After creating the tables, run: node verify-fitness-tables.js');
