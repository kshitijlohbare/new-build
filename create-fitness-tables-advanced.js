#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.log('VITE_SUPABASE_URL:', !!supabaseUrl);
  console.log('SUPABASE_SERVICE_ROLE_KEY:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  console.log('VITE_SUPABASE_ANON_KEY:', !!process.env.VITE_SUPABASE_ANON_KEY);
  process.exit(1);
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createFitnessTables() {
  try {
    console.log('🏃 Creating fitness groups tables...');
    
    // SQL statements to create tables
    const createTablesSQL = [
      // Create fitness_groups table
      `CREATE TABLE IF NOT EXISTS public.fitness_groups (
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
      )`,
      
      // Create fitness_group_members table
      `CREATE TABLE IF NOT EXISTS public.fitness_group_members (
        id SERIAL PRIMARY KEY,
        group_id INTEGER REFERENCES public.fitness_groups(id) ON DELETE CASCADE NOT NULL,
        user_id UUID NOT NULL,
        joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        role VARCHAR(20) DEFAULT 'member' NOT NULL,
        UNIQUE(group_id, user_id)
      )`,
      
      // Enable RLS
      `ALTER TABLE public.fitness_groups ENABLE ROW LEVEL SECURITY`,
      `ALTER TABLE public.fitness_group_members ENABLE ROW LEVEL SECURITY`,
      
      // Create policies
      `CREATE POLICY IF NOT EXISTS read_fitness_groups ON public.fitness_groups
        FOR SELECT USING (TRUE)`,
      
      `CREATE POLICY IF NOT EXISTS create_fitness_groups ON public.fitness_groups
        FOR INSERT WITH CHECK (auth.role() = 'authenticated')`,
      
      `CREATE POLICY IF NOT EXISTS update_fitness_groups ON public.fitness_groups
        FOR UPDATE USING (creator_id = auth.uid())`,
      
      `CREATE POLICY IF NOT EXISTS delete_fitness_groups ON public.fitness_groups
        FOR DELETE USING (creator_id = auth.uid())`,
      
      `CREATE POLICY IF NOT EXISTS read_group_members ON public.fitness_group_members
        FOR SELECT USING (TRUE)`,
      
      `CREATE POLICY IF NOT EXISTS join_groups ON public.fitness_group_members
        FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid())`,
      
      `CREATE POLICY IF NOT EXISTS leave_groups ON public.fitness_group_members
        FOR DELETE USING (user_id = auth.uid())`
    ];
    
    // Try to use SQL execution via REST API directly
    console.log('📡 Executing SQL via REST API...');
    
    for (const [index, sql] of createTablesSQL.entries()) {
      try {
        console.log(`Executing statement ${index + 1}/${createTablesSQL.length}...`);
        
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey
          },
          body: JSON.stringify({ query: sql })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`⚠️ Statement ${index + 1} failed:`, errorText);
        } else {
          console.log(`✅ Statement ${index + 1} executed successfully`);
        }
      } catch (err) {
        console.warn(`⚠️ Statement ${index + 1} error:`, err.message);
      }
    }
    
    // Verify tables were created
    console.log('🔍 Verifying tables...');
    
    const { data: groups, error: groupsError } = await supabase
      .from('fitness_groups')
      .select('*')
      .limit(1);
    
    if (!groupsError) {
      console.log('✅ fitness_groups table exists!');
      
      // Add sample data
      console.log('📊 Adding sample fitness groups...');
      
      const sampleGroups = [
        {
          name: 'Morning Yoga Warriors',
          description: 'Start your day with peaceful yoga sessions in the park. All skill levels welcome!',
          location: 'Central Park, Mumbai',
          latitude: 19.0760,
          longitude: 72.8777,
          category: 'yoga',
          meeting_frequency: 'Mon, Wed, Fri 7:00 AM',
          creator_id: '00000000-0000-0000-0000-000000000000' // Dummy creator for sample data
        },
        {
          name: 'Weekend Hiking Club',
          description: 'Explore beautiful trails and connect with nature every weekend. Great workout and fresh air!',
          location: 'Sanjay Gandhi National Park',
          latitude: 19.2147,
          longitude: 72.9101,
          category: 'hiking',
          meeting_frequency: 'Saturdays 6:00 AM',
          creator_id: '00000000-0000-0000-0000-000000000000'
        },
        {
          name: 'Beach Running Group',
          description: 'Run along the beautiful coastline with a supportive group. Beginner to advanced runners welcome.',
          location: 'Juhu Beach, Mumbai',
          latitude: 19.0969,
          longitude: 72.8267,
          category: 'running',
          meeting_frequency: 'Tue, Thu, Sun 6:30 AM',
          creator_id: '00000000-0000-0000-0000-000000000000'
        }
      ];
      
      for (const group of sampleGroups) {
        try {
          const { data, error } = await supabase
            .from('fitness_groups')
            .insert([group])
            .select();
          
          if (!error) {
            console.log(`✅ Added sample group: ${group.name}`);
          } else {
            console.warn(`⚠️ Failed to add sample group ${group.name}:`, error.message);
          }
        } catch (err) {
          console.warn(`⚠️ Failed to add sample group ${group.name}:`, err.message);
        }
      }
      
      return true;
    } else {
      console.error('❌ Table verification failed:', groupsError);
      return false;
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
      console.log('🎉 Fitness groups setup completed successfully!');
    } else {
      console.log('💥 Setup failed. Please create tables manually via Supabase Dashboard.');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Script error:', error);
    process.exit(1);
  });
