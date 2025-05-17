// This script inserts dummy data for community delights
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
// Make sure you have the correct SUPABASE_URL and SUPABASE_KEY in your .env file
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
// In a real scenario, these would be real user IDs from auth.users table
const TEST_USER_ID = '00000000-0000-0000-0000-000000000000';

// Function to insert dummy data
async function insertDummyData() {
  console.log('Checking if community_delights table exists...');
  
  // First, check if the table exists
  const { error: checkError } = await supabase
    .from('community_delights')
    .select('id')
    .limit(1);
  
  if (checkError && checkError.code === '42P01') {
    console.log('Table does not exist. Creating community_delights table...');
    
    // Execute the SQL to create the table
    const { error: createError } = await supabase.rpc('setup_community_delights_table');
    
    if (createError) {
      console.error('Error creating community_delights table:', createError);
      
      // Alternative: Try direct SQL execution if RPC fails
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
      
      const { error: sqlError } = await supabase.rpc('run_sql', { sql });
      if (sqlError) {
        console.error('Error executing SQL to create table:', sqlError);
        return;
      }
    }
    
    // Wait a moment for table creation to complete
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('Inserting dummy delights...');
  
  // First, clear existing test data
  const { error: deleteError } = await supabase
    .from('community_delights')
    .delete()
    .eq('user_id', TEST_USER_ID);
  
  if (deleteError) {
    console.warn('Warning when deleting existing test data:', deleteError);
    // Continue anyway
  }
  
  // Insert the dummy delights
  for (const delight of delightsSampleData) {
    const { error } = await supabase
      .from('community_delights')
      .insert({
        text: delight.text,
        user_id: TEST_USER_ID,
        username: delight.username,
        cheers: delight.cheers
      });
    
    if (error) {
      console.error(`Error inserting delight "${delight.text}":`, error);
    } else {
      console.log(`Inserted delight: "${delight.text}"`);
    }
    
    // Small delay to avoid overwhelming the database
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('Dummy data insertion complete!');
}

// Run the function
insertDummyData()
  .catch(err => {
    console.error('Error running script:', err);
  })
  .finally(() => {
    console.log('Script execution complete.');
    process.exit(0);
  });
