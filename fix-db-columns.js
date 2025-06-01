// fix-db-columns.js - Utility for fixing missing practitioner columns

const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

// Create readline interface for prompting
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt for credentials
async function getCredentials() {
  return new Promise((resolve) => {
    console.log("Please enter your Supabase credentials:");
    rl.question("Supabase URL: ", (url) => {
      rl.question("Supabase Service Role Key: ", (key) => {
        resolve({ url, key });
      });
    });
  });
}

// Main function
async function main() {
  try {
    // Get credentials
    const { url, key } = await getCredentials();
    if (!url || !key) {
      console.error("Error: URL and service role key are required");
      process.exit(1);
    }

    // Create Supabase client
    const supabase = createClient(url, key);
    console.log("Connecting to Supabase...");

    // Define the SQL to execute
    const sql = `
      -- Add conditions_treated as a text array
      ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS conditions_treated TEXT[];
      
      -- Add session_formats as a text array
      ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS session_formats TEXT[];
      
      -- Add availability_schedule as text field
      ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS availability_schedule TEXT;
      
      -- Add calendly_link as text field
      ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS calendly_link TEXT;
    `;

    // Execute the SQL
    console.log("Adding missing columns...");
    const { error } = await supabase.rpc('exec', { sql });
    
    if (error) {
      console.error("Error:", error.message);
      process.exit(1);
    }
    
    console.log("Success! Columns added successfully.");

    // Verify the columns were added
    console.log("Verifying columns were added...");
    const { data, error: verifyError } = await supabase
      .from('practitioners')
      .select('*')
      .limit(1);
      
    if (verifyError) {
      console.error("Error verifying columns:", verifyError.message);
      process.exit(1);
    }
    
    if (data && data.length > 0) {
      const firstRow = data[0];
      const requiredColumns = ['conditions_treated', 'session_formats', 'availability_schedule', 'calendly_link'];
      
      const missingColumns = requiredColumns.filter(col => !(col in firstRow));
      
      if (missingColumns.length === 0) {
        console.log("Verification successful! All columns exist.");
      } else {
        console.warn("Warning: Some columns may not have been added:", missingColumns.join(', '));
      }
    } else {
      console.log("Could not verify columns: No data in practitioners table");
    }
    
  } catch (err) {
    console.error("Unexpected error:", err.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the script
main();
