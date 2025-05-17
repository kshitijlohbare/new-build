# Wellbeing App Practice Management System Enhancements

This document outlines the enhancements made to the wellbeing application's practice management system.

## Database Structure Enhancements

The database structure has been enhanced to support a more robust practice management system with the following tables:

### 1. `practices` Table
- Stores all system-defined practices
- Each practice has a unique ID, name, description, benefits, and other metadata
- Includes a flag `is_system_practice` to identify system-provided practices

### 2. `user_practices` Table
- Stores user-specific data, including:
  - User-created custom practices as a JSONB array
  - User progress data (points, levels, streaks, etc.)
  - Linked to the user through the `user_id` field

### 3. `user_daily_practices` Table
- Implements a many-to-many relationship between users and the practices they've added to their daily routine
- Each record contains a `user_id` and a `practice_id`
- Allows efficient querying of which practices are part of a user's daily routine

## Enhanced Practice Management Features

The system now supports the following enhanced features:

### 1. Unique IDs for All Practices
- Each practice (both system and user-created) has a unique numeric ID
- These IDs are used consistently throughout the application

### 2. User-Created Practices
- Users can create their own custom practices
- Custom practices are stored with a `userCreated: true` flag
- Custom practices are also marked with the `createdByUserId` field to track ownership

### 3. System Practices vs. User Practices
- System practices are immutable and available to all users
- System practices are marked with `isSystemPractice: true`
- The UI now distinguishes between system practices and user-created practices

### 4. Practice Display and Management
- The UI now has tabs to show:
  - Daily practices (practices the user has added to their daily routine)
  - All practices (both system and user-created practices)
- Users can add/remove practices from their daily routine
- Users can create new custom practices

## Implementation Details

### Core Files Modified:

1. **PracticeContext.tsx**
   - Updated to use the enhanced practice utilities
   - Improved the `addPractice` function to properly set user ID and system practice flags

2. **practiceUtils.enhanced.ts**
   - Implements the enhanced database structure
   - Properly handles saving and loading practices from multiple tables

3. **Database Setup**
   - SQL file created for setting up the required tables
   - Includes table definitions, indexes, and sample data

### New Components:

1. **AllPractices.tsx**
   - Displays both system practices and user-created practices
   - Allows adding any practice to the daily practices

### Modified Components:

1. **Practices.tsx**
   - Updated to include tab navigation between daily practices and all practices

### Database Initialization:

The application now initializes the database structure at startup using the `dbInitializer.ts` module.

## Usage Guide

1. Create a new practice:
   - Go to the "All Practices" tab
   - Click "Create New Practice"
   - Fill in the practice details and submit

2. Add practices to your daily routine:
   - Find a practice in the "All Practices" tab
   - Click "Add to daily practices"
   - The practice will now appear in your "Daily Practices" tab

3. Remove a practice from your daily routine:
   - Find the practice in your "Daily Practices" tab
   - Click "Remove from daily practices"
   - The practice will be removed from your daily routine but will still be available in the "All Practices" tab
