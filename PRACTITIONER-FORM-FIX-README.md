# Practitioner Onboarding Form Fix

## Problem Overview

The practitioner onboarding form is failing with a "400 Bad Request" error when submitting the form. This is happening because the form is trying to submit data to columns that don't exist in the database.

Specifically, these columns need to be added to the `practitioners` table:
- `conditions_treated` (TEXT[] array)
- `session_formats` (TEXT[] array)
- `availability_schedule` (TEXT)
- `calendly_link` (TEXT)

## Available Solutions

### 1. Using the Database Diagnostic Tool (UI-based)

We've created a web interface for checking and fixing the database schema:

1. Navigate to `/db-diagnostic` in your browser
2. Click "Check Column Status" to see which columns are missing
3. If columns are missing, click "Apply Database Fix"
4. Enter your Supabase service role key when prompted

### 2. Using the SQL Fix Script

We've created an SQL script that adds the missing columns:

1. Open the Supabase SQL Editor
2. Paste the contents of `/Users/kshitijlohbare/Downloads/new build/fix-sql.sql`
3. Execute the script

### 3. Using the Automated Shell Script

We've created a shell script that runs the SQL fix:

```bash
cd "/Users/kshitijlohbare/Downloads/new build"
./execute-fix.sh
```

When prompted, enter your Supabase URL and service role key.

### 4. Using the JavaScript Utility

We've created a Node.js script for programmatic fixes:

```bash
cd "/Users/kshitijlohbare/Downloads/new build"
node fix-db-columns.js
```

## Technical Details

### Form Submission Code

The key part of the code in PractitionerOnboarding.tsx that's causing the issue:

```typescript
// This prepares the data to be submitted to the database
const practitionerData = {
  // ...other fields
  conditions_treated: formData.conditions, 
  session_formats: formData.session_format,
  availability_schedule: formData.availability,
  calendly_link: formData.calendly_link
};

// This is where the 400 error occurs because the columns don't exist
const { error } = await supabase.from('practitioners').insert([practitionerData]);
```

### SQL Fix

The SQL to fix the database schema:

```sql
-- Add conditions_treated as a text array (since it's a multi-select in the form)
ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS conditions_treated TEXT[];

-- Add session_formats as a text array (since it's a multi-select in the form)
ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS session_formats TEXT[];

-- Add availability_schedule as text field
ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS availability_schedule TEXT;

-- Add calendly_link as text field
ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS calendly_link TEXT;
```

## Verification

After applying the fix, you should:

1. Navigate to `/practitioner-onboarding` in your browser
2. Fill out the form completely
3. Submit the form - it should now work without errors
4. Verify the data was saved correctly by checking your database

## Troubleshooting

If you're still experiencing issues:

1. Check if the RPC `exec` function exists in your Supabase instance
2. Make sure your service role key has the necessary permissions
3. Try adding the columns manually via the Supabase table editor
4. Check the browser console for any additional error details
