-- Fix for execute_sql function with mutable search_path
-- This adds a fixed search path to improve security

-- Check if the function exists before attempting to modify it
DO $$
BEGIN
    -- Check if the function exists in the database
    IF EXISTS (
        SELECT 1
        FROM pg_proc p 
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public' AND p.proname = 'execute_sql'
    ) THEN
        -- Drop the existing function
        DROP FUNCTION IF EXISTS public.execute_sql;
        
        -- Create the function with a fixed search path
        CREATE OR REPLACE FUNCTION public.execute_sql(sql_command text)
        RETURNS void
        LANGUAGE plpgsql
        SECURITY DEFINER  -- Maintains the original security context if it was DEFINER
        SET search_path = public  -- Set fixed search path to public schema only
        AS $$
        BEGIN
            EXECUTE sql_command;
        END;
        $$;
        
        -- Add comment to the function
        COMMENT ON FUNCTION public.execute_sql(text) IS 'Executes SQL commands with a fixed search path for security';
        
        RAISE NOTICE 'Successfully updated the execute_sql function with a fixed search path';
    ELSE
        RAISE NOTICE 'The execute_sql function does not exist in the public schema';
    END IF;
END
$$;
