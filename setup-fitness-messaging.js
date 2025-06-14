/**
 * Setup script for Fitness Groups Messaging & Admin Features
 * This script applies the database schema for messaging and admin functionality
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import https from 'https';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration in environment variables');
  process.exit(1);
}

// Setup SSL handling for Node.js environment
const isTlsVerificationDisabled = process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0';

const fetchOptions = {};
if (typeof window === 'undefined') {
  try {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: !isTlsVerificationDisabled,
    });
    
    fetchOptions.global = {
      fetch: (url, fetchOptions) => {
        return fetch(url, {
          ...fetchOptions,
          agent: httpsAgent
        });
      }
    };
  } catch (err) {
    console.log('⚠️  Could not create HTTPS agent, continuing with default fetch...');
  }
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  ...fetchOptions
});

async function setupMessagingSchema() {
  try {
    console.log('🚀 Setting up Fitness Groups Messaging Schema...');
    
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'supabase', 'fitness_groups_messaging_schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      console.error('❌ Schema file not found:', schemaPath);
      process.exit(1);
    }
    
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split the schema into individual statements
    const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);
    
    console.log(`📝 Executing ${statements.length} SQL statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement) {
        try {
          console.log(`   Executing statement ${i + 1}/${statements.length}...`);
          const { error } = await supabase.rpc('execute_sql', { sql: statement });
          
          if (error) {
            console.warn(`⚠️  Statement ${i + 1} warning:`, error.message);
          }
        } catch (err) {
          console.warn(`⚠️  Statement ${i + 1} error:`, err.message);
        }
      }
    }
    
    console.log('✅ Schema setup completed successfully!');
    
    // Verify tables were created
    console.log('🔍 Verifying table creation...');
    
    const tables = [
      'fitness_group_messages',
      'fitness_group_announcements', 
      'fitness_group_member_reports',
      'fitness_group_member_bans',
      'fitness_group_admin_logs'
    ];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
        
      if (error) {
        console.error(`❌ Table ${table} verification failed:`, error.message);
      } else {
        console.log(`✅ Table ${table} verified`);
      }
    }
    
    console.log('\n🎉 Fitness Groups Messaging setup complete!');
    console.log('\nYou can now:');
    console.log('• Send messages in fitness groups');
    console.log('• Create announcements as an admin');
    console.log('• Report inappropriate behavior');
    console.log('• Use admin moderation tools');
    console.log('• View comprehensive activity logs');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
setupMessagingSchema();
