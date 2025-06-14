import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const testMessagingTables = async () => {
  console.log('🔍 Testing messaging tables access...\n');
  
  // Test basic tables first
  try {
    const { data: groups, error: groupsError } = await supabase
      .from('fitness_groups')
      .select('id, name, creator_id')
      .limit(5);
    
    if (groupsError) {
      console.log('❌ fitness_groups error:', groupsError.message);
    } else {
      console.log('✅ fitness_groups accessible:', groups?.length || 0, 'groups found');
    }
  } catch (err) {
    console.log('❌ fitness_groups exception:', err.message);
  }

  // Test messaging tables
  const messagingTables = [
    'fitness_group_messages',
    'fitness_group_announcements', 
    'fitness_group_member_reports',
    'fitness_group_member_bans',
    'fitness_group_admin_logs'
  ];
  
  for (const table of messagingTables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: accessible (${data?.length || 0} records)`);
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`);
    }
  }
  
  // Try to create a simple message table manually
  console.log('\n🔧 Attempting to create fitness_group_messages table manually...');
  
  try {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS public.fitness_group_messages (
        id SERIAL PRIMARY KEY,
        group_id INTEGER NOT NULL,
        user_id UUID NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        is_deleted BOOLEAN DEFAULT FALSE
      );
    `;
    
    // Try with a direct query approach
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql_query: createTableSQL 
    });
    
    if (error) {
      console.log('❌ Create table error:', error.message);
    } else {
      console.log('✅ Table creation successful');
    }
  } catch (err) {
    console.log('❌ Create table exception:', err.message);
  }
  
  console.log('\n✨ Test complete!');
};

testMessagingTables().catch(console.error);
