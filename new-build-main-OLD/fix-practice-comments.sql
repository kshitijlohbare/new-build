-- Fix RLS policy for practice_comments table
-- This fixes the performance issue by using a subquery for auth.uid()

-- First, let's check if the policy exists before trying to modify it
DO $$
BEGIN
    -- Check if the policy exists
    IF EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'practice_comments' AND policyname = 'Users can create their own comments'
    ) THEN
        -- Drop the existing policy
        DROP POLICY "Users can create their own comments" ON public.practice_comments;
        
        -- Create the optimized policy with subquery
        CREATE POLICY "Users can create their own comments" 
        ON public.practice_comments 
        FOR INSERT 
        WITH CHECK ((SELECT auth.uid()) = user_id);
        
        RAISE NOTICE 'Successfully updated policy for practice_comments table';
    ELSE
        RAISE NOTICE 'Policy "Users can create their own comments" does not exist on practice_comments table';
    END IF;
END
$$;
