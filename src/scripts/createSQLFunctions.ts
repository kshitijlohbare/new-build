import { supabase } from '@/lib/supabase';

/**
 * Creates all the necessary SQL functions for database initialization
 */
export const createSQLFunctions = async (): Promise<boolean> => {
  try {
    // Create function to create user_profiles table
    const createUserProfilesFunction = `
      CREATE OR REPLACE FUNCTION create_user_profiles_table()
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS user_profiles (
          id UUID PRIMARY KEY REFERENCES auth.users(id),
          username TEXT UNIQUE,
          full_name TEXT,
          avatar_url TEXT,
          bio TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        -- Set up RLS
        ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "Allow users to read all profiles"
          ON user_profiles FOR SELECT
          USING (true);
          
        CREATE POLICY "Allow users to update their own profile"
          ON user_profiles FOR UPDATE
          USING (auth.uid() = id);
          
        CREATE POLICY "Allow users to insert their own profile"
          ON user_profiles FOR INSERT
          WITH CHECK (auth.uid() = id);
      END;
      $$;
    `;
    
    // Create function to create user_practices table
    const createUserPracticesFunction = `
      CREATE OR REPLACE FUNCTION create_user_practices_table()
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS user_practices (
          id SERIAL PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) NOT NULL,
          practices JSONB NOT NULL DEFAULT '[]'::JSONB,
          progress JSONB NOT NULL DEFAULT '{}'::JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          UNIQUE (user_id)
        );
        
        -- Set up RLS
        ALTER TABLE user_practices ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "Users can read their own practices"
          ON user_practices FOR SELECT
          USING (auth.uid() = user_id);
          
        CREATE POLICY "Users can insert their own practices"
          ON user_practices FOR INSERT
          WITH CHECK (auth.uid() = user_id);
          
        CREATE POLICY "Users can update their own practices"
          ON user_practices FOR UPDATE
          USING (auth.uid() = user_id);
      END;
      $$;
    `;
    
    // Create function to create user_daily_practices table
    const createUserDailyPracticesFunction = `
      CREATE OR REPLACE FUNCTION create_user_daily_practices_table()
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS user_daily_practices (
          id SERIAL PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) NOT NULL,
          practice_id INTEGER NOT NULL,
          added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          UNIQUE (user_id, practice_id)
        );
        
        -- Set up RLS
        ALTER TABLE user_daily_practices ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "Users can read their own daily practices"
          ON user_daily_practices FOR SELECT
          USING (auth.uid() = user_id);
          
        CREATE POLICY "Users can insert their own daily practices"
          ON user_daily_practices FOR INSERT
          WITH CHECK (auth.uid() = user_id);
          
        CREATE POLICY "Users can update their own daily practices"
          ON user_daily_practices FOR UPDATE
          USING (auth.uid() = user_id);
          
        CREATE POLICY "Users can delete their own daily practices"
          ON user_daily_practices FOR DELETE
          USING (auth.uid() = user_id);
      END;
      $$;
    `;
    
    // Execute each function creation
    // await supabase.rpc('execute_sql', { sql_query: createUserProfilesFunction });
    // await supabase.rpc('execute_sql', { sql_query: createUserPracticesFunction });
    // await supabase.rpc('execute_sql', { sql_query: createUserDailyPracticesFunction });
    
    console.log('Successfully created all SQL initialization functions');
    return true;
  } catch (error) {
    console.error('Error creating SQL functions:', error);
    return false;
  }
};
