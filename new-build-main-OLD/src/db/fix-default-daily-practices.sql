-- Update script to ensure no practices are daily by default
-- This will update the practices table to set is_daily to false for all practices

-- First add the is_daily column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'practices' 
    AND column_name = 'is_daily'
  ) THEN
    ALTER TABLE practices ADD COLUMN is_daily BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Update all practices to have is_daily=false
UPDATE practices SET is_daily = FALSE;

-- Ensure future inserts default to is_daily=false
ALTER TABLE practices ALTER COLUMN is_daily SET DEFAULT FALSE;

-- Log the update
SELECT 'Updated ' || COUNT(*) || ' practices to have is_daily=false' as result FROM practices;

-- Verify no practices are marked as daily in the main practices table
SELECT COUNT(*) as daily_practices_count FROM practices WHERE is_daily = TRUE;
