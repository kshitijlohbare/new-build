-- Add any missing columns to the user_practices table
DO $$ 
BEGIN 
    -- Check if daily_practices column exists, if not add it
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='user_practices' 
        AND column_name='daily_practices'
    ) THEN 
        ALTER TABLE user_practices 
        ADD COLUMN daily_practices INTEGER[] DEFAULT '{}'::INTEGER[]; 
    END IF;

    -- Check if daily_points column exists, if not add it
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='user_practices' 
        AND column_name='daily_points'
    ) THEN 
        ALTER TABLE user_practices 
        ADD COLUMN daily_points INTEGER DEFAULT 0; 
    END IF;

END $$;