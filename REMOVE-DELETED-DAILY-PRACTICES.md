# Remove Deleted Daily Practices

This script allows you to manually remove daily practices that were previously deleted but still appear in your daily practice list.

## How to Use

1. Open the browser console (F12 or right-click > Inspect > Console)
2. Copy and paste the code below into the console
3. Press Enter to execute it
4. The script will find and remove any discrepancies between your saved practices and the displayed daily practices

```javascript
// Function to remove practices that shouldn't be daily
async function cleanupDailyPractices() {
  try {
    // Get the current user ID
    const { data: { user } } = await window.supabase.auth.getUser();
    
    if (!user) {
      console.error("You need to be logged in to run this script");
      return;
    }
    
    console.log("Checking daily practices for user:", user.id);
    
    // Step 1: Get practices from user_practices table (has isDaily flags)
    const { data: userPracticesData, error: practicesError } = await window.supabase
      .from('user_practices')
      .select('practices')
      .eq('user_id', user.id)
      .single();
    
    if (practicesError) {
      console.error("Error fetching user practices:", practicesError);
      return;
    }
    
    if (!userPracticesData || !userPracticesData.practices) {
      console.log("No practice data found");
      return;
    }
    
    const practices = userPracticesData.practices;
    const isDailyInMemory = practices.filter(p => p.isDaily === true);
    console.log(`Found ${isDailyInMemory.length} practices marked as daily in memory`);
    
    // Step 2: Get practices from user_daily_practices junction table
    const { data: junctionData, error: junctionError } = await window.supabase
      .from('user_daily_practices')
      .select('practice_id')
      .eq('user_id', user.id);
      
    if (junctionError) {
      console.error("Error fetching junction table data:", junctionError);
      return;
    }
    
    const dailyPracticesInDb = junctionData || [];
    console.log(`Found ${dailyPracticesInDb.length} practices in daily practices junction table`);
    
    // Step 3: Find practices that are in the junction table but not marked as daily in memory
    const dailyInMemoryIds = isDailyInMemory.map(p => p.id);
    const junctionIds = dailyPracticesInDb.map(p => p.practice_id);
    
    const idsToRemove = junctionIds.filter(id => !dailyInMemoryIds.includes(id));
    console.log(`Found ${idsToRemove.length} practices to remove from daily`);
    
    // Step 4: Delete mismatched practices from the junction table
    if (idsToRemove.length > 0) {
      console.log("Removing practices:", idsToRemove);
      
      for (const idToRemove of idsToRemove) {
        const { error: removeError } = await window.supabase
          .from('user_daily_practices')
          .delete()
          .eq('user_id', user.id)
          .eq('practice_id', idToRemove);
        
        if (removeError) {
          console.error(`Error removing practice ${idToRemove}:`, removeError);
        } else {
          console.log(`Successfully removed practice ${idToRemove} from daily`);
        }
      }
      
      console.log("✅ Cleanup completed! Please refresh the page to see changes.");
    } else {
      console.log("✅ No issues found! All daily practices are correctly synced.");
    }
  } catch (error) {
    console.error("Error in cleanup:", error);
  }
}

// Run the function
cleanupDailyPractices();
```

## What This Does

This script will:

1. Check your user account and current practice data
2. Compare practices marked as daily in memory with those stored in the database
3. Find any practices that are in the database but not actually marked as daily
4. Remove those practices from your daily list

After running this script, refresh the page to see the updated daily practices list.

## If Issues Persist

If you continue to experience issues with daily practices after running this script, please contact support for further assistance.
