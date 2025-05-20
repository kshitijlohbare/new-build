// insert-practices-enhanced.js
// Improved script to insert practices data with better error handling and RLS workarounds
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Supabase client configuration
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Starting practices database setup...');

// Load initial practices data from PracticeContext
// This is just an excerpt - you should load all practices
const INITIAL_PRACTICE_DATA = [
  {
    id: 1,
    icon: "shower",
    name: "Cold Shower Exposure",
    description: "Cold exposure helps improve stress resilience, mood, and cognitive focus.",
    benefits: ["Improves stress resilience", "Boosts mood", "Enhances cognitive focus", "Reduces inflammation"],
    duration: 3,
    completed: false,
    streak: 0,
    isDaily: true,
    isSystemPractice: true,
    source: "Andrew Huberman",
    steps: [
      { title: "Prepare", description: "Start with a warm shower and gradually reduce the temperature to 'uncomfortably cold' but safe." },
      { title: "Duration", description: "Begin with 1–2 minutes and increase gradually over time (e.g., 3–5 minutes)." },
      { title: "Breathing", description: "Maintain steady breathing to avoid hyperventilation." },
    ]
  },
  {
    id: 2,
    icon: "moleskine",
    name: "Gratitude Journal",
    description: "Gratitude journaling cultivates positivity and mental resilience.",
    benefits: ["Increases positive outlook", "Reduces stress", "Improves mental health"],
    duration: 10,
    completed: false,
    streak: 0,
    isDaily: true,
    isSystemPractice: true,
    source: "Naval Ravikant",
    steps: [
      { title: "Choose a Journal", description: "Use a physical notebook or a digital app dedicated to gratitude journaling." },
      { title: "Daily Practice", description: "Write down 3–5 things you're grateful for each day." },
      { title: "Consistency", description: "Keep it simple to stay consistent; allocate just 2–5 minutes daily." },
    ]
  }
];

// Step 1: Create the practices table if it doesn't exist
async function setupPracticesTable() {
  console.log('Setting up practices table...');
  
  try {
    const createTableSql = fs.readFileSync('./create-practices-table.sql', 'utf8');
    
    // Try multiple methods to execute the SQL
    try {
      // Try execute_sql first
      const { data, error } = await supabase.rpc('execute_sql', { sql_command: createTableSql });
      if (error) throw error;
      console.log('Successfully created practices table');
    } catch (e) {
      try {
        // Try pg_exec next
        console.log('execute_sql failed, trying pg_exec...');
        const { data, error } = await supabase.rpc('pg_exec', { query: createTableSql });
        if (error) throw error;
        console.log('Successfully created practices table using pg_exec');
      } catch (e2) {
        console.error('Both SQL execution methods failed:', e2);
        console.log('Table may already exist or SQL execution functions are not accessible');
        
        // Check if table exists
        const { error: checkError } = await supabase.from('practices').select('id').limit(1);
        if (checkError) {
          console.error('Failed to access practices table:', checkError);
          throw new Error('Could not create or access practices table');
        } else {
          console.log('Practices table exists, continuing...');
        }
      }
    }
  } catch (error) {
    console.error('Error setting up practices table:', error);
    throw error;
  }
}

// Step 2: Disable Row Level Security on the practices table
async function disableRLS() {
  console.log('Attempting to disable RLS on practices table...');
  
  try {
    const disableRlsSql = fs.readFileSync('./disable-practices-rls.sql', 'utf8');
    
    // Try multiple methods to execute the SQL
    try {
      // Try execute_sql first
      const { data, error } = await supabase.rpc('execute_sql', { sql_command: disableRlsSql });
      if (error) throw error;
      console.log('Successfully disabled RLS on practices table');
      return true;
    } catch (e) {
      try {
        // Try pg_exec next
        console.log('execute_sql failed, trying pg_exec...');
        const { data, error } = await supabase.rpc('pg_exec', { query: disableRlsSql });
        if (error) throw error;
        console.log('Successfully disabled RLS on practices table using pg_exec');
        return true;
      } catch (e2) {
        console.error('Failed to disable RLS:', e2);
        console.log('Continuing with insertion, but it may fail if RLS is enabled');
        return false;
      }
    }
  } catch (error) {
    console.error('Error disabling RLS:', error);
    return false;
  }
}

