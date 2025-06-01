// direct-schema-fix.js
// Simple script to apply schema fixes directly

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Supabase credentials
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// Create Supabase client with SSL verification disabled
const options = {
  auth: { persistSession: false },
  global: {
    fetch: (...args) => {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      return fetch(...args);
    }
  }
};

const supabase = createClient(supabaseUrl, supabaseKey, options);

// SQL statements for the fix
const sqlStatements = [
  // Add user_id column
  `ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;`,
  
  // Add bio column
  `ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS bio TEXT;`,
  
  // Add conditions column (formerly conditions_treated)
  `ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS conditions TEXT[];`,
  
  // Add session_format column (formerly session_formats)
  `ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS session_format TEXT[] DEFAULT '{"Individual Therapy"}';`,
  
  // Add availability column (formerly availability_schedule)
  `ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS availability TEXT;`,
  
  // Add price_range column
  `ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS price_range JSONB DEFAULT '{"min": 0, "max": 0}';`,
  
  // Add calendly_link column
  `ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS calendly_link TEXT;`,
  
  // Add updated_at column
  `ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;`,
  
  // Create index for faster lookups
  `CREATE INDEX IF NOT EXISTS practitioners_user_id_idx ON public.practitioners(user_id);`
];

async function applySchemaFixes() {
  console.log('Starting schema fixes...');
  
  for (let i = 0; i < sqlStatements.length; i++) {
    const sql = sqlStatements[i];
    console.log(`Applying statement ${i + 1}/${sqlStatements.length}...`);
    
    try {
      await supabase.rpc('exec', { sql });
      console.log('✓ Success');
    } catch (error) {
      console.error(`× Error applying statement ${i + 1}:`, error);
    }
  }
  
  console.log('Schema fixes completed.');
}

// Execute the fixes
applySchemaFixes();
