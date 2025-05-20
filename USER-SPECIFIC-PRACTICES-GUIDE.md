# User-Specific Daily Practices Implementation Guide

This guide explains how to implement user-specific daily practices in the wellbeing app using Supabase Row Level Security (RLS).

## 1. Understanding the Database Structure

The application uses three key tables:

1. **practices** - Contains system-defined practices that all users can see
2. **user_practices** - Stores user-specific data including custom practices and progress
3. **user_daily_practices** - Many-to-many relationship between users and their daily practices

## 2. Implementing Row Level Security (RLS)

To ensure that each user can only access their own practice data, we've created RLS policies in the `enable-practices-rls.sql` file.

### How to Apply the RLS Policies

**Option 1: Using the Supabase Dashboard (Recommended)**

1. Log in to the [Supabase Dashboard](https://app.supabase.com)
2. Go to your project
3. Click on "SQL Editor"
4. Create a new query
5. Copy and paste the contents of `enable-practices-rls.sql`
6. Run the query

**Option 2: Using the Script (Requires API key)**

If you have your Supabase service key:

1. Update the `.env` file with your Supabase URL and service key
2. Run `npm install dotenv @supabase/supabase-js`
3. Run `node apply-rls-fixed.js`

## 3. RLS Policies Explained

The following policies have been implemented:

- **practices table**:
  - Everyone can view system practices
  - Only admins can modify system practices

- **user_practices table**:
  - Users can only view their own practice data
  - Users can only modify their own practice data

- **user_daily_practices table**:
  - Users can only view their own daily practices
  - Users can only modify their own daily practices

## 4. Practice Completion Tracking

We've added completion tracking to the user_daily_practices table:

- `completed` (boolean): Whether the practice has been completed
- `completed_at` (timestamp): When the practice was completed
- `streak` (integer): How many days in a row the practice has been completed

A database trigger automatically updates the `completed_at` field when a practice is marked as completed.

## 5. Verifying the Implementation

To verify that RLS is working:

1. Log in as different users in the app
2. Each user should only see their own daily practices
3. Adding/removing practices for one user should not affect others
4. Completing practices should only mark them as completed for the current user

## 6. Best Practices

When modifying the code:

- Always include user_id in queries to practices tables
- Use the enhanced utility functions in `practiceUtils.enhanced.ts` which properly filter by user ID
- Don't bypass RLS with service roles in client code

The current implementation already follows these best practices in:
- `savePracticeData`
- `loadPracticeData`
- `addToDailyPractices`
- `removeFromDailyPractices`
