import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false
    }
  }
);

// Test fitness groups functionality
const testFitnessGroups = async () => {
  try {
    console.log('🔄 Testing fitness groups functionality...\n');
    
    // Test 1: Check if fitness_groups table exists and get data
    console.log('1. Testing fitness_groups table...');
    const { data: groups, error: groupsError } = await supabase
      .from('fitness_groups')
      .select('*')
      .limit(3);
    
    if (groupsError) {
      console.log('❌ Error accessing fitness_groups:', groupsError.message);
    } else {
      console.log('✅ fitness_groups table accessible');
      console.log(`   Found ${groups.length} groups`);
      if (groups.length > 0) {
        console.log('   Sample group:', groups[0].name);
      }
    }
    
    // Test 2: Check fitness_group_members table
    console.log('\n2. Testing fitness_group_members table...');
    const { data: members, error: membersError } = await supabase
      .from('fitness_group_members')
      .select('*')
      .limit(3);
    
    if (membersError) {
      console.log('❌ Error accessing fitness_group_members:', membersError.message);
    } else {
      console.log('✅ fitness_group_members table accessible');
      console.log(`   Found ${members.length} memberships`);
    }
    
    // Test 3: Check messaging tables (these might not exist yet)
    console.log('\n3. Testing messaging tables...');
    
    const messagingTables = [
      'fitness_group_messages',
      'fitness_group_announcements', 
      'fitness_group_member_reports',
      'fitness_group_member_bans',
      'fitness_group_admin_logs'
    ];
    
    for (const tableName of messagingTables) {
      const { data, error } = await supabase
        .from(tableName)
        .select('id')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${tableName}: ${error.message}`);
      } else {
        console.log(`✅ ${tableName}: accessible`);
      }
    }
    
    console.log('\n🏁 Test complete!');
    
  } catch (error) {
    console.error('💥 Test failed with error:', error);
  }
};

testFitnessGroups();
