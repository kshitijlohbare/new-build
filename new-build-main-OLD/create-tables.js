// Script to create the required tables in Supabase
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the SQL file
const sqlContent = fs.readFileSync(path.join(__dirname, 'src/db/wellbeing_tables_setup.sql'), 'utf8');

// Supabase credentials (same as in src/lib/supabase.ts)
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// Create a Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  try {
    // Execute the SQL using Supabase's REST API
    console.log('Creating tables in Supabase...');
    
    // Direct SQL execution using raw REST API calls since rpc might not be available
    console.log('Creating practices table...');
    const { data: practicesTableResult, error: practicesTableError } = await supabase
      .from('practices')
      .select('count(*)')
      .limit(1)
      .maybeSingle();
    
    if (practicesTableError && practicesTableError.code === 'PGRST301') {
      // Table doesn't exist, we need to create it
      console.log('Practices table does not exist, creating it...');
      
      // Use the Supabase SQL REST API endpoint directly
      try {
        const sqlForPracticesTable = `
          CREATE TABLE IF NOT EXISTS practices (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            benefits JSONB DEFAULT '[]'::jsonb,
            duration INTEGER,
            points INTEGER,
            icon TEXT,
            tags JSONB DEFAULT '[]'::jsonb,
            steps JSONB DEFAULT '[]'::jsonb,
            source TEXT,
            is_system_practice BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `;
        
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({
            query: sqlForPracticesTable
          })
        });
        
        if (!response.ok) {
          console.error('Error creating practices table:', await response.text());
        } else {
          console.log('Practices table created successfully');
        }
      } catch (e) {
        console.error('Exception creating practices table:', e);
      }
    } else {
      console.log('Practices table already exists');
    }
    
    // Create user_practices table
    console.log('Creating user_practices table...');
    const { data: userPracticesTableResult, error: userPracticesTableError } = await supabase
      .from('user_practices')
      .select('count(*)')
      .limit(1)
      .maybeSingle();
    
    if (userPracticesTableError && userPracticesTableError.code === 'PGRST301') {
      // Table doesn't exist, we need to create it
      console.log('user_practices table does not exist, creating it...');
      
      try {
        const sqlForUserPracticesTable = `
          CREATE TABLE IF NOT EXISTS user_practices (
            id SERIAL PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            practices JSONB DEFAULT '[]'::jsonb,
            progress JSONB DEFAULT '{}'::jsonb,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id)
          );
        `;
        
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({
            query: sqlForUserPracticesTable
          })
        });
        
        if (!response.ok) {
          console.error('Error creating user_practices table:', await response.text());
        } else {
          console.log('user_practices table created successfully');
        }
      } catch (e) {
        console.error('Exception creating user_practices table:', e);
      }
    } else {
      console.log('user_practices table already exists');
    }
    
    // Create user_daily_practices table
    console.log('Creating user_daily_practices table...');
    const { data: userDailyPracticesTableResult, error: userDailyPracticesTableError } = await supabase
      .from('user_daily_practices')
      .select('count(*)')
      .limit(1)
      .maybeSingle();
    
    if (userDailyPracticesTableError && userDailyPracticesTableError.code === 'PGRST301') {
      // Table doesn't exist, we need to create it
      console.log('user_daily_practices table does not exist, creating it...');
      
      try {
        const sqlForUserDailyPracticesTable = `
          CREATE TABLE IF NOT EXISTS user_daily_practices (
            id SERIAL PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            practice_id INTEGER NOT NULL,
            added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, practice_id)
          );
          
          CREATE INDEX IF NOT EXISTS idx_user_daily_practices_user_id ON user_daily_practices(user_id);
        `;
        
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({
            query: sqlForUserDailyPracticesTable
          })
        });
        
        if (!response.ok) {
          console.error('Error creating user_daily_practices table:', await response.text());
        } else {
          console.log('user_daily_practices table created successfully');
        }
      } catch (e) {
        console.error('Exception creating user_daily_practices table:', e);
      }
    } else {
      console.log('user_daily_practices table already exists');
    }
    
    console.log('Finished creating tables in Supabase');
    
    // Verify if tables were created
    await verifyTables();
    
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

async function verifyTables() {
  try {
    console.log('Verifying tables...');
    
    // Check if practices table exists
    const { data: practicesData, error: practicesError } = await supabase
      .from('practices')
      .select('count(*)', { count: 'exact' });
      
    if (practicesError) {
      console.error('Error checking practices table:', practicesError);
    } else {
      console.log('Practices table exists with count:', practicesData[0].count);
    }
    
    // Check if user_practices table exists
    const { data: userPracticesData, error: userPracticesError } = await supabase
      .from('user_practices')
      .select('count(*)', { count: 'exact' });
      
    if (userPracticesError) {
      console.error('Error checking user_practices table:', userPracticesError);
    } else {
      console.log('User_practices table exists with count:', userPracticesData[0].count);
    }
    
    // Check if user_daily_practices table exists
    const { data: dailyPracticesData, error: dailyPracticesError } = await supabase
      .from('user_daily_practices')
      .select('count(*)', { count: 'exact' });
      
    if (dailyPracticesError) {
      console.error('Error checking user_daily_practices table:', dailyPracticesError);
    } else {
      console.log('User_daily_practices table exists with count:', dailyPracticesData[0].count);
    }
  } catch (error) {
    console.error('Error verifying tables:', error);
  }
}

// Run the script
createTables();
