-- Fix RLS policy for shared_practices table
-- This fixes the performance issue by using a subquery for auth.uid()

-- First, let's check if the policy exists before trying to modify it
DO $$
BEGIN
    -- Check if the policy exists
    IF EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'shared_practices' AND policyname = 'Users can create their own practices'
    ) THEN
        -- Drop the existing policy
        DROP POLICY "Users can create their own practices" ON public.shared_practices;
        
        -- Create the optimized policy with subquery
        CREATE POLICY "Users can create their own practices" 
        ON public.shared_practices 
        FOR INSERT 
        WITH CHECK ((SELECT auth.uid()) = user_id);
        
        RAISE NOTICE 'Successfully updated policy for shared_practices table';
    ELSE
        RAISE NOTICE 'Policy "Users can create their own practices" does not exist on shared_practices table';
    END IF;
END
$$;
