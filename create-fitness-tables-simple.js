#!/usr/bin/env node

import { supabase } from './src/lib/supabase.js';

async function createFitnessTables() {
  try {
    console.log('🏃 Creating fitness groups tables...');
    
    // First, try to test if tables already exist
    const { data: existingGroups, error: existingError } = await supabase
      .from('fitness_groups')
      .select('id')
      .limit(1);
    
    if (!existingError) {
      console.log('✅ Tables already exist!');
      return true;
    }
    
    console.log('📊 Tables don\'t exist, we need to create them manually...');
    console.log('');
    console.log('🔧 MANUAL SETUP REQUIRED:');
    console.log('');
    console.log('1. Open Supabase Dashboard: https://supabase.com/dashboard');
    console.log('2. Go to SQL Editor');
    console.log('3. Create a new query and paste this SQL:');
    console.log('');
    console.log('-- Create fitness_groups table');
    console.log(`CREATE TABLE public.fitness_groups (
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
CREATE TABLE public.fitness_group_members (
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

-- Create policies
CREATE POLICY read_fitness_groups ON public.fitness_groups FOR SELECT USING (TRUE);
CREATE POLICY create_fitness_groups ON public.fitness_groups FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY update_fitness_groups ON public.fitness_groups FOR UPDATE USING (creator_id = auth.uid());
CREATE POLICY delete_fitness_groups ON public.fitness_groups FOR DELETE USING (creator_id = auth.uid());

CREATE POLICY read_group_members ON public.fitness_group_members FOR SELECT USING (TRUE);
CREATE POLICY join_groups ON public.fitness_group_members FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid());
CREATE POLICY leave_groups ON public.fitness_group_members FOR DELETE USING (user_id = auth.uid());

-- Add sample data
INSERT INTO public.fitness_groups (name, description, location, latitude, longitude, category, meeting_frequency, creator_id) VALUES
('Morning Yoga Warriors', 'Start your day with peaceful yoga sessions in the park. All skill levels welcome!', 'Central Park, Mumbai', 19.0760, 72.8777, 'yoga', 'Mon, Wed, Fri 7:00 AM', '00000000-0000-0000-0000-000000000000'),
('Weekend Hiking Club', 'Explore beautiful trails and connect with nature every weekend. Great workout and fresh air!', 'Sanjay Gandhi National Park', 19.2147, 72.9101, 'hiking', 'Saturdays 6:00 AM', '00000000-0000-0000-0000-000000000000'),
('Beach Running Group', 'Run along the beautiful coastline with a supportive group. Beginner to advanced runners welcome.', 'Juhu Beach, Mumbai', 19.0969, 72.8267, 'running', 'Tue, Thu, Sun 6:30 AM', '00000000-0000-0000-0000-000000000000');`);
    
    console.log('');
    console.log('4. Run the query');
    console.log('5. After success, run: node verify-fitness-tables.js');
    console.log('');
    console.log('⚠️  The fitness groups feature will not work until these tables are created manually.');
    
    return false;
    
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

createFitnessTables()
  .then(success => {
    if (success) {
      console.log('🎉 Fitness groups tables are ready!');
    } else {
      console.log('📋 Manual setup required - see instructions above.');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Script error:', error);
    process.exit(1);
  });
