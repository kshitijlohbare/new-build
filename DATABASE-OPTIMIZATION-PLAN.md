# Database Optimization Plan

## Current Issues

1. **Redundant Data Storage**: Currently, we store practice data in two places:
   - `isDaily` flag in the `practices` array within `user_practices` table
   - `user_daily_practices` junction table that maps user_id to practice_id

2. **Consistency Problems**: Having two sources of truth leads to sync issues:
   - The `isDaily` flag in the practice object might not match the junction table
   - Requires complex logic to keep both in sync

3. **Over-engineered Architecture**: Using a junction table for what is essentially a user-level preference adds complexity

4. **Performance Overhead**: Extra database operations to maintain both systems

## Simplified Schema Proposal

### Single Table Approach

We can simplify by using a **single table** for all user practice data:

```
user_practices
- user_id (PK)
- practices_data (JSONB)
- updated_at (Timestamp)
```

Where `practices_data` would contain:

```json
{
  "practices": [
    {
      "id": 123,
      "name": "Morning Meditation",
      "description": "10-minute mindfulness session",
      "isDaily": true,  // Single source of truth!
      "lastCompleted": "2025-06-24T08:30:00Z",
      "streak": 5,
      "source": "Huberman Lab"
    },
    {
      "id": 124,
      "name": "Cold Shower",
      "isDaily": false,
      ...
    }
  ],
  "progress": {
    "totalPoints": 250,
    "level": 3,
    "streakDays": 7,
    "achievements": [...]
  }
}
```

### Benefits

1. **Simplified API**: Single endpoint to update all practice data
2. **Reduced Database Operations**: No need to synchronize multiple tables
3. **Atomic Updates**: Changes to practices are atomic operations in a single JSON block
4. **Better Data Encapsulation**: All user-specific preferences stay with the user
5. **Reduced Network Overhead**: Single request to get all user practice data

## Migration Plan

### Phase 1: Client-Side Changes

1. Update the frontend to treat `isDaily` as the single source of truth
2. Continue writing to both systems for backward compatibility
3. Add logic to automatically fix inconsistencies at runtime

### Phase 2: Database Migration

1. Create database migration script to:
   - Ensure all practices in `user_daily_practices` have `isDaily=true` in `user_practices`
   - Set `isDaily=false` for any practice not in `user_daily_practices`

2. Update backend services to only read `isDaily` flag from the practices objects

### Phase 3: Remove Junction Table

1. Update all API endpoints to stop writing to `user_daily_practices` table
2. Create new optimized endpoints that only use the `user_practices` table
3. After sufficient testing period, deprecate and eventually remove the `user_daily_practices` table

## Implementation Details

### Updated Data Access Pattern

```typescript
// BEFORE: Two separate operations
const addToDaily = async (userId: string, practiceId: number) => {
  // Update in-memory practice
  await updatePracticeFlag(userId, practiceId, { isDaily: true });
  
  // Update junction table
  await addToDailyPracticesTable(userId, practiceId);
};

// AFTER: Single operation
const addToDaily = async (userId: string, practiceId: number) => {
  // Update only the practice object, no junction table needed
  await updatePracticeFlag(userId, practiceId, { isDaily: true });
};
```

### Filtering Daily Practices

```typescript
// BEFORE: Complex query involving a join
const getDailyPractices = async (userId: string) => {
  const { data } = await supabase
    .from('user_daily_practices')
    .select('practice_id')
    .eq('user_id', userId);
    
  const practiceIds = data.map(item => item.practice_id);
  
  // Then fetch full practice data with another query...
};

// AFTER: Simple filter operation
const getDailyPractices = async (userId: string) => {
  const { data } = await supabase
    .from('user_practices')
    .select('practices_data')
    .eq('user_id', userId)
    .single();
    
  return data.practices_data.practices.filter(p => p.isDaily === true);
};
```

## Performance Considerations

1. **Query Optimization**: For large practice collections, we can add database indexes or use database functions to filter directly within the JSON structure.

2. **Batch Updates**: The consolidated approach allows for efficient batch updates of multiple practices in a single operation.

3. **Caching**: With a simpler data model, caching becomes more effective as we have fewer invalidation scenarios.

## Conclusion

Moving to a simplified, single-table design will significantly reduce complexity, improve data consistency, and enhance performance. This aligns with modern database design principles for user-specific preference data, where keeping related data together improves both development experience and runtime performance.
