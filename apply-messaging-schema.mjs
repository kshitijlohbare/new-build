import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
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

const applyMessagingSchema = async () => {
  try {
    console.log('🔄 Applying fitness groups messaging schema...\n');
    
    // Read the SQL file
    const sqlContent = readFileSync('./supabase/fitness_groups_messaging_schema.sql', 'utf8');
    
    // Split SQL into individual statements (simple approach)
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements to execute\n`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.includes('CREATE TABLE') || statement.includes('CREATE OR REPLACE FUNCTION') || statement.includes('CREATE POLICY')) {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        
        try {
          const { data, error } = await supabase.rpc('exec_sql', { 
            sql_query: statement + ';' 
          });
          
          if (error) {
            console.log(`⚠️  Warning for statement ${i + 1}:`, error.message);
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.log(`❌ Error in statement ${i + 1}:`, err.message);
        }
      }
    }
    
    console.log('\n🎉 Schema application complete!');
    
    // Test the new tables
    console.log('\n🔍 Testing new tables...');
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
        console.log(`✅ ${tableName}: created successfully`);
      }
    }
    
  } catch (error) {
    console.error('💥 Failed to apply schema:', error);
  }
};

applyMessagingSchema();
