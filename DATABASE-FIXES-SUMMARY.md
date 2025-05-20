# Database Fix Summary

This document summarizes the database-related issues that were fixed in the wellbeing app.

## Issues Fixed

1. **Missing Database Tables**
   - Created `user_practices` table for storing user practice data
   - Created `user_profiles` table for user profile information
   - Created `user_followers` table for follow relationships
   - Created `user_daily_practices` table for tracking daily practices
   - Created `community_delights` table for community features

2. **Foreign Key Relationships**
   - Fixed foreign key constraints between `user_followers` and `user_profiles`
   - Ensured proper cascade delete behavior

3. **API Query Patterns**
   - Fixed `count(*)` query issue in practice check
   - Updated to use proper field selection patterns
   - Fixed relationships query pattern in ProfileContext
   - Implemented proper two-step query for followers' profiles

4. **Data Storage**
   - Set up JSONB columns for flexible data storage in `user_practices`
   - Set up proper join pattern between users and their daily practices

## Query Pattern Best Practices

When working with the Supabase client in this project:

1. **Avoid Direct Aggregate Functions**
   ```typescript
   // DON'T use this pattern - causes parse errors
   .select('count(*)')

   // DO use this pattern - select fields, then count client-side
   .select('id')
   // then use data.length for counting
   ```

2. **Handle Relationships Properly**
   ```typescript
   // DON'T use complex join patterns that might not be supported:
   .select(`
     follower_id,
     followers:user_profiles!user_followers_follower_id_fkey(*)
   `)

   // DO use simple separate queries:
   // First query to get IDs
   const { data } = await supabase
     .from('user_followers')
     .select('follower_id')
     .eq('following_id', userId);

   // Second query to get the actual profiles
   const followerIds = data.map(item => item.follower_id);
   const { data: profiles } = await supabase
     .from('user_profiles')
     .select('*')
     .in('id', followerIds);
   ```

3. **Foreign Key Constraints**
   - Ensure IDs match exactly between tables with relationships
   - The `user_profiles.id` must match exactly with `auth.users.id`
   - Use UUID format consistently

## Database Schema Summary

### user_practices
```sql
CREATE TABLE user_practices (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  practices JSONB DEFAULT '[]'::jsonb,
  progress JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);
```

### user_profiles
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### user_daily_practices
```sql
CREATE TABLE user_daily_practices (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  practice_id INTEGER NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, practice_id)
);
```

## Testing Changes

To test that these fixes are working:

1. **Test Practice Saving**
   - Log in to the app
   - Mark a practice as complete
   - Verify it's saved in the database

2. **Test Daily Practices**
   - Add a practice to daily
   - Refresh the page
   - Verify it still shows in daily practices

3. **Test Profile Features**
   - View your profile
   - Follow another user
   - View follower list
