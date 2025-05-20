// create-missing-tables.js
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Supabase client configuration
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// SSL workaround for Node.js
const isNode = typeof window === 'undefined' && typeof process !== 'undefined';
if (isNode) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const supabase = createClient(supabaseUrl, supabaseKey);

// SQL for creating missing tables
const createUserDailyPracticesSQL = `
-- Create a table for user daily practices (many-to-many relationship)
CREATE TABLE IF NOT EXISTS user_daily_practices (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  practice_id INTEGER NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, practice_id)
);

-- Create an index for faster lookups by user_id
CREATE INDEX IF NOT EXISTS idx_user_daily_practices_user_id ON user_daily_practices(user_id);
`;

const createUserProfilesSQL = `
-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  website TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
`;

const createUserFollowersSQL = `
-- Create user_followers table for follow relationships
CREATE TABLE IF NOT EXISTS user_followers (
  id SERIAL PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(follower_id, following_id)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_followers_follower_id ON user_followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_followers_following_id ON user_followers(following_id);
`;

const createCommunityDelightsSQL = `
-- Create community_delights table
CREATE TABLE IF NOT EXISTS community_delights (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster user lookups
CREATE INDEX IF NOT EXISTS idx_community_delights_user_id ON community_delights(user_id);

-- Create trigger to update updated_at
DROP TRIGGER IF EXISTS update_community_delights_updated_at ON community_delights;
CREATE TRIGGER update_community_delights_updated_at
BEFORE UPDATE ON community_delights
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
`;

// Function to execute SQL commands
async function executeSQLCommand(sql, tableName) {
  console.log(`Attempting to create ${tableName} table...`);
  
  try {
    // Try with execute_sql function
    const result = await supabase.rpc('execute_sql', { 
      sql_command: sql 
    });
    
    if (result.error) {
      console.error(`Error creating ${tableName} table with execute_sql:`, result.error);
      
      // Try alternative approach
      try {
        // Split into separate statements and execute one by one
        const statements = sql.split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0);
          
        for (const statement of statements) {
          const stmtResult = await supabase.rpc('execute_sql', { 
            sql_command: `${statement};` 
          });
          
          if (stmtResult.error && stmtResult.error.code !== '23505') { // Ignore duplicate key errors
            console.error(`Error executing statement: ${statement}`, stmtResult.error);
          }
        }
        
        console.log(`Created ${tableName} table using statement-by-statement approach`);
        return true;
      } catch (stmtError) {
        console.error(`Failed to create ${tableName} table:`, stmtError);
        return false;
      }
    }
    
    console.log(`Successfully created ${tableName} table!`);
    return true;
  } catch (error) {
    console.error(`Error creating ${tableName} table:`, error);
    return false;
  }
}

// Main function to create all missing tables
async function createMissingTables() {
  console.log('Starting creation of missing database tables...');
  
  try {
    // Create user_profiles table
    await executeSQLCommand(createUserProfilesSQL, 'user_profiles');
    
    // Create user_followers table
    await executeSQLCommand(createUserFollowersSQL, 'user_followers');
    
    // Create community_delights table
    await executeSQLCommand(createCommunityDelightsSQL, 'community_delights');
    
    // Create user_daily_practices table
    await executeSQLCommand(createUserDailyPracticesSQL, 'user_daily_practices');
    
    console.log('Finished creating all missing tables!');
  } catch (error) {
    console.error('Error in table creation process:', error);
  }
}

// Execute the script
createMissingTables()
  .then(() => console.log('Database setup completed'))
  .catch(error => console.error('Failed to set up database:', error));
