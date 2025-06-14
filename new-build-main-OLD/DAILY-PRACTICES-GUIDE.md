# Daily Practices Implementation Guide

This document provides a comprehensive guide to how the Daily Practices system works in the wellbeing app. It covers the data model, key functions, and how persistence is handled across page reloads.

## Table of Contents

1. [Data Model](#data-model)
2. [Key Functions](#key-functions)
3. [Persistence Mechanism](#persistence-mechanism)
4. [UI Components](#ui-components)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

## Data Model

Daily practices are tracked across three main tables in the database:

### 1. `practices`
Stores the master list of all available practices.
- `id` - Unique identifier for the practice
- `name` - The name of the practice
- `description` - Detailed description of the practice
- `benefits` - Array of benefits gained from the practice
- `icon` - Icon representing the practice
- `is_system_practice` - Boolean flag indicating if this is a built-in practice

### 2. `user_practices`
Stores user-specific data about practices, including completion status and streaks.
- `user_id` - The user's ID
- `practices` - JSON array containing:
  - User-created practices in full
  - Status information for system practices (completion, streak)
- `progress` - User's progress data including points and achievements

### 3. `user_daily_practices`
Junction table that explicitly tracks which practices are marked as daily for each user.
- `user_id` - The user's ID
- `practice_id` - The ID of the practice marked as daily
- `added_at` - Timestamp when the practice was added to daily practices

## Key Functions

### Adding a Practice to Daily

When a practice is marked as daily, two things happen:
1. The `isDaily` flag on the practice object is set to `true`
2. A record is added to the `user_daily_practices` table

```typescript
// Adding a practice to daily
const addPractice = (practice: Practice) => {
  // Update the practice object with isDaily=true
  const updatedPractice = { ...practice, isDaily: true };
  setPractices(prev => {
    // Logic to update the practice in the array
  });
  
  // Add to the database relation table immediately
  if (user?.id) {
    addToDailyPractices(user.id, practice.id);
  }
};
```

### Removing a Practice from Daily

Similarly, when removing from daily:
1. The `isDaily` flag on the practice object is set to `false`
2. The corresponding record is removed from `user_daily_practices` table

```typescript
// Removing a practice from daily
const removePractice = (practiceId: number, removeFromDailyOnly: boolean) => {
  setPractices(prev => {
    // Logic to update or remove practice
  });
  
  // Remove from database relation table immediately
  if (user?.id) {
    removeFromDailyPractices(user.id, practiceId);
  }
};
```

### Loading Daily Practices

When the app loads, the following steps happen:
1. The `loadPracticeData` function fetches all practices from `practices` table
2. It also fetches the user's daily practices from `user_daily_practices` table
3. When constructing the practice objects, it sets `isDaily: true` for practices that are in the user's daily list

```typescript
const dailyPracticeIds = (dailyPractices || []).map(row => row.practice_id);

// When constructing practice objects:
const isDaily = dailyPracticeIds.includes(practiceId);
const practiceObject = {
  // other properties...
  isDaily: isDaily // Mark as daily if in user's daily list
};
```

### Default Daily Practices

Certain key practices are automatically marked as daily:
- Cold Shower Exposure
- Gratitude Journal
- Focus Breathing (3:3:6)

If these practices aren't already in the user's daily practices table, they're added during the loading process.

## Persistence Mechanism

### Primary Method: Database

The primary storage mechanism is the database:
1. `user_practices` table stores the user's practice data including completion status
2. `user_daily_practices` table explicitly tracks which practices are daily

### Fallback: LocalStorage

As a fallback, practice data is also saved to localStorage:
- The entire practice array with `isDaily` flags is stored
- This ensures the app can function even if database operations fail

### Synchronizing Daily Status

The `updateUserDailyPractices` function ensures the database reflects the current state of daily practices:
1. First fetches current daily practices from database
2. Compares with what's in memory
3. If they differ, updates the database by:
   - Deleting all existing daily practice records for the user
   - Reinserting the current set of daily practices

This approach ensures consistency even after changes made while offline.

## UI Components

### DailyPracticesSimple

This component displays practices marked as daily on the home page. It filters practices using:

```typescript
const displayedPractices = practices.filter(practice => practice.isDaily === true);
```

### AllPractices

This component shows all available practices and allows adding/removing from daily:

```typescript
const handleToggleDailyPractice = (practice: Practice) => {
  if (practice.isDaily) {
    // Remove from daily practices
    addPractice({ ...practice, isDaily: false });
  } else {
    // Add to daily practices
    addPractice({ ...practice, isDaily: true });
  }
};
```

## Testing

Several test scripts are provided to verify daily practices functionality:

1. `test-daily-practices.js` - Basic test that adds default practices
2. `test-daily-practices-enhanced.js` - Comprehensive test of adding/removing daily practices
3. `test-daily-practices-verification.js` - Verification script to confirm daily practices persist correctly

To run these tests:

```bash
# Set up environment variables first
cp .env.example .env
# Edit .env with your Supabase details and test user ID

# Run the verification test
node test-daily-practices-verification.js
```

## Troubleshooting

### Common Issues

1. **Daily practices not showing after refresh**
   - Check if `user_daily_practices` table exists and has records
   - Verify that the user ID is correct in both the UI and database
   - Check browser console for errors during practice data loading

2. **Key practices not automatically added**
   - Ensure the practice IDs are correct (should be 1, 2, and 4 for the key practices)
   - Check that the practices exist in the `practices` table with matching IDs
   - Verify the practice names match exactly: "Cold Shower Exposure", "Gratitude Journal", "Focus Breathing (3:3:6)"

3. **Database errors**
   - Ensure Supabase credentials are correct in the environment variables
   - Check if all required tables exist with the correct schema
   - Verify the user has proper permissions to access these tables

### Logging

The application includes extensive logging:
- Daily practice status is logged during save/load operations
- Database operations are logged with success/failure status
- Error details are captured for debugging

Enable detailed logging by setting `DEBUG=true` in your environment.

### Database Integrity Checks

To verify database integrity:

```sql
-- Check if a user has daily practices
SELECT user_id, COUNT(*) as daily_count 
FROM user_daily_practices 
WHERE user_id = 'your-user-id'
GROUP BY user_id;

-- Check if daily practices match what's marked as daily in memory
-- (This needs to be compared with what you see in the UI)
```

### Important Query Patterns

When querying tables through the Supabase REST API:

1. **Avoid using `count(*)` or aggregate functions directly**:
   ```typescript
   // INCORRECT - will cause "failed to parse select parameter" errors
   const { data, error } = await supabase
     .from('table_name')
     .select('count(*)')
   
   // CORRECT - select field(s) first, then count client-side
   const { data, error } = await supabase
     .from('table_name')
     .select('id')
   const count = data?.length || 0;
   ```

2. **Handle foreign key relationships carefully**:
   ```typescript
   // APPROACH 1: Separate queries (more reliable)
   // First get the IDs
   const { data: relations } = await supabase
     .from('user_followers')
     .select('follower_id')
     .eq('following_id', userId);
   
   // Then fetch the related records
   const followerIds = relations.map(r => r.follower_id);
   const { data: followers } = await supabase
     .from('user_profiles')
     .select('*')
     .in('id', followerIds);
   
   // APPROACH 2: Explicit join syntax (must match exact foreign key names)
   const { data } = await supabase
     .from('user_followers')
     .select(`
       follower_id,
       profile:user_profiles(*)
     `)
     .eq('following_id', userId);
   ```

## Implementation Notes

- The `isDaily` boolean flag is strictly compared using `=== true` to ensure proper type handling
- Database operations related to daily practices are performed immediately rather than waiting for auto-save
- Key practices are checked during load and automatically added to daily if missing
- Error handling allows the app to function even when database operations fail

## Recent Database Fixes

Several database-related issues were fixed to ensure the daily practices system works properly:

1. **Table Structure Issues**
   - Created missing `user_daily_practices` junction table to track which practices are marked as daily
   - Fixed foreign key relationships to ensure proper referential integrity
   - Ensured proper data types for ID fields (UUID for user references)

2. **Query Pattern Issues**
   - Updated queries to avoid using `count(*)` which can cause parsing errors in Supabase
   - Implemented proper query patterns for checking table existence
   - Fixed direct vs. joined query patterns for related tables

3. **Code Fixes**
   - Updated `practiceUtils.enhanced.ts` to use proper select syntax
   - Fixed the followers query in `ProfileContext.tsx` to use a two-step query approach
   - Updated the database integrity checks to properly handle foreign keys

For a more detailed explanation of the database fixes, see the [DATABASE-FIXES-SUMMARY.md](DATABASE-FIXES-SUMMARY.md) file.

## Recent Bug Fixes

### CORS Error Fix for Lottie Animations
The app was experiencing CORS errors when trying to load animations from lottie.host. This has been fixed by:
- Creating local Lottie animations in `src/assets/lottie-animations.ts`
- Enhancing the loading process in `DailyPracticesSimple.tsx` with better error handling
- Adding success/failure logging for animation loading

### SQL Query Errors in User Suggestions
The app was experiencing 400 Bad Request errors when trying to fetch suggested users due to:
1. Invalid SQL when handling empty arrays in the `not.in` clause
2. Attempting to order by a non-existent `followers_count` column

These issues were fixed by:
- Adding conditional logic to handle empty `followingIds` arrays
- Removing the problematic ordering clause
- Creating `add-followers-count-column.js` to add the missing column and related triggers

For more details on these recent fixes, see the [CORS-AND-400-ERROR-FIXES.md](CORS-AND-400-ERROR-FIXES.md) file.
