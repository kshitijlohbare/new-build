// check-practitioners-rls-policies.js
// Script to check the current RLS policies on practitioners table

import { createClient } from '@supabase/supabase-js';

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

async function checkRlsPolicies() {
  console.log('Checking RLS policies on practitioners table...');
  
  try {
    // Check if RLS is enabled
    const { data: rlsData, error: rlsError } = await supabase.rpc('pg_exec', {
      query: "SELECT relrowsecurity FROM pg_class WHERE relname = 'practitioners' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')"
    });
    
    if (rlsError) {
      console.error('Error checking RLS status:', rlsError);
    } else {
      const rlsEnabled = rlsData && rlsData.length > 0 && rlsData[0]?.relrowsecurity === true;
      console.log('RLS enabled on practitioners table:', rlsEnabled);
      
      if (!rlsEnabled) {
        console.log('No RLS policies needed as RLS is disabled.');
        return;
      }
    }
    
    // Get all policies
    const { data: policiesData, error: policiesError } = await supabase.rpc('pg_exec', {
      query: `
        SELECT 
          pol.polname as policy_name, 
          CASE 
            WHEN pol.polcmd = 'r' THEN 'SELECT'
            WHEN pol.polcmd = 'a' THEN 'INSERT'
            WHEN pol.polcmd = 'w' THEN 'UPDATE'
            WHEN pol.polcmd = 'd' THEN 'DELETE'
            WHEN pol.polcmd = '*' THEN 'ALL'
          END as permission,
          pg_get_expr(pol.polqual, pol.polrelid) as using_expression,
          pg_get_expr(pol.polwithcheck, pol.polrelid) as with_check_expression,
          pol.polroles as role_names
        FROM pg_policy pol
        JOIN pg_class cls ON pol.polrelid = cls.oid
        WHERE cls.relname = 'practitioners'
      `
    });
    
    if (policiesError) {
      console.error('Error getting policies:', policiesError);
      return;
    }
    
    if (!policiesData || policiesData.length === 0) {
      console.log('No policies found for practitioners table.');
      return;
    }
    
    console.log('Current RLS policies:');
    policiesData.forEach((policy, index) => {
      console.log(`\nPolicy #${index + 1}:`);
      console.log(`  Name: ${policy.policy_name}`);
      console.log(`  Permission: ${policy.permission}`);
      console.log(`  Using expression: ${policy.using_expression}`);
      if (policy.with_check_expression) {
        console.log(`  With check expression: ${policy.with_check_expression}`);
      }
    });
    
    // Check for anonymous access policy
    const hasAnonymousAccess = policiesData.some(p => 
      p.permission === 'SELECT' && p.using_expression === 'true'
    );
    
    console.log('\nAnonymous read access:', hasAnonymousAccess ? 'ENABLED' : 'DISABLED');
    
    if (!hasAnonymousAccess) {
      console.log('WARNING: No policy grants anonymous read access to practitioners.');
    } else {
      console.log('Practitioners are properly set up for anonymous read access.');
    }
    
  } catch (err) {
    console.error('Exception during policy check:', err);
  }
}

checkRlsPolicies().catch(console.error);
