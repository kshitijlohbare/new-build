-- fix-rls-policies.sql - THIS FILE IS DEPRECATED
-- Please use the individual fix files instead:
-- - fix-practice-likes.sql
-- - fix-practice-comments.sql
-- - fix-shared-practices.sql

-- This file is kept for reference but should not be used
-- as it may cause issues with your database.

-- Create new optimized policy that uses a subquery for auth.uid()
CREATE POLICY "Users can create their own comments" 
ON public.practice_comments 
FOR INSERT 
WITH CHECK ((SELECT auth.uid()) = user_id);

-- Fix for any other potential auth function calls in RLS policies for practice_comments
DROP POLICY IF EXISTS "Users can view comments" ON public.practice_comments;

CREATE POLICY "Users can view comments"
ON public.practice_comments
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can delete their own comments" ON public.practice_comments;

CREATE POLICY "Users can delete their own comments"
ON public.practice_comments
FOR DELETE
USING ((SELECT auth.uid()) = user_id);

-- Fix for practice_likes table
DROP POLICY IF EXISTS "Users can add their own likes" ON public.practice_likes;

-- Create new optimized policy that uses a subquery for auth.uid()
CREATE POLICY "Users can add their own likes" 
ON public.practice_likes 
FOR INSERT 
WITH CHECK ((SELECT auth.uid()) = user_id);

-- Fix for any other potential auth function calls in RLS policies for practice_likes
DROP POLICY IF EXISTS "Users can delete their own likes" ON public.practice_likes;

CREATE POLICY "Users can delete their own likes"
ON public.practice_likes
FOR DELETE
USING ((SELECT auth.uid()) = user_id);

-- Fix for community_delights table (as it might have similar issues)
DROP POLICY IF EXISTS "Users can insert their own delights" ON public.community_delights;

CREATE POLICY "Users can insert their own delights"
ON public.community_delights
FOR INSERT
WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own delights" ON public.community_delights;

CREATE POLICY "Users can update their own delights"
ON public.community_delights
FOR UPDATE
USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own delights" ON public.community_delights;

CREATE POLICY "Users can delete their own delights"
ON public.community_delights
FOR DELETE
USING ((SELECT auth.uid()) = user_id);

-- Fix for user_profiles table
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

CREATE POLICY "Users can update their own profile"
ON public.user_profiles
FOR UPDATE
USING ((SELECT auth.uid()) = id);

-- Fix for user_followers table
DROP POLICY IF EXISTS "Users can create follow relationships" ON public.user_followers;

CREATE POLICY "Users can create follow relationships"
ON public.user_followers
FOR INSERT
WITH CHECK ((SELECT auth.uid()) = follower_id);

DROP POLICY IF EXISTS "Users can delete their own follows" ON public.user_followers;

CREATE POLICY "Users can delete their own follows"
ON public.user_followers
FOR DELETE
USING ((SELECT auth.uid()) = follower_id);

-- Fix for profile_views table
DROP POLICY IF EXISTS "Users can see their own profile views" ON public.profile_views;

CREATE POLICY "Users can see their own profile views"
ON public.profile_views
FOR SELECT
USING ((SELECT auth.uid()) = profile_id);

DROP POLICY IF EXISTS "Anyone can create a view" ON public.profile_views;

CREATE POLICY "Anyone can create a view"
ON public.profile_views
FOR INSERT
WITH CHECK (viewer_id = (SELECT auth.uid()) OR viewer_id IS NULL);
