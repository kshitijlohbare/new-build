# Function Search Path Security Fix

This document explains how to fix the security issue with the `public.execute_sql` function in your Supabase database.

## The Issue

The `public.execute_sql` function has been identified as having a mutable search path, which means it does not have a fixed schema search path. This creates several risks:

1. **Security Vulnerability**: Without a fixed search path, the function can execute against different schemas depending on the current session's settings, potentially allowing SQL injection attacks.

2. **Unpredictable Behavior**: The function may not consistently use the expected schemas, leading to unpredictable results.

3. **Schema Pollution**: Users could inadvertently access or modify objects in schemas they shouldn't have access to.

## The Fix

The solution is to set a fixed search path for the function using the `SET search_path` clause. This ensures that the function always operates within the specified schemas regardless of the session's search path settings.

### Option 1: Apply the Fix via Supabase Dashboard (Recommended)

1. Log into the [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to the SQL Editor
4. Open the provided `fix-execute-sql-function.sql` file
5. Copy its contents into the SQL Editor
6. Execute the SQL

### Option 2: Use the JS Script

Alternatively, you can run the `apply-execute-sql-fix.js` script:

```bash
node apply-execute-sql-fix.js
```

Note: This script requires appropriate permissions in Supabase.

## Verifying the Fix

After applying the fix, you can verify that the function now has a fixed search path by querying the PostgreSQL system catalog:

```sql
SELECT proname, prosecdef, proconfig 
FROM pg_proc p 
JOIN pg_namespace n ON p.pronamespace = n.oid 
WHERE n.nspname = 'public' AND p.proname = 'execute_sql';
```

The `proconfig` column should now contain a value that includes the search path setting.

## Why This Fix Works

By setting `SET search_path = public` on the function, we ensure that:

1. The function always operates within the public schema
2. It cannot accidentally access or modify objects in other schemas
3. Users cannot manipulate the search path to access unauthorized schemas

This follows the principle of least privilege, where the function only has access to what it actually needs to function properly.
