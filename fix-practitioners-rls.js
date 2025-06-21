/**
 * Fix Practitioners RLS
 * 
 * This script fixes the Row Level Security (RLS) policies for the practitioners table
 * to ensure users can insert their own practitioner records.
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the Supabase URL and key from environment variables or .env file
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.argv[2];
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.argv[3];

if (!supabaseUrl || !supabaseKey) {
  console.error(
    'Error: Missing Supabase credentials. Please provide them as environment variables or command line arguments.'
  );
  console.error('Usage: node fix-practitioners-rls.js <SUPABASE_URL> <SUPABASE_SERVICE_KEY>');
  process.exit(1);
}

console.log('Supabase URL:', supabaseUrl);
console.log('Initializing Supabase client...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyRLSPolicies() {
  console.log('Applying RLS policies for practitioners table...');

  try {
    // First, make sure RLS is enabled
    console.log('1. Enabling Row Level Security...');
    await supabase.rpc('pg_execute', {
      query: 'ALTER TABLE public.practitioners ENABLE ROW LEVEL SECURITY;'
    });

    // Drop any conflicting policies
    console.log('2. Dropping existing RLS policies...');
    await supabase.rpc('pg_execute', {
      query: 'DROP POLICY IF EXISTS "Allow authenticated users to insert practitioners" ON public.practitioners;'
    });
    
    // Create the correct insert policy
    console.log('3. Creating proper insert policy...');
    await supabase.rpc('pg_execute', {
      query: `
        CREATE POLICY "Allow users to insert their own practitioner profiles" 
        ON public.practitioners 
        FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
      `
    });
    
    // Create read policy
    console.log('4. Ensuring read policy exists...');
    await supabase.rpc('pg_execute', {
      query: `
        CREATE POLICY IF NOT EXISTS "Allow public read access to practitioners" 
        ON public.practitioners 
        FOR SELECT USING (true);
      `
    });
    
    // Create update policy
    console.log('5. Ensuring update policy exists...');
    await supabase.rpc('pg_execute', {
      query: `
        CREATE POLICY IF NOT EXISTS "Allow users to update their own practitioner profiles" 
        ON public.practitioners 
        FOR UPDATE 
        USING (auth.uid() = user_id);
      `
    });
    
    // Create delete policy
    console.log('6. Ensuring delete policy exists...');
    await supabase.rpc('pg_execute', {
      query: `
        CREATE POLICY IF NOT EXISTS "Allow users to delete their own practitioner profiles" 
        ON public.practitioners 
        FOR DELETE 
        USING (auth.uid() = user_id);
      `
    });

    console.log('✅ RLS policies for practitioners table have been successfully updated!');
    console.log('Users can now create their own practitioner profiles.');
    
  } catch (error) {
    console.error('Error applying RLS policies:', error.message);
    process.exit(1);
  }
}

// Execute the function
applyRLSPolicies().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
});
