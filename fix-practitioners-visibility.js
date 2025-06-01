// fix-practitioners-visibility.js
// This script fixes visibility issues with practitioners by:
// 1. Checking if the practitioners table exists
// 2. Checking if there's data in the table
// 3. Verifying if RLS is enabled on the table
// 4. Adding an appropriate read policy if needed

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// Initialize Supabase client with error handling for SSL certificate issues
const createSupabaseClient = () => {
  // Detect Node.js environment
  const isNode = typeof window === 'undefined';

  if (isNode) {
    console.warn('Running in Node.js environment');
    // Disable SSL verification in Node.js environment (for development only!)
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  return createClient(supabaseUrl, supabaseKey);
};

const supabase = createSupabaseClient();

async function fixPractitionersVisibility() {
  console.log('Starting practitioners visibility fix...');

  // 1. Check if the practitioners table exists
  try {
    console.log('Checking if practitioners table exists...');
    const { data: tableData, error: tableError } = await supabase.rpc('pg_exec', {
      query: "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'practitioners')"
    });

    if (tableError) {
      console.error('Error checking table existence:', tableError);
      // Try direct query as fallback
      const { data, error } = await supabase.from('practitioners').select('count(*)');
      if (error) {
        console.error('Error querying practitioners table:', error);
        if (error.code === 'PGRST204') {
          console.error('Table does not exist or is not accessible');
          return;
        }
      } else {
        console.log('Table exists and is accessible');
      }
    } else {
      const tableExists = tableData && tableData.length > 0 && tableData[0]?.exists;
      console.log('Table exists check result:', tableExists);
      
      if (!tableExists) {
        console.log('The practitioners table does not exist. Please run setup script first.');
        return;
      }
    }

    // 2. Check if there's data in the table
    console.log('Checking if there is data in the practitioners table...');
    const { data: countData, error: countError } = await supabase
      .from('practitioners')
      .select('count()')
      .single();

    if (countError) {
      console.error('Error counting practitioners:', countError);
      if (countError.code === 'PGRST301') {
        console.error('RLS policy may be preventing access. Will attempt to fix.');
      }
    } else {
      console.log(`Found ${countData ? countData.count : 0} practitioners in the database.`);
    }

    // 3. Check if RLS is enabled
    console.log('Checking RLS status for practitioners table...');
    const { data: rlsData, error: rlsError } = await supabase.rpc('pg_exec', {
      query: "SELECT relrowsecurity FROM pg_class WHERE relname = 'practitioners' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')"
    });

    if (rlsError) {
      console.error('Error checking RLS status:', rlsError);
    } else {
      const rlsEnabled = rlsData && rlsData.length > 0 && rlsData[0]?.relrowsecurity === true;
      console.log('RLS enabled on practitioners table:', rlsEnabled);

      // 4. If RLS is enabled, check for read policy
      if (rlsEnabled) {
        console.log('Checking for existing read policies...');
        const { data: policiesData, error: policiesError } = await supabase.rpc('pg_exec', {
          query: "SELECT polname FROM pg_policy WHERE polrelid = 'public.practitioners'::regclass"
        });

        if (policiesError) {
          console.error('Error checking policies:', policiesError);
        } else {
          const policies = policiesData || [];
          console.log('Existing policies:', policies);

          // Check if there's a read policy already
          const hasReadPolicy = policies.some(p => 
            p.polname.toLowerCase().includes('read') || 
            p.polname.toLowerCase().includes('select') || 
            p.polname.toLowerCase().includes('all')
          );

          if (!hasReadPolicy) {
            console.log('No read policy found. Adding one...');
            
            // Create a policy for anonymous read access
            const { error: createPolicyError } = await supabase.rpc('pg_exec', {
              query: `
                CREATE POLICY "Allow anonymous read access to practitioners" 
                ON public.practitioners 
                FOR SELECT 
                USING (true)
              `
            });

            if (createPolicyError) {
              console.error('Error creating read policy:', createPolicyError);
            } else {
              console.log('Read policy created successfully!');
            }
          } else {
            console.log('Read policy already exists.');
          }
        }
      } else {
        // If RLS is not enabled, enable it and add a read policy
        console.log('RLS is not enabled. Enabling RLS and adding read policy...');
        
        // Enable RLS
        const { error: enableRlsError } = await supabase.rpc('pg_exec', {
          query: "ALTER TABLE public.practitioners ENABLE ROW LEVEL SECURITY"
        });

        if (enableRlsError) {
          console.error('Error enabling RLS:', enableRlsError);
        } else {
          console.log('RLS enabled successfully!');
          
          // Add read policy
          const { error: createPolicyError } = await supabase.rpc('pg_exec', {
            query: `
              CREATE POLICY "Allow anonymous read access to practitioners" 
              ON public.practitioners 
              FOR SELECT 
              USING (true)
            `
          });

          if (createPolicyError) {
            console.error('Error creating read policy:', createPolicyError);
          } else {
            console.log('Read policy created successfully!');
          }
        }
      }
    }

    // 5. Verify fix by attempting to read data again
    console.log('Verifying fix by querying practitioners...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('practitioners')
      .select('*')
      .limit(1);

    if (verifyError) {
      console.error('Error in verification query:', verifyError);
      console.log('Fix may not have worked. Additional troubleshooting may be required.');
    } else {
      console.log('Verification successful! Found data:', verifyData);
      console.log('The practitioner visibility issue should now be fixed.');
    }

  } catch (error) {
    console.error('Unexpected error during fix process:', error);
  }
}

fixPractitionersVisibility().catch(console.error);
