#!/usr/bin/env node

// Command line script to insert dummy data for the community features
// This can be run directly from the terminal with: 
// node insert-community-dummy-data.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Sample data for community delights
const delightsSampleData = [
  {
    text: "Found a peaceful spot in the park today for meditation",
    username: "nature_lover",
    cheers: 5,
  },
  {
    text: "Started my day with a 10-minute gratitude practice",
    username: "gratitude_guru",
    cheers: 12,
  },
  {
    text: "Enjoyed a mindful walk in the rain",
    username: "mindful_walker",
    cheers: 8,
  },
  {
    text: "Made time to read a chapter of my favorite book",
    username: "book_enthusiast",
    cheers: 4,
  },
  {
    text: "Tried a new breathing technique that really calmed my anxiety",
    username: "anxiety_warrior",
    cheers: 15,
  },
  {
    text: "Planted seeds in my balcony garden - felt so therapeutic!",
    username: "urban_gardener",
    cheers: 9,
  },
  {
    text: "Watched the sunset without checking my phone once",
    username: "digital_detoxer",
    cheers: 17,
  },
  {
    text: "Had a meaningful conversation with an old friend",
    username: "connection_seeker",
    cheers: 7,
  },
  {
    text: "Tried cold plunge therapy for the first time today",
    username: "cold_exposure_fan",
    cheers: 21,
  },
  {
    text: "Made a healthy meal with ingredients from the farmer's market",
    username: "health_enthusiast",
    cheers: 11,
  },
  {
    text: "Did a 5-minute yoga stretch between work meetings",
    username: "desk_yogi", 
    cheers: 6,
  },
  {
    text: "Journaled three pages this morning - my mind feels clearer",
    username: "journal_writer",
    cheers: 8,
  },
  {
    text: "Took a break to play with my dog - instant mood boost!",
    username: "pet_parent",
    cheers: 14,
  },
  {
    text: "Used a new positive affirmation today: 'I am capable and strong'",
    username: "positive_thinker",
    cheers: 10,
  },
  {
    text: "Tried sound bath meditation with singing bowls",
    username: "sound_healer",
    cheers: 9,
  }
];

// Anonymous user ID for test data
// Using a valid UUID format for user_id to match Supabase auth.users schema
const TEST_USER_ID = '00000000-0000-0000-0000-000000000000';

// Initialize Supabase client using environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing environment variables.');
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_KEY or VITE_SUPABASE_ANON_KEY are defined in your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to ensure the community_delights table exists
async function ensureCommunityDelightsTable() {
  console.log('Checking if community_delights table exists...');
  
  // First, check if the table exists
  const { error: testError } = await supabase
    .from('community_delights')
    .select('id')
    .limit(1);
  
  if (testError && testError.code === '42P01') {
    console.log('Table does not exist. Creating community_delights table...');
    
    // Execute direct SQL to create the table
    const sql = `
    CREATE TABLE IF NOT EXISTS public.community_delights (
      id BIGSERIAL PRIMARY KEY,
      text TEXT NOT NULL,
      user_id UUID NOT NULL,
      username TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      cheers INTEGER DEFAULT 0,
      
      CONSTRAINT text_not_empty CHECK (LENGTH(TRIM(text)) > 0)
    );
    
    CREATE INDEX IF NOT EXISTS community_delights_user_id_idx ON public.community_delights(user_id);
    CREATE INDEX IF NOT EXISTS community_delights_created_at_idx ON public.community_delights(created_at);
    
    ALTER TABLE public.community_delights ENABLE ROW LEVEL SECURITY;
    
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
    
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_delights TO authenticated;
    GRANT USAGE, SELECT ON SEQUENCE public.community_delights_id_seq TO authenticated;
    `;
    
    const { error: createError } = await supabase.rpc('run_sql', { sql });
    
    if (createError) {
      console.error('Failed to create table using RPC:', createError);
      console.log('Trying alternative approach using direct REST API...');
      
      // Alternative approach: Create a stored procedure and call it
      // This depends on your Supabase instance having appropriate permissions
      
      // For now, we'll just show a message
      console.error('Please create the table using the Supabase SQL editor.');
      console.log('SQL for table creation:');
      console.log(sql);
      return false;
    }
    
    console.log('Community delights table created successfully!');
    return true;
  } else if (testError) {
    console.error('Error checking for community_delights table:', testError);
    return false;
  }
  
  console.log('Community delights table already exists!');
  return true;
}

// Function to insert dummy delights
async function insertDummyDelights() {
  console.log('Inserting dummy delights...');
  
  // First, clear existing test data
  const { error: deleteError } = await supabase
    .from('community_delights')
    .delete()
    .eq('user_id', TEST_USER_ID);
  
  if (deleteError) {
    console.warn('Warning when deleting existing test data:', deleteError);
    // Continue anyway
  } else {
    console.log('Cleared existing test data.');
  }
  
  // Insert the dummy delights
  let successCount = 0;
  for (const delight of delightsSampleData) {
    const { error } = await supabase
      .from('community_delights')
      .insert({
        text: delight.text,
        user_id: TEST_USER_ID,
        username: delight.username,
        cheers: delight.cheers,
        // Set a random date within the last week
        created_at: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString()
      });
    
    if (error) {
      console.error(`Error inserting delight "${delight.text}":`, error);
    } else {
      console.log(`Inserted delight: "${delight.text}"`);
      successCount++;
    }
    
    // Small delay to avoid overwhelming the database
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`Dummy data insertion complete! ${successCount} delights inserted.`);
  return successCount;
}

// Main function
async function main() {
  try {
    console.log('Starting dummy data insertion process...');
    
    // First, make sure the table exists
    const tableExists = await ensureCommunityDelightsTable();
    if (!tableExists) {
      console.error('Failed to ensure community_delights table exists. Exiting...');
      process.exit(1);
    }
    
    // Then insert the dummy data
    const insertCount = await insertDummyDelights();
    console.log(`Successfully inserted ${insertCount} dummy delights.`);
    
    process.exit(0);
  } catch (error) {
    console.error('Unexpected error during data insertion:', error);
    process.exit(1);
  }
}

// Run the main function
main();
