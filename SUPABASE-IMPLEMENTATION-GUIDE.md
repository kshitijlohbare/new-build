# Supabase Database Optimization Guide

## Overview

This guide explains how to simplify the database structure for storing daily practices in Supabase by using a single source of truth approach. Instead of maintaining both an `isDaily` flag and a separate junction table, we'll consolidate to store all data in a single structure.

## Current vs. Optimized Structure

### Current Structure
- `user_practices` table with a JSON column containing practices and their `isDaily` flag
- Separate `user_daily_practices` junction table with user_id/practice_id pairs
- Requires keeping both in sync

### Optimized Structure
- Single `user_practices` table with a JSON column containing practices
- Each practice has an `isDaily` flag that is the single source of truth
- No separate junction table needed

## Implementation Steps

### 1. Database Schema Changes

#### Create Optimized Table Structure
Run the SQL in `sql/create_optimized_table.sql` in your Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS public.user_practices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  practices_data JSONB NOT NULL DEFAULT '{"practices": [], "progress": {...}}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT user_practices_user_id_key UNIQUE (user_id)
);

-- Add indexes and RLS policies (see full script)
```

#### Create Migration Function
Run the SQL in `sql/migrate_practice_data.sql` to create migration functions:

```sql
-- Create functions to migrate data (see full script)
CREATE OR REPLACE FUNCTION migrate_user_practice_data(target_user_id UUID)...
CREATE OR REPLACE FUNCTION migrate_all_user_practice_data()...

-- Then execute:
SELECT * FROM migrate_all_user_practice_data();
```

#### Create Helper Functions
Run the SQL in `sql/daily_practices_helper.sql` to create useful access functions:

```sql
CREATE OR REPLACE FUNCTION get_daily_practices(p_user_id UUID)...
```

### 2. Frontend Code Changes

#### Update API Functions

Create optimized data access functions in `src/context/practiceUtils.optimized.ts`:

```typescript
/**
 * Optimized data access functions for practice data using the consolidated approach
 * with the isDaily flag as a single source of truth
 */

import { supabase } from '@/lib/supabase';

// Save all practice data in one operation
export async function savePracticesOptimized(userId, practices, userProgress) {
  try {
    if (!userId) throw new Error('User ID is required');
    
    const practicesData = {
      practices: practices.map(practice => ({
        ...practice,
        // Ensure isDaily flag is always boolean
        isDaily: Boolean(practice.isDaily)
      })),
      progress: userProgress || {}
    };
    
    const { data, error } = await supabase
      .from('user_practices')
      .upsert(
        { 
          user_id: userId, 
          practices_data: practicesData,
          updated_at: new Date().toISOString()
        }, 
        { onConflict: 'user_id' }
      );
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving practices data:', error);
    throw error;
  }
}

// Toggle a practice's daily status
export async function toggleDailyPractice(userId, practiceId, isDaily) {
  try {
    if (!userId || !practiceId) throw new Error('User ID and Practice ID are required');
    
    // First get the current practices data
    const { data, error } = await supabase
      .from('user_practices')
      .select('practices_data')
      .eq('user_id', userId)
      .single();
      
    if (error) throw error;
    
    if (!data || !data.practices_data) {
      throw new Error('No practice data found for user');
    }
    
    // Update the isDaily flag for the specific practice
    const updatedPractices = data.practices_data.practices.map(practice => {
      if (practice.id === practiceId) {
        return { ...practice, isDaily: Boolean(isDaily) };
      }
      return practice;
    });
    
    // Save the updated data
    const { error: updateError } = await supabase
      .from('user_practices')
      .update({ 
        practices_data: {
          ...data.practices_data,
          practices: updatedPractices
        },
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
      
    if (updateError) throw updateError;
    
    return { success: true };
  } catch (error) {
    console.error('Error toggling daily practice:', error);
    throw error;
  }
}

// Get only daily practices
export async function getDailyPractices(userId) {
  try {
    if (!userId) throw new Error('User ID is required');
    
    // Use the Postgres function to get only daily practices
    const { data, error } = await supabase
      .rpc('get_daily_practices', { p_user_id: userId });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error getting daily practices:', error);
    // Return empty array on error instead of throwing to prevent UI breakage
    return [];
  }
}

// Get all user practice data
export async function getUserPracticeData(userId) {
  try {
    if (!userId) throw new Error('User ID is required');
    
    const { data, error } = await supabase
      .from('user_practices')
      .select('practices_data')
      .eq('user_id', userId)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // No data found, return defaults
        return { practices: [], progress: {} };
      }
      throw error;
    }
    
    return data?.practices_data || { practices: [], progress: {} };
  } catch (error) {
    console.error('Error getting user practice data:', error);
    throw error;
  }
}
```

#### Update React Context

Modify your PracticeContext to use the new optimized functions. Here's how to update the `src/context/PracticeContext.tsx` file:

```typescript
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { 
  savePracticesOptimized,
  toggleDailyPractice,
  getDailyPractices,
  getUserPracticeData
} from './practiceUtils.optimized';

