// Post-Database Setup Verification Script
// Run this after creating the database tables to verify everything works

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function verifyFitnessGroupsImplementation() {
  console.log('🔍 Verifying fitness groups implementation...\n');
  
  try {
    // Test 1: Check if tables exist
    console.log('1. Checking database tables...');
    
    const { data: groups, error: groupsError } = await supabase
      .from('fitness_groups')
      .select('count', { count: 'exact', head: true });
    
    if (groupsError) {
      console.log('❌ fitness_groups table: Not found');
      console.log('   Please run the SQL setup script from MANUAL_DATABASE_SETUP.md');
      return;
    } else {
      console.log('✅ fitness_groups table: Ready');
    }
    
    const { data: members, error: membersError } = await supabase
      .from('fitness_group_members')
      .select('count', { count: 'exact', head: true });
    
    if (membersError) {
      console.log('❌ fitness_group_members table: Not found');
      return;
    } else {
      console.log('✅ fitness_group_members table: Ready');
    }
    
    const { data: events, error: eventsError } = await supabase
      .from('fitness_group_events')
      .select('count', { count: 'exact', head: true });
    
    if (eventsError) {
      console.log('❌ fitness_group_events table: Not found');
      return;
    } else {
      console.log('✅ fitness_group_events table: Ready');
    }
    
    // Test 2: Check RLS policies
    console.log('\n2. Testing Row Level Security policies...');
    
    // Test reading groups (should work without auth)
    const { data: publicGroups, error: publicError } = await supabase
      .from('fitness_groups')
      .select('*')
      .limit(1);
    
    if (!publicError) {
      console.log('✅ Public read access: Working');
    } else {
      console.log('❌ Public read access: Failed');
      console.log('   Error:', publicError.message);
    }
    
    console.log('\n3. Database setup verification complete! 🎉');
    console.log('\n📋 Next steps:');
    console.log('   1. Navigate to http://localhost:5175/');
    console.log('   2. Go to the fitness groups page');
    console.log('   3. Test creating, joining, and browsing groups');
    console.log('   4. Verify mobile responsiveness on different screen sizes');
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check your .env file has correct SUPABASE_URL and SUPABASE_ANON_KEY');
    console.log('   2. Ensure database tables are created using MANUAL_DATABASE_SETUP.md');
    console.log('   3. Verify your Supabase project is active');
  }
}

// Run verification
verifyFitnessGroupsImplementation();
