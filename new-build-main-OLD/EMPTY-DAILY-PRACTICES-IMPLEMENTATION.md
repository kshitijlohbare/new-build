# Daily Practices Empty Start Implementation

## Overview
This implementation modifies the wellbeing app so that for every new user, the 'Daily Practices' section starts empty. Previously, certain default practices ("Cold Shower Exposure", "Gratitude Journal", and "Focus Breathing (3:3:6)") were automatically set as daily practices for new users. Now, all practices (including these key ones) will only be added to a user's daily practices when the user explicitly adds them from the practices page.

## Changes Made

### 1. Modified Initial Practice Data
- Updated the `isDaily` flag in all initial practice data to `false` by default
- Removed special treatment of key practices in the initial data

### 2. Updated New User Initialization
- Modified the code that initializes default practices for new users to set `isDaily: false` for all practices
- Updated the code that initializes demo mode to also set `isDaily: false` for all practices

### 3. Removed Auto-Addition of Key Practices 
- Removed the logic that automatically added key practices to a user's daily practices list
- Modified the system practice formatting to only mark practices as daily if they're explicitly added by the user

### 4. Updated Practice Addition Logic
- Removed special treatment of key practices in the `addPractice` function
- Ensured that practices are only marked as daily when explicitly added by the user

## Files Modified

1. `/src/context/PracticeContext.tsx`
   - Updated initial practice data default values
   - Modified new user initialization logic
   - Updated practice addition logic to remove special treatment of key practices

2. `/src/context/practiceUtils.enhanced.ts`
   - Removed automatic addition of key practices to daily list
   - Updated how daily practices are determined
   - Simplified logic to respect user preferences only

## Testing
To test these changes:
1. Create a new user account
2. Verify that the daily practices section is empty
3. Add a practice from the practices page
4. Verify that it appears in the daily practices section
5. Remove a practice from daily practices
6. Verify that it disappears from the daily practices section

## Expected Behavior
- New users start with an empty daily practices section
- All practices (including key ones) need to be manually added from the practices page
- The system retains which practices are marked as daily once added/removed by the user
