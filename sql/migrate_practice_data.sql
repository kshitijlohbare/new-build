-- Migration script to consolidate practice data
-- This SQL can be run in the Supabase SQL Editor

-- IMPORTANT: This is a destructive operation that modifies data
-- Make sure you have a backup before running this in production

-- Step 1: Create a function to migrate data for a specific user
CREATE OR REPLACE FUNCTION migrate_user_practice_data(target_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  practice_data JSONB;
  daily_practice_ids UUID[];
  result BOOLEAN;
BEGIN
  -- Get existing practice data
  SELECT practices_data INTO practice_data
  FROM user_practices
  WHERE user_id = target_user_id;
  
  -- If no practice data exists yet, initialize it
  IF practice_data IS NULL THEN
    practice_data := '{"practices": [], "progress": {"totalPoints": 0, "level": 1, "streakDays": 0, "totalCompleted": 0, "achievements": []}}';
  END IF;
  
  -- Get all daily practice IDs for this user
  SELECT array_agg(practice_id)
  INTO daily_practice_ids
  FROM user_daily_practices
  WHERE user_id = target_user_id;
  
  -- If there are daily practices, update the isDaily flag
  IF daily_practice_ids IS NOT NULL AND array_length(daily_practice_ids, 1) > 0 THEN
    -- Update each practice in the practices array
    WITH practices AS (
      SELECT jsonb_array_elements(practice_data->'practices') AS practice
    ),
    updated_practices AS (
      SELECT 
        CASE
          WHEN (practice->>'id')::UUID = ANY(daily_practice_ids) THEN
            jsonb_set(practice, '{isDaily}', 'true')
          ELSE
            jsonb_set(practice, '{isDaily}', 'false')
        END AS practice
      FROM practices
    )
    SELECT jsonb_agg(practice) 
    INTO practice_data 
    FROM updated_practices;
    
    -- Update the practices_data
    UPDATE user_practices
    SET practices_data = practice_data
    WHERE user_id = target_user_id;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Create a function to migrate all users
CREATE OR REPLACE FUNCTION migrate_all_user_practice_data()
RETURNS SETOF TEXT AS $$
DECLARE
  user_rec RECORD;
  success_count INT := 0;
  error_count INT := 0;
  result_message TEXT;
BEGIN
  -- Process each user with daily practices
  FOR user_rec IN 
    SELECT DISTINCT user_id 
    FROM user_daily_practices
  LOOP
    BEGIN
      -- Migrate this user's data
      PERFORM migrate_user_practice_data(user_rec.user_id);
      success_count := success_count + 1;
      
      -- Report progress
      result_message := 'Migrated user: ' || user_rec.user_id;
      RETURN NEXT result_message;
    EXCEPTION WHEN OTHERS THEN
      -- Log errors but continue
      error_count := error_count + 1;
      result_message := 'Error migrating user ' || user_rec.user_id || ': ' || SQLERRM;
      RETURN NEXT result_message;
    END;
  END LOOP;
  
  -- Report final results
  result_message := 'Migration complete. Successfully processed ' || success_count || 
                    ' users with ' || error_count || ' errors.';
  RETURN NEXT result_message;
END;
$$ LANGUAGE plpgsql;

-- To run the migration for all users, execute:
-- SELECT * FROM migrate_all_user_practice_data();
