// execute-practitioner-fix.js
// This script executes the fix for practitioner visibility issues
// It first runs a check and then applies the fix if needed

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Use the correct Supabase URL and key
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// Initialize Supabase client with workaround for SSL issues in Node.js
const createSupabaseClient = () => {
  // Disable SSL verification in Node.js (for development only)
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  console.warn('WARNING: SSL verification disabled. Use only in development.');
  
  return createClient(supabaseUrl, supabaseKey);
};

const supabase = createSupabaseClient();

// Function to check if practitioners are visible
async function checkPractitionersVisibility() {
  console.log('Checking if practitioners are visible to anonymous users...');
  
  try {
    // Try to fetch practitioners as anonymous user
    const { data, error } = await supabase
      .from('practitioners')
      .select('id, name')
      .limit(3);
      
    if (error) {
      console.error('Error accessing practitioners:', error);
      return { visible: false, error };
    }
    
    if (!data || data.length === 0) {
      console.log('No practitioners found in the database.');
      return { visible: true, empty: true };
    }
    
    console.log(`Found ${data.length} practitioners. Data is accessible.`);
    return { visible: true, data };
  } catch (err) {
    console.error('Exception during visibility check:', err);
    return { visible: false, error: err };
  }
}

// Function to apply SQL fix directly
async function applySqlFix() {
  console.log('Applying SQL fix...');
  
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'fix-rls-policies.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the SQL through pg_exec RPC function
    const { error } = await supabase.rpc('pg_exec', { query: sqlContent });
    
    if (error) {
      console.error('Error executing SQL fix:', error);
      return false;
    }
    
    console.log('SQL fix applied successfully!');
    return true;
  } catch (err) {
    console.error('Exception applying SQL fix:', err);
    return false;
  }
}

// Main function to execute the fix
async function executeFix() {
  console.log('Starting practitioner visibility fix process...');
  
  // First check if there's an issue
  const visibilityCheck = await checkPractitionersVisibility();
  
  if (visibilityCheck.visible && !visibilityCheck.empty) {
    console.log('Practitioners are already visible. No fix needed!');
    return;
  }
  
  console.log('Practitioner visibility issue detected. Applying fix...');
  
  // Try to apply fix using the SQL script
  const sqlFixResult = await applySqlFix();
  
  if (!sqlFixResult) {
    console.log('SQL fix failed or encountered issues. Trying JavaScript fix...');
    
    // If SQL fix fails, run the JavaScript fix as fallback
    try {
      // Import and run the fix-practitioners-visibility.js script
      const { fixPractitionersVisibility } = await import('./fix-practitioners-visibility.js');
      await fixPractitionersVisibility();
    } catch (err) {
      console.error('Error running JavaScript fix:', err);
      console.log('Running embedded fix as final fallback...');
      
      // Apply embedded fix as last resort
      try {
        // Enable RLS and add policy directly
        await supabase.rpc('pg_exec', { 
          query: "ALTER TABLE public.practitioners ENABLE ROW LEVEL SECURITY" 
        });
        
        await supabase.rpc('pg_exec', { 
          query: `CREATE POLICY "Allow anonymous read access to practitioners" 
                  ON public.practitioners 
                  FOR SELECT 
                  USING (true)` 
        });
        
        console.log('Embedded fix applied.');
      } catch (finalErr) {
        console.error('All fix attempts failed:', finalErr);
        console.log('Please check database permissions and try again.');
      }
    }
  }
  
  // Verify fix worked
  const finalCheck = await checkPractitionersVisibility();
  
  if (finalCheck.visible && !finalCheck.empty) {
    console.log('SUCCESS! Practitioners are now visible to anonymous users.');
  } else if (finalCheck.empty) {
    console.log('Fix applied but no practitioners found in the database. You may need to add some data.');
  } else {
    console.log('Fix did not resolve the issue. Additional troubleshooting required.');
    console.log('Error details:', finalCheck.error);
  }
}

// Execute the fix
executeFix().catch(console.error);