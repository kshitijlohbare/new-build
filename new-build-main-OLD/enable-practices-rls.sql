-- Enable Row Level Security for practice-related tables
-- This ensures that each user can only access their own practice data

-- 1. Enable RLS on all practice-related tables
ALTER TABLE IF EXISTS practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_daily_practices ENABLE ROW LEVEL SECURITY;

-- 2. Set up policies for the practices table (system-wide practices)
-- Everyone can view system practices
DROP POLICY IF EXISTS "Everyone can view system practices" ON practices;
CREATE POLICY "Everyone can view system practices" ON practices
  FOR SELECT USING (true);

-- Only admins or the system can modify system practices
DROP POLICY IF EXISTS "Only admins can modify system practices" ON practices;
CREATE POLICY "Only admins can modify system practices" ON practices
  FOR ALL USING (
    -- Assuming there's an admin role or check that can be performed
    -- In a real system, this would check if the user is an admin
    auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%admin%')
  );

-- 3. Set up policies for user_practices table
-- Users can only view their own practice data
DROP POLICY IF EXISTS "Users can view their own practice data" ON user_practices;
CREATE POLICY "Users can view their own practice data" ON user_practices
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only modify their own practice data
DROP POLICY IF EXISTS "Users can modify their own practice data" ON user_practices;
CREATE POLICY "Users can modify their own practice data" ON user_practices
  FOR ALL USING (auth.uid() = user_id);

-- 4. Set up policies for user_daily_practices table
-- Users can only view their own daily practices
DROP POLICY IF EXISTS "Users can view their own daily practices" ON user_daily_practices;
CREATE POLICY "Users can view their own daily practices" ON user_daily_practices
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only modify their own daily practices
DROP POLICY IF EXISTS "Users can modify their own daily practices" ON user_daily_practices;
CREATE POLICY "Users can modify their own daily practices" ON user_daily_practices
  FOR ALL USING (auth.uid() = user_id);

-- 5. Add completion tracking in user_daily_practices
-- First check if the column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'user_daily_practices' 
    AND column_name = 'completed'
  ) THEN
    ALTER TABLE user_daily_practices ADD COLUMN completed BOOLEAN DEFAULT FALSE;
    ALTER TABLE user_daily_practices ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
    ALTER TABLE user_daily_practices ADD COLUMN streak INTEGER DEFAULT 0;
  END IF;
END
$$;

-- Create or update function to add a trigger for managing user practice completion
CREATE OR REPLACE FUNCTION update_user_practice_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process when the completion status changes
  IF OLD.completed IS DISTINCT FROM NEW.completed THEN
    -- If marked as completed
    IF NEW.completed = TRUE THEN
      NEW.completed_at = CURRENT_TIMESTAMP;
    ELSE
      NEW.completed_at = NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to update timestamps and handle completion logic
DROP TRIGGER IF EXISTS user_practice_completion_trigger ON user_daily_practices;
CREATE TRIGGER user_practice_completion_trigger
BEFORE UPDATE ON user_daily_practices
FOR EACH ROW EXECUTE PROCEDURE update_user_practice_completion();

-- Add daily_practices, daily_points, and streaks columns to user_practices if not present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name = 'user_practices' AND column_name = 'daily_practices'
  ) THEN
    ALTER TABLE user_practices ADD COLUMN daily_practices JSONB DEFAULT '[]'::jsonb;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name = 'user_practices' AND column_name = 'daily_points'
  ) THEN
    ALTER TABLE user_practices ADD COLUMN daily_points INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name = 'user_practices' AND column_name = 'streaks'
  ) THEN
    ALTER TABLE user_practices ADD COLUMN streaks INTEGER DEFAULT 0;
  END IF;
END$$;
