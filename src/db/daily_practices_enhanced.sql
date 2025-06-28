-- Daily Practices Enhancement SQL
-- This script creates the enhanced daily practices system with points tracking

-- 1. Add points_per_minute column to practices table
DO $$
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'practices' AND column_name = 'points_per_minute'
  ) THEN
    ALTER TABLE practices ADD COLUMN points_per_minute INTEGER DEFAULT 1;
    
    -- Set default points per minute values for existing practices
    UPDATE practices SET points_per_minute = 2 WHERE name = 'Cold Shower Exposure';
    UPDATE practices SET points_per_minute = 3 WHERE name = 'Gratitude Journal';
    UPDATE practices SET points_per_minute = 4 WHERE name = 'Focus Breathing (3:3:6)';
    UPDATE practices SET points_per_minute = 2 WHERE points_per_minute IS NULL;
  END IF;
END
$$;

-- 2. Create enhanced user daily practices table
CREATE TABLE IF NOT EXISTS user_daily_practices_enhanced (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  practice_ids INTEGER[] DEFAULT '{}', -- Array of practice IDs that are marked as daily
  points INTEGER DEFAULT 0, -- Accumulated points
  streaks INTEGER DEFAULT 0, -- Consecutive days of practice
  longest_streak INTEGER DEFAULT 0, -- Longest streak achieved
  last_activity_date TIMESTAMPTZ DEFAULT NULL, -- Last date any practice was completed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 3. Create practice completion tracking table for detailed analytics
CREATE TABLE IF NOT EXISTS practice_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  practice_id INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  duration_minutes INTEGER DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indices for better performance
CREATE INDEX IF NOT EXISTS idx_user_daily_practices_enhanced_user_id ON user_daily_practices_enhanced(user_id);
CREATE INDEX IF NOT EXISTS idx_practice_completions_user_id ON practice_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_practice_completions_practice_id ON practice_completions(practice_id);
CREATE INDEX IF NOT EXISTS idx_practice_completions_completed_at ON practice_completions(completed_at);

-- 4. Create helper functions

-- Function to add a practice to daily practices
CREATE OR REPLACE FUNCTION add_daily_practice(p_user_id UUID, p_practice_id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  practice_exists BOOLEAN;
BEGIN
  -- Check if user already has an entry in the enhanced table
  SELECT EXISTS (
    SELECT 1 FROM user_daily_practices_enhanced WHERE user_id = p_user_id
  ) INTO practice_exists;
  
  IF NOT practice_exists THEN
    -- Create new entry for user
    INSERT INTO user_daily_practices_enhanced (
      user_id, 
      practice_ids,
      points,
      streaks,
      longest_streak,
      last_activity_date,
      created_at,
      updated_at
    ) VALUES (
      p_user_id,
      ARRAY[p_practice_id],
      0,
      0,
      0,
      NULL,
      NOW(),
      NOW()
    );
  ELSE
    -- Update existing entry to add practice to array if not already there
    UPDATE user_daily_practices_enhanced
    SET practice_ids = array_append(
      ARRAY(
        SELECT DISTINCT unnest(practice_ids) 
        FROM user_daily_practices_enhanced 
        WHERE user_id = p_user_id AND 
        NOT p_practice_id = ANY(practice_ids)
      ),
      p_practice_id
    ),
    updated_at = NOW()
    WHERE user_id = p_user_id AND NOT p_practice_id = ANY(practice_ids);
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to remove a practice from daily practices
CREATE OR REPLACE FUNCTION remove_daily_practice(p_user_id UUID, p_practice_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
  -- Update array by removing the practice ID
  UPDATE user_daily_practices_enhanced
  SET practice_ids = array_remove(practice_ids, p_practice_id),
      updated_at = NOW()
  WHERE user_id = p_user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to mark a daily practice as complete
CREATE OR REPLACE FUNCTION complete_daily_practice(p_user_id UUID, p_practice_id INTEGER, p_duration_minutes INTEGER)
RETURNS INTEGER AS $$
DECLARE
  points_per_min INTEGER;
  total_points INTEGER;
  practice_exists BOOLEAN;
  current_date DATE := CURRENT_DATE;
  last_date DATE;
BEGIN
  -- Get the practice's points per minute value
  SELECT points_per_minute INTO points_per_min FROM practices WHERE id = p_practice_id;
  
  -- Default to 1 point per minute if not set
  IF points_per_min IS NULL THEN
    points_per_min := 1;
  END IF;
  
  -- Calculate points earned
  total_points := p_duration_minutes * points_per_min;
  
  -- Add completion record
  INSERT INTO practice_completions (
    user_id,
    practice_id,
    completed_at,
    duration_minutes,
    points_earned
  ) VALUES (
    p_user_id,
    p_practice_id,
    NOW(),
    p_duration_minutes,
    total_points
  );
  
  -- Check if user has an entry in enhanced table
  SELECT EXISTS (
    SELECT 1 FROM user_daily_practices_enhanced WHERE user_id = p_user_id
  ) INTO practice_exists;
  
  IF NOT practice_exists THEN
    -- Create new entry with the practice ID and points
    INSERT INTO user_daily_practices_enhanced (
      user_id,
      practice_ids,
      points,
      streaks,
      longest_streak,
      last_activity_date
    ) VALUES (
      p_user_id,
      ARRAY[p_practice_id],
      total_points,
      1,
      1,
      NOW()
    );
  ELSE
    -- Get the last activity date
    SELECT last_activity_date::DATE INTO last_date
    FROM user_daily_practices_enhanced
    WHERE user_id = p_user_id;
    
    -- Update points and streaks
    UPDATE user_daily_practices_enhanced
    SET points = points + total_points,
        -- Add practice to array if not already there
        practice_ids = CASE 
          WHEN NOT p_practice_id = ANY(practice_ids) THEN array_append(practice_ids, p_practice_id)
          ELSE practice_ids
        END,
        -- Update streak
        streaks = CASE 
          -- If first activity or activity was yesterday, increment streak
          WHEN last_activity_date IS NULL OR last_date = current_date - INTERVAL '1 day' THEN streaks + 1
          -- If activity is from today, keep same streak
          WHEN last_date = current_date THEN streaks
          -- Otherwise reset streak to 1 (broken streak)
          ELSE 1
        END,
        -- Update longest streak if current streak is higher
        longest_streak = GREATEST(
          longest_streak, 
          CASE 
            WHEN last_activity_date IS NULL OR last_date = current_date - INTERVAL '1 day' THEN streaks + 1
            WHEN last_date = current_date THEN streaks
            ELSE 1
          END
        ),
        last_activity_date = NOW(),
        updated_at = NOW()
    WHERE user_id = p_user_id;
  END IF;
  
  -- Return the points earned for this completion
  RETURN total_points;
END;
$$ LANGUAGE plpgsql;

-- Function to reset daily practice completions (run at midnight)
CREATE OR REPLACE FUNCTION reset_daily_practice_completions()
RETURNS INTEGER AS $$
DECLARE
  affected_count INTEGER;
BEGIN
  -- We don't actually delete completion records - they stay in practice_completions
  -- This function just lets us know it's a new day for streak calculations
  -- In a real app, this would be called by a scheduled job at midnight
  
  -- Get count of users with completions today
  SELECT COUNT(DISTINCT user_id) INTO affected_count
  FROM practice_completions
  WHERE completed_at::DATE = CURRENT_DATE;
  
  RETURN affected_count;
END;
$$ LANGUAGE plpgsql;

-- 5. Add Row Level Security policies

-- Enable RLS on new tables
ALTER TABLE user_daily_practices_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_completions ENABLE ROW LEVEL SECURITY;

-- User can only view and modify their own daily practices
DROP POLICY IF EXISTS "Users can view their own enhanced daily practices" ON user_daily_practices_enhanced;
CREATE POLICY "Users can view their own enhanced daily practices" 
  ON user_daily_practices_enhanced FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can modify their own enhanced daily practices" ON user_daily_practices_enhanced;
CREATE POLICY "Users can modify their own enhanced daily practices" 
  ON user_daily_practices_enhanced FOR ALL USING (auth.uid() = user_id);

-- User can only view and insert their own practice completions
DROP POLICY IF EXISTS "Users can view their own practice completions" ON practice_completions;
CREATE POLICY "Users can view their own practice completions" 
  ON practice_completions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can add their own practice completions" ON practice_completions;
CREATE POLICY "Users can add their own practice completions" 
  ON practice_completions FOR INSERT WITH CHECK (auth.uid() = user_id);
