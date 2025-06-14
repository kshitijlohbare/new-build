#!/usr/bin/env node

import { supabase } from './src/lib/supabase.js';

async function createFitnessTables() {
  try {
    console.log('🏃 Creating fitness groups tables...');
    
    // Create fitness_groups table
    console.log('Creating fitness_groups table...');
    
    const createGroupsTable = `
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
    `;
    
    // Note: We can't use direct SQL execution, so we'll need to use Supabase's client methods
    // Let's try creating the table structure manually by inserting a dummy record first
    // to let Supabase auto-create the table, then we'll remove it
    
    console.log('📊 Testing table creation with insert method...');
    
    // Try to create a dummy record to see if table exists
    const testInsert = await supabase
      .from('fitness_groups')
      .insert([{
        name: 'Test Group',
        description: 'Test Description',
        location: 'Test Location',
        category: 'test',
        creator_id: '00000000-0000-0000-0000-000000000000'
      }])
      .select();
    
    if (testInsert.error) {
      console.log('❌ Table does not exist. Error:', testInsert.error.message);
      console.log('⚠️ The fitness_groups table needs to be created manually in Supabase Dashboard');
      console.log('📋 Please run this SQL in Supabase SQL Editor:');
      console.log('');
      console.log('-- Create fitness_groups table');
      console.log(`CREATE TABLE IF NOT EXISTS public.fitness_groups (
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
);`);
      console.log('');
      console.log('-- Create fitness_group_members table');
      console.log(`CREATE TABLE IF NOT EXISTS public.fitness_group_members (
  id SERIAL PRIMARY KEY,
  group_id INTEGER REFERENCES public.fitness_groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  role VARCHAR(20) DEFAULT 'member' NOT NULL,
  UNIQUE(group_id, user_id)
);`);
      console.log('');
      console.log('-- Enable Row Level Security');
      console.log(`ALTER TABLE public.fitness_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitness_group_members ENABLE ROW LEVEL SECURITY;`);
      console.log('');
      console.log('-- Create RLS Policies');
      console.log(`-- Allow anyone to read fitness groups
CREATE POLICY read_fitness_groups ON public.fitness_groups
  FOR SELECT USING (TRUE);

-- Allow authenticated users to create groups
CREATE POLICY create_fitness_groups ON public.fitness_groups
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow creators to update their groups
CREATE POLICY update_fitness_groups ON public.fitness_groups
  FOR UPDATE USING (creator_id = auth.uid());

-- Allow creators to delete their groups
CREATE POLICY delete_fitness_groups ON public.fitness_groups
  FOR DELETE USING (creator_id = auth.uid());

-- Allow anyone to read group members
CREATE POLICY read_group_members ON public.fitness_group_members
  FOR SELECT USING (TRUE);

-- Allow users to join groups
CREATE POLICY join_groups ON public.fitness_group_members
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid());

-- Allow users to leave groups
CREATE POLICY leave_groups ON public.fitness_group_members
  FOR DELETE USING (user_id = auth.uid());`);
      
      return false;
    } else {
      console.log('✅ Table exists! Cleaning up test record...');
      // Remove the test record
      await supabase
        .from('fitness_groups')
        .delete()
        .eq('name', 'Test Group');
      
      console.log('✅ Fitness groups table is ready!');
      return true;
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

// Run the function
createFitnessTables()
  .then(success => {
    if (success) {
      console.log('🎉 Fitness groups tables verified!');
    } else {
      console.log('📋 Please create the tables manually using the SQL provided above.');
    }
  })
  .catch(error => {
    console.error('💥 Script error:', error);
  });
