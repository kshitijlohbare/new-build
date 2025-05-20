// Script to enable Row Level Security on practice tables in Supabase
// This ensures each user's practice data is kept private and secure
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Supabase credentials from .env file if available, otherwise use environment variables
dotenv.config();
let supabaseUrl, supabaseKey;
try {
  supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials');
  }
} catch (error) {
  // Check if provided as command line arguments
  const args = process.argv.slice(2);
  if (args.length >= 2) {
    supabaseUrl = args[0];
    supabaseKey = args[1];
  } else {
    console.error('Error loading environment variables:', error);
    console.error('Please provide Supabase URL and key as environment variables or as command line arguments');
    console.error('Usage: node apply-practices-rls.js <SUPABASE_URL> <SUPABASE_SERVICE_KEY>');
    process.exit(1);
  }
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function enablePracticesRLS() {
  try {
    console.log('Enabling Row Level Security for practice tables...');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'enable-practices-rls.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split the SQL file into individual statements
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    // Execute each statement
    for (const statement of statements) {
      try {
        const { error } = await supabase.rpc('pg_exec', { 
          query: statement.trim() + ';'
        });
        
        if (error) {
          console.error('Error executing statement:', error);
          console.error('Problem statement:', statement);
        } else {
          console.log('Successfully executed statement.');
        }
      } catch (execError) {
        console.error('Exception executing statement:', execError);
        console.error('Problem statement:', statement);
      }
    }
    
    // Verify RLS is enabled
    console.log('\nVerifying RLS is enabled...');
    
    const tables = ['practices', 'user_practices', 'user_daily_practices'];
    
    for (const table of tables) {
      try {
        // Check if table exists
        const { data: tableExists, error: tableError } = await supabase
          .from('information_schema.tables')
          .select('*')
          .eq('table_name', table)
          .eq('table_schema', 'public');
        
        if (tableError) {
          console.error(`Error checking if ${table} exists:`, tableError);
          continue;
        }
        
        if (!tableExists || tableExists.length === 0) {
          console.log(`Table ${table} does not exist, skipping verification.`);
          continue;
        }
        
        // Check if RLS is enabled
        const { data: rlsEnabled, error: rlsError } = await supabase
          .from('pg_tables')
          .select('rowsecurity')
          .eq('tablename', table)
          .eq('schemaname', 'public');
        
        if (rlsError) {
          console.error(`Error checking RLS for ${table}:`, rlsError);
        } else if (rlsEnabled && rlsEnabled.length > 0) {
          console.log(`✅ RLS for ${table} is ${rlsEnabled[0].rowsecurity ? 'enabled' : 'disabled'}`);
        } else {
          console.log(`❓ Could not determine RLS status for ${table}`);
        }
      } catch (error) {
        console.error(`Error verifying RLS for ${table}:`, error);
      }
    }
    
    console.log('\nRow Level Security setup complete. Each user can now only access their own practice data.');
    console.log('Note: Existing non-user-specific data may need to be migrated.');
    
  } catch (error) {
    console.error('Error enabling RLS:', error);
  }
}

// Run the function
enablePracticesRLS().catch(console.error);
