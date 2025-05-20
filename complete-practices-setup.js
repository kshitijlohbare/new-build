// complete-practices-setup.js
// This script performs all necessary steps to:
// 1. Create the practices table
// 2. Disable RLS or set up a permissive policy
// 3. Populate the table with practice data
// 4. Test that the practices can be retrieved

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Supabase client configuration
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';
const supabase = createClient(supabaseUrl, supabaseKey);

// Load SQL files
const createTableSql = fs.readFileSync(path.resolve('./create-practices-table.sql'), 'utf8');
const disableRlsSql = fs.readFileSync(path.resolve('./disable-practices-rls.sql'), 'utf8');

// Load practice data from insert-practices-direct.js
// This is a simplified version - normally you'd import the full dataset
const PRACTICES_DATA = [
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
      { title: "Breathing", description: "Maintain steady breathing to avoid hyperventilation." }
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
      { title: "Consistency", description: "Keep it simple to stay consistent; allocate just 2–5 minutes daily." }
    ]
  },
  {
    id: 4,
    icon: "smelling",
    name: "Focus Breathing (3:3:6)",
    description: "This breathing technique calms the nervous system and enhances focus.",
    benefits: ["Calms the nervous system", "Improves focus", "Reduces stress"],
    duration: 5,
    completed: false,
    streak: 0,
    isDaily: true,
    isSystemPractice: true,
    source: "Andrew Huberman"
  }
];

// Function to execute SQL using available functions
async function executeSql(sql) {
  try {
    // Try execute_sql first
    const result1 = await supabase.rpc('execute_sql', { sql_command: sql });
    if (!result1.error) {
      return { success: true, method: 'execute_sql' };
    }
    console.log('execute_sql failed, trying pg_exec...');
    
    // Try pg_exec next
    const result2 = await supabase.rpc('pg_exec', { query: sql });
    if (!result2.error) {
      return { success: true, method: 'pg_exec' };
    }
    
    console.log('SQL RPC methods failed, falling back to direct API...');
    return { 
      success: false, 
      error: result2.error,
      message: 'SQL execution methods failed' 
    };
  } catch (error) {
    console.error('Error executing SQL:', error);
    return { 
      success: false, 
      error: error,
      message: 'Exception executing SQL' 
    };
  }
}

// Step 1: Create the practices table
async function createPracticesTable() {
  console.log('Step 1: Creating practices table...');
  
  // Try to execute the create table SQL
  const result = await executeSql(createTableSql);
  
  if (result.success) {
    console.log(`Table created successfully using ${result.method}`);
  } else {
    console.log('Failed to create table using SQL functions, checking if table exists...');
    
    // Check if table exists by attempting to query it
    try {
      const { error } = await supabase.from('practices').select('id').limit(1);
      
      if (error) {
        console.error('Error accessing practices table:', error);
        return false;
      } else {
        console.log('Practices table already exists, continuing...');
        return true;
      }
    } catch (error) {
      console.error('Error checking if practices table exists:', error);
      return false;
    }
  }
  
  return true;
}

// Step 2: Disable RLS or create a permissive policy
async function setupTableAccess() {
  console.log('Step 2: Setting up table access permissions...');
  
  // Try to disable RLS first
  const disableResult = await executeSql(disableRlsSql);
  
  if (disableResult.success) {
    console.log(`Successfully disabled RLS using ${disableResult.method}`);
    return true;
  }
  
  console.log('Failed to disable RLS, creating permissive policy instead...');
  
  // Create a permissive policy instead
  const policySql = `
    CREATE POLICY IF NOT EXISTS "Allow all for now" 
    ON practices 
    FOR ALL 
    USING (true) 
    WITH CHECK (true);
    
    ALTER TABLE IF EXISTS practices ENABLE ROW LEVEL SECURITY;
  `;
  
  const policyResult = await executeSql(policySql);
  
  if (policyResult.success) {
    console.log(`Successfully created permissive policy using ${policyResult.method}`);
    return true;
  }
  
  console.error('Failed to set up table access, may have permission issues');
  return false;
}

