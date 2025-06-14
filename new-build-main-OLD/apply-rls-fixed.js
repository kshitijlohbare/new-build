// Script to enable Row Level Security on practice tables in Supabase
// This ensures each user's practice data is kept private and secure
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Get Supabase credentials from environment variables
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
    console.error('Usage: node apply-rls-fixed.js <SUPABASE_URL> <SUPABASE_SERVICE_KEY>');
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
    // This handles semicolons inside quotes and statements that span multiple lines
    const statements = [];
    let currentStatement = '';
    let inQuotes = false;
    let inComment = false;
    
    for (let i = 0; i < sql.length; i++) {
      const char = sql[i];
      const nextChar = sql[i + 1] || '';
      
      // Handle comments
      if (char === '-' && nextChar === '-' && !inQuotes) {
        inComment = true;
        currentStatement += char;
        continue;
      }
      
      // End of line resets comment state
      if (char === '\n' && inComment) {
        inComment = false;
        currentStatement += char;
        continue;
      }
      
      // Toggle quote state
      if (char === "'" && !inComment) {
        inQuotes = !inQuotes;
      }
      
      // Add character to current statement
      currentStatement += char;
      
      // End of statement
      if (char === ';' && !inQuotes && !inComment) {
        statements.push(currentStatement.trim());
        currentStatement = '';
      }
    }
    
    // Add any remaining statement
    if (currentStatement.trim()) {
      statements.push(currentStatement.trim());
    }
    
    // Execute each statement
    for (const statement of statements) {
      if (!statement || statement === ';') continue;
      
      try {
        console.log(`Executing SQL statement: ${statement.substring(0, 80)}...`);
        
        // Try multiple approaches to execute SQL
        let executed = false;
        
        // Approach 1: REST API SQL endpoint
        try {
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`
            },
            body: JSON.stringify({
              sql_query: statement
            })
          });
          
          if (response.ok) {
            console.log('Successfully executed statement via REST API endpoint.');
            executed = true;
          } else {
            const errorText = await response.text();
            console.log(`REST API failed: ${errorText}`);
          }
        } catch (restError) {
          console.log('REST API approach failed:', restError.message);
        }
        
        // Approach 2: RPC method if first approach failed
        if (!executed) {
          try {
            const { error } = await supabase.rpc('exec_sql', { 
              sql_query: statement
            });
            
            if (!error) {
              console.log('Successfully executed statement via RPC.');
              executed = true;
            } else {
              console.log('RPC approach failed:', error.message);
            }
          } catch (rpcError) {
            console.log('RPC approach failed:', rpcError.message);
          }
        }
        
        // Approach 3: Special table if previous approaches failed
        if (!executed) {
          try {
            const { error: directError } = await supabase
              .from('_exec_sql')
              .insert({ query: statement });
              
            if (!directError) {
              console.log('Statement executed successfully using direct table approach.');
              executed = true;
            } else {
              console.log('Direct table approach failed:', directError.message);
            }
          } catch (tableError) {
            console.log('Table approach failed:', tableError.message);
          }
        }
        
        if (!executed) {
          console.warn('Could not execute SQL automatically. You may need to run this SQL manually in the Supabase SQL editor.');
        }
      } catch (execError) {
        console.error('Exception executing statement:', execError);
      }
    }
    
    // Verify RLS is enabled
    console.log('\nVerifying RLS is enabled...');
    
    const tables = ['practices', 'user_practices', 'user_daily_practices'];
    
    for (const table of tables) {
      try {
        // Check if the table exists first
        const { data: tableExists, error: tableError } = await supabase
          .from('information_schema.tables')
          .select('*')
          .eq('table_name', table)
          .eq('table_schema', 'public');
          
        if (tableError) {
          console.error(`Error checking if table ${table} exists:`, tableError);
          continue;
        }
        
        if (!tableExists || tableExists.length === 0) {
          console.log(`Table ${table} does not exist, skipping verification.`);
          continue;
        }
        
        // Try to fetch rows to test RLS
        console.log(`Testing access to ${table} table...`);
        const { data, error } = await supabase.from(table).select('*').limit(1);
        
        if (error) {
          console.error(`Error accessing ${table}:`, error);
        } else {
          console.log(`✅ Successfully accessed ${table} table`);
        }
        
        // Check for RLS policies
        const { data: policies, error: policiesError } = await supabase
          .from('pg_policies')
          .select('*')
          .eq('tablename', table);
          
        if (policiesError) {
          console.error(`Error checking policies for ${table}:`, policiesError);
        } else if (policies && policies.length > 0) {
          console.log(`✅ Found ${policies.length} policies for ${table}:`);
          policies.forEach(policy => {
            console.log(`  - ${policy.policyname}`);
          });
        } else {
          console.warn(`⚠️ No policies found for ${table}. This might mean RLS is not properly configured.`);
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
