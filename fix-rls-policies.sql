-- fix-rls-policies.sql
-- This script adds RLS policies for practitioners table to ensure anonymous read access

-- Check if practitioners table exists
DO $$
DECLARE
    table_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'practitioners'
    ) INTO table_exists;

    IF NOT table_exists THEN
        RAISE NOTICE 'The practitioners table does not exist. Please create it first.';
        RETURN;
    END IF;

    -- Enable RLS if not already enabled
    EXECUTE 'ALTER TABLE public.practitioners ENABLE ROW LEVEL SECURITY';
    RAISE NOTICE 'RLS enabled on practitioners table.';

    -- Check if any read policy already exists
    PERFORM 1 FROM pg_policy 
    WHERE polrelid = 'public.practitioners'::regclass 
    AND (polname ILIKE '%read%' OR polname ILIKE '%select%' OR polname ILIKE '%all%');
    
    IF NOT FOUND THEN
        -- Add read policy for anonymous access
        EXECUTE 'CREATE POLICY "Allow anonymous read access to practitioners" 
                ON public.practitioners 
                FOR SELECT 
                USING (true)';
        RAISE NOTICE 'Read policy added for anonymous access.';
    ELSE
        RAISE NOTICE 'A read policy already exists.';
    END IF;
    
    -- Verify the policy exists now
    RAISE NOTICE 'Policies for practitioners table:';
    FOR policy_name IN (
        SELECT polname FROM pg_policy WHERE polrelid = 'public.practitioners'::regclass
    ) LOOP
        RAISE NOTICE '%', policy_name;
    END LOOP;
    
END $$;