// Step 3: Insert practice data
async function insertPractices() {
  console.log('Step 3: Inserting practices data...');
  let insertCount = 0;
  
  for (const practice of PRACTICES_DATA) {
    console.log(`Processing practice: ${practice.name}`);
    
    // Convert JavaScript object to DB format
    const dbPractice = {
      id: practice.id,
      icon: practice.icon,
      name: practice.name,
      description: practice.description,
      benefits: practice.benefits,
      duration: practice.duration,
      points: practice.points,
      completed: practice.completed || false,
      streak: practice.streak || 0,
      tags: practice.tags || [],
      steps: practice.steps || [],
      source: practice.source,
      step_progress: practice.stepProgress || 0,
      is_daily: practice.isDaily || false,
      user_created: practice.userCreated || false,
      created_by_user_id: practice.createdByUserId,
      is_system_practice: practice.isSystemPractice || false
    };
    
    try {
      // Try to insert using standard insert
      const { data, error } = await supabase
        .from('practices')
        .upsert([dbPractice], { onConflict: 'id' });
      
      if (error) {
        console.error(`Error inserting practice ${practice.name}:`, error);
        
        // Try raw SQL insert as fallback
        const insertSql = `
          INSERT INTO practices (
            id, icon, name, description, benefits, duration, points,
            completed, streak, tags, steps, source, step_progress,
            is_daily, user_created, created_by_user_id, is_system_practice
          )
          VALUES (
            ${practice.id},
            ${practice.icon ? `'${practice.icon.replace(/'/g, "''")}'` : 'NULL'},
            '${practice.name.replace(/'/g, "''")}',
            '${practice.description.replace(/'/g, "''")}',
            '${JSON.stringify(practice.benefits || []).replace(/'/g, "''")}',
            ${practice.duration || 'NULL'},
            ${practice.points || 'NULL'},
            ${practice.completed ? 'true' : 'false'},
            ${practice.streak || 0},
            '${JSON.stringify(practice.tags || []).replace(/'/g, "''")}',
            '${JSON.stringify(practice.steps || []).replace(/'/g, "''")}',
            ${practice.source ? `'${practice.source.replace(/'/g, "''")}'` : 'NULL'},
            ${practice.stepProgress || 0},
            ${practice.isDaily ? 'true' : 'false'},
            ${practice.userCreated ? 'true' : 'false'},
            ${practice.createdByUserId ? `'${practice.createdByUserId.replace(/'/g, "''")}'` : 'NULL'},
            ${practice.isSystemPractice ? 'true' : 'false'}
          )
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            description = EXCLUDED.description,
            benefits = EXCLUDED.benefits,
            duration = EXCLUDED.duration,
            is_daily = EXCLUDED.is_daily,
            is_system_practice = EXCLUDED.is_system_practice;
        `;
        
        const sqlResult = await executeSql(insertSql);
        
        if (sqlResult.success) {
          console.log(`Inserted practice ${practice.name} using SQL`);
          insertCount++;
        } else {
          console.error(`Failed to insert practice ${practice.name} using SQL:`, sqlResult.error);
        }
      } else {
        console.log(`Successfully inserted practice ${practice.name}`);
        insertCount++;
      }
    } catch (error) {
      console.error(`Exception inserting practice ${practice.name}:`, error);
    }
  }
  
  console.log(`Inserted ${insertCount}/${PRACTICES_DATA.length} practices`);
  return insertCount > 0;
}

// Step 4: Verify data can be retrieved
async function verifyPractices() {
  console.log('Step 4: Verifying practices can be retrieved...');
  
  try {
    const { data, error } = await supabase
      .from('practices')
      .select('id, name, is_daily, is_system_practice')
      .order('id');
    
    if (error) {
      console.error('Error retrieving practices:', error);
      return false;
    }
    
    console.log(`Successfully retrieved ${data.length} practices:`);
    data.forEach(p => {
      console.log(`- ${p.name} (ID: ${p.id}, Daily: ${p.is_daily}, System: ${p.is_system_practice})`);
    });
    
    return data.length > 0;
  } catch (error) {
    console.error('Exception retrieving practices:', error);
    return false;
  }
}

// Main function to run all steps
async function runSetup() {
  console.log('Starting complete practices setup...');
  
  try {
    // Step 1: Create table
    const tableCreated = await createPracticesTable();
    if (!tableCreated) {
      console.error('Failed to create or verify practices table');
      return;
    }
    
    // Step 2: Set up access
    const accessSetup = await setupTableAccess();
    if (!accessSetup) {
      console.warn('Table access setup may not be complete, but continuing...');
    }
    
    // Step 3: Insert data
    const dataInserted = await insertPractices();
    if (!dataInserted) {
      console.error('Failed to insert any practices');
      return;
    }
    
    // Step 4: Verify data
    const dataVerified = await verifyPractices();
    if (!dataVerified) {
      console.error('Failed to verify practices data');
      return;
    }
    
    console.log('Complete practices setup finished successfully!');
    console.log('The practices page should now be able to load data from the database.');
    
  } catch (error) {
    console.error('Error during practices setup:', error);
  }
}

// Run the setup process
runSetup();
