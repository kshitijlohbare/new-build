// daily-practices-diagnostic.js
// This script can be run in the browser console to help diagnose and fix daily practices persistence issues

(function() {
  console.clear();
  console.log("%c🔍 Daily Practices Diagnostic Tool 🔍", "font-size: 16px; font-weight: bold; color: #4a90e2;");
  console.log("%cRunning diagnostics...", "font-style: italic;");

  // Check user authentication
  let userId = null;
  try {
    const authData = localStorage.getItem('supabase.auth.token');
    if (authData) {
      userId = JSON.parse(authData)?.currentSession?.user?.id;
    }
  } catch (e) { /* Ignore parsing errors */ }

  if (!userId) {
    console.error("%c❌ Authentication Issue: You are not logged in.", "color: #e74c3c; font-weight: bold;");
    console.log("Please log in and try again.");
    return;
  }

  console.log(`%c✅ User authenticated: ${userId.substring(0, 6)}...`, "color: #27ae60;");
  
  // Collect all practices data
  let practices = [];
  let dailyPractices = [];

  // Check React state if available
  if (window.__PRACTICE_DATA__) {
    practices = window.__PRACTICE_DATA__.practices || [];
    console.log(`%c✅ Found React practices: ${practices.length}`, "color: #27ae60;");
  } else {
    console.warn("%c⚠️ Cannot access React practice data", "color: #f39c12;");
  }

  // Check localStorage
  const userPracticesKey = `wellbeing_user_practices_${userId}`;
  const dailyPracticesKey = `daily_practices_${userId}`;
  
  try {
    const storedUserPractices = localStorage.getItem(userPracticesKey);
    if (storedUserPractices) {
      const parsedData = JSON.parse(storedUserPractices);
      if (parsedData.practices) {
        console.log(`%c✅ Found localStorage practices: ${parsedData.practices.length}`, "color: #27ae60;");
        
        // Check for daily practices in this data
        const localDaily = parsedData.practices.filter(p => p.isDaily === true);
        if (localDaily.length > 0) {
          console.log(`%c✅ Found ${localDaily.length} daily practices in localStorage`, "color: #27ae60;");
          localDaily.forEach(p => {
            console.log(`   • ${p.name || 'Unnamed'} (ID: ${p.id})`);
          });
          dailyPractices.push(...localDaily);
        } else {
          console.warn("%c⚠️ No daily practices found in localStorage", "color: #f39c12;");
        }
      }
    } else {
      console.warn("%c⚠️ No user practices found in localStorage", "color: #f39c12;");
    }
    
    // Check specific daily practices storage
    const storedDailyPractices = localStorage.getItem(dailyPracticesKey);
    if (storedDailyPractices) {
      const parsedData = JSON.parse(storedDailyPractices);
      if (parsedData.practices) {
        console.log(`%c✅ Found backup daily practices: ${parsedData.practices.length}`, "color: #27ae60;");
        parsedData.practices.forEach(p => {
          console.log(`   • ${p.name || 'Unnamed'} (ID: ${p.id})`);
        });
      }
    }
  } catch (e) {
    console.error("%c❌ Error parsing localStorage data", "color: #e74c3c;", e);
  }

  // Check if database functions are available
  let dbFunctionsAvailable = false;
  if (window.__PRACTICE_CONTEXT__ && typeof window.__PRACTICE_CONTEXT__.ensureDailyPracticesPersistence === 'function') {
    dbFunctionsAvailable = true;
    console.log("%c✅ Database functions available", "color: #27ae60;");
  } else {
    console.warn("%c⚠️ Enhanced database functions not available", "color: #f39c12;");
  }

  // Show summary and next steps
  console.log("\n%c📋 Diagnostic Summary:", "font-size: 14px; font-weight: bold;");
  console.log(`• User ID: ${userId.substring(0, 6)}...`);
  console.log(`• Total practices: ${practices.length}`);
  console.log(`• Daily practices: ${dailyPractices.length}`);
  console.log(`• Database functions: ${dbFunctionsAvailable ? 'Available' : 'Not available'}`);
  
  // Provide action buttons
  console.log("\n%c🔧 Available Actions:", "font-size: 14px; font-weight: bold;");

  // Function to attempt repair
  window.repairDailyPractices = function() {
    console.log("%cAttempting to repair daily practices...", "font-style: italic; color: #4a90e2;");
    
    // Create backup of current state
    const backupKey = `daily_practices_backup_${Date.now()}`;
    localStorage.setItem(backupKey, JSON.stringify({
      timestamp: new Date().toISOString(),
      dailyPractices: dailyPractices,
      userId: userId
    }));
    
    console.log(`%c✅ Created backup in localStorage: ${backupKey}`, "color: #27ae60;");
    
    // Force update to storage
    localStorage.setItem(dailyPracticesKey, JSON.stringify({
      practices: dailyPractices,
      updated_at: new Date().toISOString()
    }));
    
    // Try to update database if function available
    if (window.__PRACTICE_CONTEXT__ && typeof window.__PRACTICE_CONTEXT__.ensureDailyPracticesPersistence === 'function') {
      try {
        window.__PRACTICE_CONTEXT__.ensureDailyPracticesPersistence(userId, practices);
        console.log("%c✅ Triggered database update", "color: #27ae60;");
      } catch (e) {
        console.error("%c❌ Error updating database", "color: #e74c3c;", e);
      }
    } else {
      console.warn("%c⚠️ Cannot update database - functions not available", "color: #f39c12;");
    }
    
    console.log("%c✅ Repair attempt complete. Please refresh the page to see changes.", "color: #27ae60; font-weight: bold;");
  };
  
  // Function to visualize practice data
  window.showDailyPractices = function() {
    console.table(dailyPractices.map(p => ({
      id: p.id,
      name: p.name || 'Unnamed',
      isDaily: p.isDaily,
      icon: p.icon || 'none'
    })));
  };

  console.log("%cCall repairDailyPractices() to attempt fixing issues", "color: #4a90e2;");
  console.log("%cCall showDailyPractices() to see all daily practices in table format", "color: #4a90e2;");
  
  // Announce completion
  console.log("\n%c✅ Diagnostic complete!", "font-size: 14px; font-weight: bold; color: #27ae60;");
})();
