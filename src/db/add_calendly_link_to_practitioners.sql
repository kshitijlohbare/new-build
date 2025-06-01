-- SQL script to add calendly_link column to the practitioners table

-- Check if column already exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'practitioners'
          AND column_name = 'calendly_link'
    ) THEN
        -- Add the calendly_link column
        ALTER TABLE practitioners
        ADD COLUMN calendly_link TEXT;
        
        RAISE NOTICE 'Column calendly_link added to practitioners table';
    ELSE
        RAISE NOTICE 'Column calendly_link already exists in practitioners table';
    END IF;
END
$$;
