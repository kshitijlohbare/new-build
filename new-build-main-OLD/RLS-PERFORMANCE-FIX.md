# RLS Policy Performance Fixes

This document provides instructions for fixing the RLS (Row Level Security) policy performance issues identified in your Supabase project.

## Background

Supabase has identified that some tables in your project have RLS policies that directly call `auth.uid()` without using a subquery. This causes the function to be evaluated once per row, which can lead to performance issues at scale.

The solution is to replace direct calls to `auth.uid()` with a subquery `(SELECT auth.uid())`, which allows PostgreSQL to evaluate the function once per query and reuse the result.

## Affected Tables

The following tables have been identified as having inefficient RLS policies:

1. `public.practice_likes`
2. `public.practice_comments`
3. `public.shared_practices`

## How to Apply the Fixes

### Option 1: Apply Fixes via Supabase Dashboard (Recommended)

1. Log in to the [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to the SQL Editor
4. For each affected table, open and run the corresponding SQL file:
   - `fix-practice-likes.sql`
   - `fix-practice-comments.sql`
   - `fix-shared-practices.sql`

### Option 2: Use the Supabase Management API

If you prefer to use the Management API, you will need admin credentials, and you can use the standard Supabase API to apply the SQL fixes.

## Verification

After applying the fixes, you can verify that the policies have been updated correctly by checking if the performance warnings are resolved in the Supabase dashboard.

## Support

If you encounter any issues while applying these fixes, please refer to the [Supabase documentation on RLS](https://supabase.com/docs/guides/auth/row-level-security) or contact Supabase support.
