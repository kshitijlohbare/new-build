-- Fix RLS policy for practice_likes table
-- This fixes the performance issue by using a subquery for auth.uid()

-- First, let's check if the policy exists before trying to modify it
DO $$
BEGIN
    -- Check if the policy exists
    IF EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'practice_likes' AND policyname = 'Users can add their own likes'
    ) THEN
        -- Drop the existing policy
        DROP POLICY "Users can add their own likes" ON public.practice_likes;
        
        -- Create the optimized policy with subquery
        CREATE POLICY "Users can add their own likes" 
        ON public.practice_likes 
        FOR INSERT 
        WITH CHECK ((SELECT auth.uid()) = user_id);
        
        RAISE NOTICE 'Successfully updated policy for practice_likes table';
    ELSE
        RAISE NOTICE 'Policy "Users can add their own likes" does not exist on practice_likes table';
    END IF;
END
$$;