// Legacy imports during transition
import { 
  saveUserPractices,
  updateUserDailyPractices
} from './practiceUtils';

// ... existing context setup ...

export const PracticeProvider = ({ children }) => {
  const { user } = useAuth();
  const [practices, setPractices] = useState([]);
  const [dailyPractices, setDailyPractices] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch all practice data on mount
  useEffect(() => {
    if (user) {
      fetchPracticeData();
    } else {
      setPractices([]);
      setDailyPractices([]);
      setUserProgress({});
    }
  }, [user]);
  
  // Fetch practice data from optimized structure
  const fetchPracticeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const practiceData = await getUserPracticeData(user.id);
      
      setPractices(practiceData.practices || []);
      setUserProgress(practiceData.progress || {});
      
      // Also fetch daily practices
      const dailyPracticesList = await getDailyPractices(user.id);
      setDailyPractices(dailyPracticesList);
      
    } catch (err) {
      console.error('Error fetching practice data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Save all practice data
  const savePractices = async (updatedPractices, updatedProgress) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // During transition period: dual-write approach 
      // 1. Save to optimized structure
      await savePracticesOptimized(
        user.id,
        updatedPractices || practices,
        updatedProgress || userProgress
      );
      
      // 2. Also save to old structure for backward compatibility
      await saveUserPractices(
        user.id,
        updatedPractices || practices,
        updatedProgress || userProgress
      );
      
      // Update local state
      setPractices(updatedPractices || practices);
      setUserProgress(updatedProgress || userProgress);
      
    } catch (err) {
      console.error('Error saving practices:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Add or remove a practice from the daily list
  const toggleDaily = async (practiceId, isDaily) => {
    if (!user || !practiceId) return;
    
    try {
      setLoading(true);
      
      // Update the optimized structure 
      await toggleDailyPractice(user.id, practiceId, isDaily);
      
      // During transition: also update the legacy junction table
      await updateUserDailyPractices(user.id, practiceId, isDaily);
      
      // Update local state: Update the isDaily flag in the practices array
      const updatedPractices = practices.map(practice => {
        if (practice.id === practiceId) {
          return { ...practice, isDaily };
        }
        return practice;
      });
      
      // Update state
      setPractices(updatedPractices);
      
      // Update daily practices list to reflect changes
      if (isDaily) {
        const practiceToAdd = practices.find(p => p.id === practiceId);
        if (practiceToAdd) {
          setDailyPractices([...dailyPractices, practiceToAdd]);
        }
      } else {
        setDailyPractices(dailyPractices.filter(p => p.id !== practiceId));
      }
      
    } catch (err) {
      console.error('Error toggling daily practice:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // ... rest of your context ...
  
  return (
    <PracticeContext.Provider value={{
      practices,
      dailyPractices,
      userProgress,
      loading,
      error,
      savePractices,
      toggleDaily,
      fetchPracticeData
    }}>
      {children}
    </PracticeContext.Provider>
  );
};
```

#### Phased Implementation

For safety, implement a dual-write approach during transition:

1. **Phase 1: Dual Write (2 weeks)**
   - Write to both old and new structures as shown above
   - Read primarily from the new structure
   - Add monitoring to verify data consistency between old and new approaches

2. **Phase 2: New Structure Only (1 week)**
   - Update code to read exclusively from the new structure
   - Continue writing to both structures
   - Implement automated tests that verify the new approach works correctly

3. **Phase 3: Migration Complete (final)**
   - Remove all code that writes to the old junction table
   - Remove any remaining legacy code paths
   - Document the new approach for future developers

4. **Monitoring Queries**
   Run these in the Supabase SQL Editor to verify data consistency:

   ```sql
   -- Check for mismatches between structures
   SELECT u.user_id, 
         jsonb_array_length(u.practices_data->'practices') as practice_count,
         (SELECT COUNT(*) FROM user_daily_practices udp WHERE udp.user_id = u.user_id) as junction_count,
         (SELECT COUNT(*) FROM jsonb_array_elements(u.practices_data->'practices') as p
          WHERE (p->>'isDaily')::boolean = true) as daily_in_json
   FROM user_practices u
   WHERE (SELECT COUNT(*) FROM user_daily_practices udp WHERE udp.user_id = u.user_id) !=
         (SELECT COUNT(*) FROM jsonb_array_elements(u.practices_data->'practices') as p
          WHERE (p->>'isDaily')::boolean = true);
   ```

## Performance Benefits

- **Reduced Database Operations**: Single update instead of multiple operations
- **Simplified Logic**: No need to maintain consistency between tables
- **Better Caching**: Single data structure is more cache-friendly
- **Improved Reliability**: Fewer points of failure

## Additional Resources

- Check `DATABASE-OPTIMIZATION-PLAN.md` for the complete optimization strategy
- See `SUPABASE-IMPLEMENTATION-CHECKLIST.md` for a step-by-step implementation checklist
- The `scripts/migrateToDailyFlag.js` file provides a Node.js implementation of the migration process

## Troubleshooting

If you encounter issues with the database implementation, follow these troubleshooting steps:

### Common Issues and Solutions

#### 1. Migration SQL Errors

**Problem**: The SQL scripts fail to run with syntax errors or permission issues.

**Solutions**:
- Ensure you have the correct permissions in your Supabase project
- Check that the `uuid-ossp` extension is enabled in Supabase
- Run each SQL statement individually to identify the problematic section
- Make sure your Supabase version is compatible with the SQL syntax used

```sql
-- Check if the uuid-ossp extension is enabled
SELECT * FROM pg_extension WHERE extname = 'uuid-ossp';

-- Enable it if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

#### 2. Data Not Appearing in New Structure

**Problem**: After migration, data isn't visible in the new structure.

**Solutions**:
- Verify the migration function executed successfully:

```sql
-- Check if the migration function ran
SELECT COUNT(*) FROM user_practices;

-- Check specific user data
SELECT * FROM user_practices WHERE user_id = 'your-user-id';
```

- Manually run the migration for a specific user:

```sql
SELECT * FROM migrate_user_practice_data('your-user-id');
```

#### 3. JSONB Data Structure Issues

**Problem**: The JSONB structure isn't working correctly or data is malformed.

**Solutions**:
- Check the actual structure of your JSONB data:

```sql
-- Examine the structure for a user
SELECT jsonb_pretty(practices_data) 
FROM user_practices 
WHERE user_id = 'your-user-id';
```

- If the structure is incorrect, manually fix it:

```sql
-- Fix incorrect structure
UPDATE user_practices
SET practices_data = '{"practices": [], "progress": {}}'::jsonb
WHERE user_id = 'your-user-id'
AND (practices_data IS NULL OR practices_data->>'practices' IS NULL);
```

#### 4. RLS Policy Issues

**Problem**: Row Level Security policies are preventing access to data.

**Solutions**:
- Verify your RLS policies are correctly set:

```sql
-- List all policies for the table
SELECT * FROM pg_policies WHERE tablename = 'user_practices';
```

- Check if data is accessible with RLS bypassed (from the SQL Editor in Supabase):

```sql
-- This must be run from the SQL Editor with admin rights
BEGIN;
ALTER TABLE user_practices DISABLE ROW LEVEL SECURITY;
SELECT * FROM user_practices LIMIT 10;
ALTER TABLE user_practices ENABLE ROW LEVEL SECURITY;
COMMIT;
```

#### 5. Frontend Connection Issues

**Problem**: Frontend code is unable to connect to or query the database.

**Solutions**:
- Check your API keys and URLs:
  - Ensure the `supabase` client is correctly initialized
  - Verify that environment variables are correctly set

- Enable enhanced debugging in your frontend code:

```typescript
// Add this to your supabase client initialization
const supabaseOptions = {
  db: { 
    schema: 'public' 
  },
  auth: { 
    debug: true,
    persistSession: true
  }
};

const supabase = createClient(supabaseUrl, supabaseKey, supabaseOptions);
```

### Fixing the Migration Process

If the current implementation isn't working, try this alternative approach:

1. **Create a backup of existing data**:

```sql
-- Create backup table
CREATE TABLE user_practices_backup AS 
SELECT * FROM user_practices;

CREATE TABLE user_daily_practices_backup AS
SELECT * FROM user_daily_practices;
```

2. **Perform a direct migration using SQL**:

```sql
-- Drop and recreate function with more error handling
DROP FUNCTION IF EXISTS migrate_user_practice_data;

CREATE OR REPLACE FUNCTION migrate_user_practice_data(target_user_id UUID)
RETURNS TEXT AS $$
DECLARE
    practice_count INTEGER := 0;
    result TEXT;
BEGIN
    -- Create user record if it doesn't exist
    INSERT INTO user_practices (user_id, practices_data)
    VALUES (target_user_id, '{"practices": [], "progress": {}}'::jsonb)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Get all user's practices
    WITH 
    user_practice_data AS (
        SELECT 
            p.user_id,
            p.practices_data
        FROM user_practices p
        WHERE p.user_id = target_user_id
    ),
    daily_practices AS (
        SELECT 
            udp.practice_id
        FROM user_daily_practices udp
        WHERE udp.user_id = target_user_id
    )
    UPDATE user_practices up
    SET practices_data = jsonb_set(
        CASE 
            WHEN up.practices_data IS NULL OR up.practices_data = '{}'::jsonb 
            THEN '{"practices": [], "progress": {}}'::jsonb
            ELSE up.practices_data
        END,
        '{practices}',
        (
            SELECT jsonb_agg(
                CASE 
                    WHEN dp.practice_id IS NOT NULL THEN 
                        jsonb_set(p, '{isDaily}', 'true'::jsonb)
                    ELSE
                        jsonb_set(p, '{isDaily}', 'false'::jsonb)
                END
            )
            FROM jsonb_array_elements(
                CASE 
                    WHEN up.practices_data->'practices' IS NULL THEN '[]'::jsonb
                    ELSE up.practices_data->'practices' 
                END
            ) AS p
            LEFT JOIN daily_practices dp ON (p->>'id') = dp.practice_id
        )
    )
    WHERE up.user_id = target_user_id
    RETURNING (jsonb_array_length(up.practices_data->'practices')) INTO practice_count;
    
    result := format('Migrated %s practices for user %s', practice_count, target_user_id);
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'Error: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

3. **Test with a single user first**:

```sql
-- Test with a single user
SELECT * FROM migrate_user_practice_data('specific-user-uuid');

-- Check the results for that user
SELECT jsonb_pretty(practices_data) FROM user_practices 
WHERE user_id = 'specific-user-uuid';
```

### Verifying the Implementation

After attempting the fixes above, verify everything works:

1. Check data consistency:
```sql
-- Compare counts between approaches
SELECT 
    'Junction Table' as source, 
    COUNT(*) as daily_practices 
FROM user_daily_practices
UNION
SELECT 
    'JSONB isDaily Flag' as source, 
    COUNT(*) 
FROM user_practices, 
     jsonb_array_elements(practices_data->'practices') as practice
WHERE (practice->>'isDaily')::boolean = true;
```

2. If the data looks correct, update your frontend to use the new structure exclusively.

### Need Further Assistance?

If you're still experiencing issues after trying these solutions, please:

1. Create a detailed error report with specific error messages
2. Generate a database schema dump for analysis
3. Contact the database team through the #supabase-support channel

# Enhanced Daily Practices with Points System

This section outlines an improved approach to tracking user daily practices with a points-based reward system.

## Database Schema Changes

#### 1. Create User Daily Practices Table

```sql
-- Table to store user's daily practices selections and points
CREATE TABLE user_daily_practices_enhanced (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  practice_ids TEXT[] NOT NULL DEFAULT '{}', -- Array of practice IDs
  points INTEGER NOT NULL DEFAULT 0, -- User's accumulated points
  points_today INTEGER NOT NULL DEFAULT 0, -- Points accumulated today
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  streak_count INTEGER NOT NULL DEFAULT 0, -- Days in a row with completed practices
  best_streak INTEGER NOT NULL DEFAULT 0, -- Best streak achieved
  CONSTRAINT user_daily_practices_enhanced_user_id_key UNIQUE (user_id)
);

-- Add RLS policies
ALTER TABLE user_daily_practices_enhanced ENABLE ROW LEVEL SECURITY;

-- Allow users to view and update only their own records
CREATE POLICY "Users can view their own daily practices"
  ON user_daily_practices_enhanced
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily practices"
  ON user_daily_practices_enhanced
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily practices"
  ON user_daily_practices_enhanced
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX user_daily_practices_enhanced_user_id_idx 
  ON user_daily_practices_enhanced(user_id);
```

#### 2. Add Points Column to Practices Table

```sql
-- Add points_per_minute to the practices table
ALTER TABLE practices 
  ADD COLUMN points_per_minute INTEGER NOT NULL DEFAULT 10;

-- Backfill existing practices with default points values
UPDATE practices SET points_per_minute = 
  CASE 
    WHEN category = 'meditation' THEN 15
    WHEN category = 'exercise' THEN 12
    WHEN category = 'mindfulness' THEN 10
    WHEN category = 'gratitude' THEN 8
    ELSE 10
  END;
```

#### 3. Create Practice Completion Records Table

```sql
-- Table to store individual practice completion records
CREATE TABLE practice_completions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  practice_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  duration_minutes INTEGER NOT NULL,
  points_earned INTEGER NOT NULL,
  date_key TEXT NOT NULL, -- Format: YYYY-MM-DD for easy grouping by day
  CONSTRAINT unique_practice_completion_per_day 
    UNIQUE(user_id, practice_id, date_key)
);

-- Add RLS policies
ALTER TABLE practice_completions ENABLE ROW LEVEL SECURITY;

-- Allow users to view and insert their own records
CREATE POLICY "Users can view their own completions"
  ON practice_completions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own completions"
  ON practice_completions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for common query patterns
CREATE INDEX practice_completions_user_id_idx 
  ON practice_completions(user_id);
CREATE INDEX practice_completions_date_key_idx 
  ON practice_completions(date_key);
CREATE INDEX practice_completions_user_date_idx 
  ON practice_completions(user_id, date_key);
```

### Database Functions

#### 1. Add Practice to User's Daily List

```sql
CREATE OR REPLACE FUNCTION add_daily_practice(
  p_user_id UUID,
  p_practice_id TEXT
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  -- Insert or update the user's daily practices record
  INSERT INTO user_daily_practices_enhanced (
    user_id, 
    practice_ids
  ) 
  VALUES (
    p_user_id, 
    ARRAY[p_practice_id]
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    practice_ids = array_append(
      array_remove(user_daily_practices_enhanced.practice_ids, p_practice_id),
      p_practice_id
    ),
    last_updated = now()
  RETURNING jsonb_build_object(
    'user_id', user_id,
    'practice_ids', practice_ids,
    'points', points
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### 2. Remove Practice from User's Daily List

```sql
CREATE OR REPLACE FUNCTION remove_daily_practice(
  p_user_id UUID,
  p_practice_id TEXT
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  -- Remove the practice from the user's daily practices array
  UPDATE user_daily_practices_enhanced 
  SET 
    practice_ids = array_remove(practice_ids, p_practice_id),
    last_updated = now()
  WHERE user_id = p_user_id
  RETURNING jsonb_build_object(
    'user_id', user_id,
    'practice_ids', practice_ids,
    'points', points
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### 3. Mark Practice as Completed

```sql
CREATE OR REPLACE FUNCTION complete_practice(
  p_user_id UUID,
  p_practice_id TEXT,
  p_duration_minutes INTEGER
)
RETURNS JSONB AS $$
DECLARE
  points_per_min INTEGER;
  total_points INTEGER;
  today_date TEXT := to_char(now(), 'YYYY-MM-DD');
  result JSONB;
BEGIN
  -- Get the points per minute for this practice
  SELECT points_per_minute INTO points_per_min
  FROM practices
  WHERE id = p_practice_id;
  
  -- Calculate total points earned
  total_points := p_duration_minutes * points_per_min;
  
  -- Record the completion
  INSERT INTO practice_completions (
    user_id,
    practice_id,
    completed_at,
    duration_minutes,
    points_earned,
    date_key
  )
  VALUES (
    p_user_id,
    p_practice_id,
    now(),
    p_duration_minutes,
    total_points,
    today_date
  )
  ON CONFLICT (user_id, practice_id, date_key)
  DO UPDATE SET
    completed_at = now(),
    duration_minutes = p_duration_minutes,
    points_earned = total_points;
    
  -- Update user's points
  UPDATE user_daily_practices_enhanced
  SET
    points = points + total_points,
    points_today = points_today + total_points
  WHERE user_id = p_user_id
  RETURNING jsonb_build_object(
    'user_id', user_id,
    'practice_ids', practice_ids,
    'points', points,
    'points_today', points_today,
    'points_earned', total_points
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### 4. Reset Daily Completions (Run at Midnight)

```sql
CREATE OR REPLACE FUNCTION reset_daily_completions()
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
  yesterday_date TEXT := to_char(now() - interval '1 day', 'YYYY-MM-DD');
  users_with_completions INTEGER;
BEGIN
  -- Count users who completed practices yesterday
  SELECT COUNT(DISTINCT user_id) INTO users_with_completions
  FROM practice_completions
  WHERE date_key = yesterday_date;
  
  -- Update streak counts for all users
  UPDATE user_daily_practices_enhanced udpe
  SET 
    points_today = 0,
    streak_count = CASE
      -- If user has completions yesterday, increase streak
      WHEN EXISTS (
        SELECT 1 FROM practice_completions pc 
        WHERE pc.user_id = udpe.user_id 
        AND pc.date_key = yesterday_date
      ) THEN streak_count + 1
      -- Otherwise reset streak
      ELSE 0
    END,
    best_streak = GREATEST(
      best_streak,
      CASE
        WHEN EXISTS (
          SELECT 1 FROM practice_completions pc 
          WHERE pc.user_id = udpe.user_id 
          AND pc.date_key = yesterday_date
        ) THEN streak_count + 1
        ELSE streak_count
      END
    )
  RETURNING COUNT(*) INTO updated_count;
  
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Frontend API Functions

Create a new file `src/context/practicePointsUtils.ts`:

```typescript
import { supabase } from '@/lib/supabase';

// Get user's daily practices with points information
export async function getUserDailyPractices(userId) {
  try {
    if (!userId) throw new Error('User ID is required');
    
    const { data, error } = await supabase
      .from('user_daily_practices_enhanced')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error;
    
    return data || { 
      user_id: userId, 
      practice_ids: [], 
      points: 0, 
      points_today: 0,
      streak_count: 0,
      best_streak: 0
    };
  } catch (error) {
    console.error('Error fetching user daily practices:', error);
    throw error;
  }
}

// Add a practice to the user's daily list
export async function addDailyPractice(userId, practiceId) {
  try {
    if (!userId || !practiceId) throw new Error('User ID and Practice ID are required');
    
    const { data, error } = await supabase
      .rpc('add_daily_practice', {
        p_user_id: userId,
        p_practice_id: practiceId
      });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding daily practice:', error);
    throw error;
  }
}

// Remove a practice from the user's daily list
export async function removeDailyPractice(userId, practiceId) {
  try {
    if (!userId || !practiceId) throw new Error('User ID and Practice ID are required');
    
    const { data, error } = await supabase
      .rpc('remove_daily_practice', {
        p_user_id: userId,
        p_practice_id: practiceId
      });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error removing daily practice:', error);
    throw error;
  }
}

// Mark a practice as completed and earn points
export async function completePractice(userId, practiceId, durationMinutes) {
  try {
    if (!userId || !practiceId) throw new Error('User ID and Practice ID are required');
    if (!durationMinutes || durationMinutes <= 0) throw new Error('Duration must be greater than zero');
    
    const { data, error } = await supabase
      .rpc('complete_practice', {
        p_user_id: userId,
        p_practice_id: practiceId,
        p_duration_minutes: durationMinutes
      });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error completing practice:', error);
    throw error;
  }
}

// Get user's practice completion history
export async function getUserCompletionHistory(userId, startDate, endDate) {
  try {
    if (!userId) throw new Error('User ID is required');
    
    let query = supabase
      .from('practice_completions')
      .select(`
        id, 
        practice_id, 
        completed_at, 
        duration_minutes, 
        points_earned, 
        date_key
      `)
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });
      
    // Add date range filter if provided
    if (startDate) {
      query = query.gte('date_key', startDate);
    }
    
    if (endDate) {
      query = query.lte('date_key', endDate);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user completion history:', error);
    throw error;
  }
}

// Get practice details including points per minute
export async function getPracticeWithPoints(practiceId) {
  try {
    if (!practiceId) throw new Error('Practice ID is required');
    
    const { data, error } = await supabase
      .from('practices')
      .select('*, points_per_minute')
      .eq('id', practiceId)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching practice details:', error);
    throw error;
  }
}

// Calculate potential points for a practice
export function calculatePotentialPoints(durationMinutes, pointsPerMinute) {
  return durationMinutes * pointsPerMinute;
}
```

### React Context Implementation

Create a new file `src/context/DailyPracticeContext.tsx`:

```typescript
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  getUserDailyPractices,
  addDailyPractice,
  removeDailyPractice,
  completePractice,
  getUserCompletionHistory,
  getPracticeWithPoints
} from './practicePointsUtils';

// Context interface
interface DailyPracticeContextType {
  dailyPracticeIds: string[];
  userPoints: number;
  todayPoints: number;
  streak: number;
  bestStreak: number;
  completedToday: string[];
  loading: boolean;
  error: string | null;
  addToDailyPractices: (practiceId: string) => Promise<void>;
  removeFromDailyPractices: (practiceId: string) => Promise<void>;
  markPracticeCompleted: (practiceId: string, durationMinutes: number) => Promise<void>;
  isInDailyPractices: (practiceId: string) => boolean;
  isCompletedToday: (practiceId: string) => boolean;
  refreshData: () => Promise<void>;
}

const DailyPracticeContext = createContext<DailyPracticeContextType | undefined>(undefined);

export const DailyPracticeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [dailyPracticeIds, setDailyPracticeIds] = useState<string[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [todayPoints, setTodayPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [completedToday, setCompletedToday] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch data on mount and when user changes
  useEffect(() => {
    if (user) {
      refreshData();
    } else {
      setDailyPracticeIds([]);
      setUserPoints(0);
      setTodayPoints(0);
      setStreak(0);
      setBestStreak(0);
      setCompletedToday([]);
    }
  }, [user]);
  
  // Refresh all user data
  const refreshData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Get daily practices and points data
      const practicesData = await getUserDailyPractices(user.id);
      setDailyPracticeIds(practicesData.practice_ids || []);
      setUserPoints(practicesData.points || 0);
      setTodayPoints(practicesData.points_today || 0);
      setStreak(practicesData.streak_count || 0);
      setBestStreak(practicesData.best_streak || 0);
      
      // Get today's completions
      const todayDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const completions = await getUserCompletionHistory(user.id, todayDate, todayDate);
      setCompletedToday(completions.map(c => c.practice_id));
    } catch (err: any) {
      console.error('Error refreshing daily practice data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Add a practice to daily list
  const addToDailyPractices = async (practiceId: string) => {
    if (!user || !practiceId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await addDailyPractice(user.id, practiceId);
      
      // Update local state
      setDailyPracticeIds(result.practice_ids || []);
      setUserPoints(result.points || 0);
    } catch (err: any) {
      console.error('Error adding daily practice:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Remove a practice from daily list
  const removeFromDailyPractices = async (practiceId: string) => {
    if (!user || !practiceId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await removeDailyPractice(user.id, practiceId);
      
      // Update local state
      setDailyPracticeIds(result.practice_ids || []);
      setUserPoints(result.points || 0);
    } catch (err: any) {
      console.error('Error removing daily practice:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Mark a practice as completed
  const markPracticeCompleted = async (practiceId: string, durationMinutes: number) => {
    if (!user || !practiceId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await completePractice(user.id, practiceId, durationMinutes);
      
      // Update local state
      setUserPoints(result.points || 0);
      setTodayPoints(result.points_today || 0);
      
      // Update completed practices
      if (!completedToday.includes(practiceId)) {
        setCompletedToday([...completedToday, practiceId]);
      }
    } catch (err: any) {
      console.error('Error marking practice as completed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Check if practice is in daily list
  const isInDailyPractices = (practiceId: string): boolean => {
    return dailyPracticeIds.includes(practiceId);
  };
  
  // Check if practice is completed today
  const isCompletedToday = (practiceId: string): boolean => {
    return completedToday.includes(practiceId);
  };
  
  // Context value
  const value = {
    dailyPracticeIds,
    userPoints,
    todayPoints,
    streak,
    bestStreak,
    completedToday,
    loading,
    error,
    addToDailyPractices,
    removeFromDailyPractices,
    markPracticeCompleted,
    isInDailyPractices,
    isCompletedToday,
    refreshData
  };
  
  return (
    <DailyPracticeContext.Provider value={value}>
      {children}
    </DailyPracticeContext.Provider>
  );
};

// Custom hook to use the context
export const useDailyPractice = (): DailyPracticeContextType => {
  const context = useContext(DailyPracticeContext);
  if (context === undefined) {
    throw new Error('useDailyPractice must be used within a DailyPracticeProvider');
  }
  return context;
};
```

### Component Integration

#### "I'll Do It" CTA Implementation

```tsx
import { useDailyPractice } from '@/context/DailyPracticeContext';

const PracticeCard = ({ practice }) => {
  const { 
    isInDailyPractices, 
    addToDailyPractices,
    removeFromDailyPractices 
  } = useDailyPractice();
  
  const isDailyPractice = isInDailyPractices(practice.id);
  
  const handleDailyToggle = async () => {
    if (isDailyPractice) {
      await removeFromDailyPractices(practice.id);
    } else {
      await addToDailyPractices(practice.id);
    }
  };
  
  return (
    <div className="practice-card">
      <h3>{practice.title}</h3>
      <p>{practice.description}</p>
      <div className="practice-card-footer">
        <button 
          className={`btn ${isDailyPractice ? 'btn-active' : 'btn-outline'}`}
          onClick={handleDailyToggle}
        >
          {isDailyPractice ? "I'm Doing It" : "I'll Do It"}
        </button>
      </div>
    </div>
  );
};
```

#### Daily Practices Completion Component

```tsx
import { useState } from 'react';
import { useDailyPractice } from '@/context/DailyPracticeContext';

const DailyPracticeItem = ({ practice }) => {
  const { 
    isCompletedToday,
    markPracticeCompleted 
  } = useDailyPractice();
  const [duration, setDuration] = useState(5);
  const [showDurationInput, setShowDurationInput] = useState(false);
  
  const isCompleted = isCompletedToday(practice.id);
  
  const handleComplete = async () => {
    if (isCompleted) return; // Already completed
    
    if (!showDurationInput) {
      setShowDurationInput(true);
      return;
    }
    
    await markPracticeCompleted(practice.id, duration);
    setShowDurationInput(false);
  };
  
  return (
    <div className="daily-practice-item">
      <h4>{practice.title}</h4>
      
      {showDurationInput && !isCompleted ? (
        <div className="duration-input">
          <input 
            type="number" 
            min="1"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
          />
          <span className="unit">minutes</span>
        </div>
      ) : null}
      
      <button 
        className={`btn ${isCompleted ? 'btn-success' : 'btn-primary'}`}
        onClick={handleComplete}
        disabled={isCompleted}
      >
        {isCompleted ? 'Completed' : 'Mark as Complete'}
      </button>
    </div>
  );
};
```

### Setup Automatic Reset

To reset completion status at midnight, you'll need a scheduled function. In Supabase, you can use database functions and Edge Functions:

```sql
-- Create a scheduled Supabase Edge Function trigger (in Supabase dashboard)
-- This will run at midnight every day

-- Function name: resetDailyCompletions
-- Cron schedule: 0 0 * * *

-- Edge Function code (TypeScript):
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;

serve(async () => {
  try {
    // Create client with admin privileges
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Execute the reset function
    const { data, error } = await supabase.rpc('reset_daily_completions');
    
    if (error) throw error;
    
    return new Response(JSON.stringify({ success: true, updated: data }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
```

### Data Migration

For existing users, migrate their data with:

```sql
-- Add points column to practices table and initialize default values
DO $$ BEGIN
  -- Only add column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'practices' AND column_name = 'points_per_minute'
  ) THEN
    ALTER TABLE practices ADD COLUMN points_per_minute INTEGER NOT NULL DEFAULT 10;
    
    -- Backfill existing practices with default points values
    UPDATE practices SET points_per_minute = 
      CASE 
        WHEN category = 'meditation' THEN 15
        WHEN category = 'exercise' THEN 12
        WHEN category = 'mindfulness' THEN 10
        WHEN category = 'gratitude' THEN 8
        ELSE 10
      END;
  END IF;
END $$;

-- Migrate existing users' daily practices to the new table
DO $$ 
DECLARE
  user_rec RECORD;
  practice_ids TEXT[];
BEGIN
  -- Create new table if it doesn't exist
  CREATE TABLE IF NOT EXISTS user_daily_practices_enhanced (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    practice_ids TEXT[] NOT NULL DEFAULT '{}',
    points INTEGER NOT NULL DEFAULT 0,
    points_today INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
    streak_count INTEGER NOT NULL DEFAULT 0,
    best_streak INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT user_daily_practices_enhanced_user_id_key UNIQUE (user_id)
  );

  -- For each user with daily practices
  FOR user_rec IN 
    SELECT DISTINCT user_id FROM user_daily_practices
  LOOP
    -- Get all practice IDs for this user
    SELECT array_agg(practice_id) INTO practice_ids 
    FROM user_daily_practices 
    WHERE user_id = user_rec.user_id;
    
    -- Insert into new table
    INSERT INTO user_daily_practices_enhanced 
      (user_id, practice_ids, last_updated)
    VALUES 
      (user_rec.user_id, practice_ids, now())
    ON CONFLICT (user_id) DO UPDATE SET
      practice_ids = practice_ids,
      last_updated = now();
  END LOOP;
END $$;
```