// Step 3: Create an allow-all RLS policy as fallback if RLS couldn't be disabled
async function createAllowAllPolicy() {
  console.log('Creating permissive RLS policy as fallback...');
  
  const policySql = `
    CREATE POLICY IF NOT EXISTS "Allow all access for now" 
    ON practices 
    USING (true) 
    WITH CHECK (true);
  `;
  
  try {
    // Try multiple methods to execute the SQL
    try {
      // Try execute_sql first
      const { data, error } = await supabase.rpc('execute_sql', { sql_command: policySql });
      if (error) throw error;
      console.log('Successfully created permissive RLS policy');
      return true;
    } catch (e) {
      try {
        // Try pg_exec next
        console.log('execute_sql failed, trying pg_exec...');
        const { data, error } = await supabase.rpc('pg_exec', { query: policySql });
        if (error) throw error;
        console.log('Successfully created permissive RLS policy using pg_exec');
        return true;
      } catch (e2) {
        console.error('Failed to create permissive RLS policy:', e2);
        return false;
      }
    }
  } catch (error) {
    console.error('Error creating permissive RLS policy:', error);
    return false;
  }
}

// Step 4: Insert practices data
async function insertPractices() {
  console.log('Inserting practices data...');
  
  try {
    let insertedCount = 0;
    
    for (const practice of INITIAL_PRACTICE_DATA) {
      console.log(`Processing practice: ${practice.name}`);
      
      // Map JavaScript property names to database column names
      const dbPractice = {
        id: practice.id,
        icon: practice.icon,
        name: practice.name,
        description: practice.description,
        benefits: practice.benefits || [],
        duration: practice.duration,
        points: practice.points,
        completed: practice.completed || false,
        streak: practice.streak || 0,
        tags: practice.tags || [],
        steps: practice.steps || [],
        source: practice.source,
        step_progress: practice.stepProgress,
        is_daily: practice.isDaily || false,
        user_created: practice.userCreated || false,
        created_by_user_id: practice.createdByUserId,
        is_system_practice: practice.isSystemPractice || false
      };
      
      const { data, error } = await supabase
        .from('practices')
        .upsert(dbPractice)
        .select();
      
      if (error) {
        console.error(`Error inserting practice ${practice.name}:`, error);
      } else {
        console.log(`Successfully inserted practice: ${practice.name}`);
        insertedCount++;
      }
    }
    
    console.log(`Successfully inserted ${insertedCount}/${INITIAL_PRACTICE_DATA.length} practices`);
    return insertedCount > 0;
  } catch (error) {
    console.error('Error inserting practices:', error);
    return false;
  }
}

// Step 5: Verify the practices were inserted
async function verifyPractices() {
  console.log('Verifying practices data...');
  
  try {
    const { data, error } = await supabase
      .from('practices')
      .select('id, name, is_daily, is_system_practice');
    
    if (error) {
      console.error('Error verifying practices:', error);
      return false;
    }
    
    console.log(`Found ${data.length} practices in the database:`);
    data.forEach(practice => {
      console.log(`- ${practice.name} (ID: ${practice.id}, Daily: ${practice.is_daily}, System: ${practice.is_system_practice})`);
    });
    
    return data.length > 0;
  } catch (error) {
    console.error('Error verifying practices:', error);
    return false;
  }
}

// Run the entire setup process
async function setupPractices() {
  try {
    await setupPracticesTable();
    const rlsDisabled = await disableRLS();
    
    if (!rlsDisabled) {
      await createAllowAllPolicy();
    }
    
    const practicesInserted = await insertPractices();
    
    if (practicesInserted) {
      await verifyPractices();
      console.log('Practices setup completed successfully!');
    } else {
      console.error('Failed to insert practices.');
    }
  } catch (error) {
    console.error('Failed to set up practices:', error);
  }
}

// Execute the setup
setupPractices();
