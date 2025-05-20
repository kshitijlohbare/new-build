// add-followers-count-column.js
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Configure Supabase client
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://svnczxevigicuskppyfz.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_KEY) {
  console.error('SUPABASE_ANON_KEY or SUPABASE_SERVICE_KEY is required but not set in env vars');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function addFollowersCountColumn() {
  console.log('Adding followers_count column to user_profiles table...');
  
  try {
    // Execute raw SQL to add the column if it doesn't exist
    // Note: This requires elevated permissions (service role key)
    const { data, error } = await supabase.rpc('execute_sql', {
      query: `
        DO $$
        BEGIN
          -- Check if the column already exists
          IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'user_profiles' 
            AND column_name = 'followers_count'
          ) THEN
            -- Add the column with a default value of 0
            ALTER TABLE user_profiles ADD COLUMN followers_count integer NOT NULL DEFAULT 0;
            
            -- Add comment explaining the column
            COMMENT ON COLUMN user_profiles.followers_count IS 'Count of followers for this user, updated by trigger';
            
            -- Create a function to update the count
            CREATE OR REPLACE FUNCTION update_followers_count()
            RETURNS TRIGGER AS $$
            BEGIN
              -- Update count for follow
              IF (TG_OP = 'INSERT') THEN
                UPDATE user_profiles 
                SET followers_count = followers_count + 1
                WHERE id = NEW.following_id;
              -- Update count for unfollow
              ELSIF (TG_OP = 'DELETE') THEN
                UPDATE user_profiles
                SET followers_count = GREATEST(0, followers_count - 1)
                WHERE id = OLD.following_id;
              END IF;
              RETURN NULL;
            END;
            $$ LANGUAGE plpgsql;
            
            -- Create trigger for the function
            DROP TRIGGER IF EXISTS update_followers_count_trigger ON user_followers;
            CREATE TRIGGER update_followers_count_trigger
            AFTER INSERT OR DELETE ON user_followers
            FOR EACH ROW
            EXECUTE FUNCTION update_followers_count();
            
            -- Initialize counts based on existing data
            WITH follower_counts AS (
              SELECT 
                following_id, 
                COUNT(*) as count
              FROM user_followers
              GROUP BY following_id
            )
            UPDATE user_profiles up
            SET followers_count = fc.count
            FROM follower_counts fc
            WHERE up.id = fc.following_id;
            
            RAISE NOTICE 'Column followers_count added to user_profiles table';
          ELSE
            RAISE NOTICE 'Column followers_count already exists';
          END IF;
        END $$;
      `
    });

    if (error) {
      console.error('Error adding column:', error);
    } else {
      console.log('Column added or already exists');
    }
  } catch (error) {
    console.error('Exception during column addition:', error);
  }
}

// Run the function
addFollowersCountColumn()
  .catch(console.error)
  .finally(() => console.log('Finished'));
