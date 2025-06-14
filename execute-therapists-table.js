// Script to create therapists table in Supabase
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Initialize environment variables
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createTherapistsTable() {
  console.log('Starting therapists table creation...');
  
  // Get Supabase credentials from environment variables
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: Supabase credentials not found in environment variables');
    console.log('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set');
    return;
  }
  
  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'create-therapists-table.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Executing SQL...');
    
    // Execute the SQL via Supabase's pg_execute
    const { data, error } = await supabase.rpc('pg_execute', { query: sqlContent });
    
    if (error) {
      console.error('Error executing SQL:', error);
      return;
    }
    
    console.log('Therapists table created successfully!');
    
    // Verify that the table exists
    const { data: tableData, error: tableError } = await supabase
      .from('therapists')
      .select('count(*)')
      .limit(1);
    
    if (tableError) {
      console.error('Error verifying therapists table:', tableError);
      return;
    }
    
    console.log('Therapists table verified. Sample data inserted.');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createTherapistsTable();