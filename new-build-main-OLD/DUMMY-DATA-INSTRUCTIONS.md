# Dummy Data Instructions for Testing

This document provides instructions for adding dummy data to Supabase for testing the Community feature.

## Overview

To test the Community feature with sample data, you can use the scripts provided in this project to populate your Supabase database with dummy data for:
- Community delights
- User practices
- Tips and stories

## Using the Dummy Data Scripts

There are two ways to load dummy data:

### Option 1: Using the Node.js Script

1. Navigate to the project root in your terminal
2. Run one of the following commands:

```bash
# Load all dummy data
node insert-community-dummy-data.js

# Or use the newer version
node insert-community-dummy-data-v2.js
```

### Option 2: Using the JS API directly

You can import the helper functions from `src/scripts/communityDummyData.ts` in your code:

```typescript
// Import all functions
import { 
  insertAllDummyData, 
  insertDummyDelights,
  insertDummyPractices,
  insertDummyTipsAndStories
} from "@/scripts/communityDummyData";

// Load all dummy data
const result = await insertAllDummyData();
console.log(`Added ${result.delights.count} delights, ${result.practices.count} practices, and ${result.tipsAndStories.count} tips/stories`);

// Or load specific data types
const delightResult = await insertDummyDelights();
const practicesResult = await insertDummyPractices();
const tipsStoriesResult = await insertDummyTipsAndStories();
```

## Available Dummy Data

The dummy data includes:

1. **Delights**: Short posts about wellbeing moments
2. **Practices**: User-created wellbeing practices
3. **Tips & Stories**: Wellbeing tips and personal stories

## Tables Structure

The dummy data populates the following tables in Supabase:

- `community_delights`: Contains delight posts
- `community_practices`: Contains user practices
- `community_tips_stories`: Contains tips and stories

## For Developers

If you need to modify the dummy data or add more:

1. Check the file `src/scripts/communityDummyData.ts`
2. Look for arrays like `delightsSampleData`, `practicesSampleData`, etc.
3. Add your items to these arrays following the same structure

## Important Notes

- Dummy data should only be used in development/testing environments
- Running the scripts multiple times may result in duplicate entries
- The scripts will create the necessary tables if they don't exist
