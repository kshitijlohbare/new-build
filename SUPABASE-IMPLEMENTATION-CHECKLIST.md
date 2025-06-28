# Supabase Implementation Checklist

## Prerequisites

- [ ] Backup all existing data before making changes
- [ ] Make sure you have admin access to your Supabase project
- [ ] Test these changes in a development environment first

## Database Structure Changes

### 1. Create/Update Tables

- [ ] Run `create_optimized_table.sql` in the SQL Editor to create/update the `user_practices` table
- [ ] Verify the table was created with the proper structure
- [ ] Check that RLS policies were applied correctly

### 2. Run Data Migration

- [ ] Run `migrate_practice_data.sql` to create the migration functions
- [ ] Execute `SELECT * FROM migrate_all_user_practice_data()` to perform the migration
- [ ] Verify data was migrated correctly by checking sample user records

### 3. Create Helper Functions

- [ ] Run `daily_practices_helper.sql` to create the helper function and RPC endpoint
- [ ] Test the function with `SELECT get_daily_practices('your-test-user-id')`
- [ ] Verify the function returns the expected daily practices

## Frontend Integration

### 1. Update API Usage

- [ ] Create new API functions that use the optimized table structure
- [ ] Implement functionality to:
  - Read practice data from the single table
  - Update practice data including the isDaily flag
  - Filter practices client-side based on isDaily flag

### 2. Testing Phase

- [ ] Implement dual-write approach during testing:
  - Write to both old and new structures
  - Read from new structure
  - Compare results for consistency

### 3. Phase Out Old Structure

Only after thorough testing:

- [ ] Remove references to the old table in the code
- [ ] Update all API endpoints to use only the new table
- [ ] Remove dual-write code

## Production Deployment

- [ ] Schedule maintenance window if needed
- [ ] Deploy frontend code changes
- [ ] Run migrations on the production database
- [ ] Monitor for any issues
- [ ] Verify data consistency after migration

## (Optional) Cleanup

After confirming everything works (recommended to wait at least a few weeks):

- [ ] Create database backup
- [ ] Create SQL script to drop the `user_daily_practices` table if no longer needed
