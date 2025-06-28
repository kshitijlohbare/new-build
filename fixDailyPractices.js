/**
 * fixDailyPractices.js
 * A diagnostic script to check and fix daily practices persistence issues
 * 
 * Usage instructions:
 * 1. Open browser console
 * 2. Copy and paste this entire script
 * 3. Check console output for diagnostic information
 */

(function() {
  console.log("🔍 Running Daily Practices Diagnostic...");
  
  // Check if we're in the right context
  if (typeof window.caktus === 'undefined' || !window.caktus) {
    console.error("❌ Error: This script must be run on the Caktus Coco website");
    return;
  }
  
  // Get current user and practice data
  const userId = localStorage.getItem('supabase.auth.token')
    ? JSON.parse(localStorage.getItem('supabase.auth.token'))?.currentSession?.user?.id
    : null;
    
  if (!userId) {
    console.error("❌ Error: No logged in user found. Please log in first.");
    return;
  }
  
  console.log(`👤 Found user: ${userId.substring(0, 6)}...`);
  
  // Check local storage for daily practices
  const storageKeys = Object.keys(localStorage).filter(k => 
    k.includes('daily_practices_') || 
    k.includes('wellbeing_user_practices')
  );
  
  console.log(`📦 Found ${storageKeys.length} relevant local storage items`);
  
  // Get practice context data if available
  let practiceData = null;
  try {
    if (window.__PRACTICE_CONTEXT__) {
      practiceData = window.__PRACTICE_CONTEXT__;
      console.log(`✅ Found practice context data: ${practiceData.practices?.length || 0} practices`);
    }
  } catch (err) {
    console.warn("⚠️ Could not access practice context");
  }
  
  // Diagnose issue: Count practices marked as daily
  const analyzeLocalData = () => {
    let dailyPractices = [];
    
    // Try to find daily practices from various sources
    storageKeys.forEach(key => {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        
        // From wellbeing_user_practices format
        if (data?.practices) {
          const daily = data.practices.filter(p => p.isDaily === true);
          if (daily.length > 0) {
            console.log(`📊 Found ${daily.length} daily practices in ${key}`);
            dailyPractices.push(...daily);
          }
        }
        
        // From daily_practices_userId format
        if (data?.practices && key.includes('daily_practices_')) {
          console.log(`📊 Found ${data.practices.length} practices in direct daily practices storage: ${key}`);
          dailyPractices.push(...data.practices);
        }
      } catch (e) {
        console.warn(`⚠️ Could not parse data in ${key}`);
      }
    });
    
    // Deduplicate by ID
    const uniqueIds = new Set();
    const uniqueDailyPractices = dailyPractices.filter(p => {
      if (!p.id || uniqueIds.has(p.id)) return false;
      uniqueIds.add(p.id);
      return true;
    });
    
    return uniqueDailyPractices;
  };
  
  // Find all daily practices across storage
  const dailyPractices = analyzeLocalData();
  console.log(`🔍 Found ${dailyPractices.length} unique daily practices in local storage`);
  dailyPractices.forEach(p => console.log(`  • ${p.name || p.title || 'Unnamed Practice'} (ID: ${p.id})`));
  
  // Attempt to fix by ensuring all data sources are in sync
  console.log("🔧 Attempting to fix daily practices persistence...");
  
  // Create backup of current state
  const backupKey = `daily_practices_backup_${Date.now()}`;
  localStorage.setItem(backupKey, JSON.stringify({
    timestamp: new Date().toISOString(),
    dailyPractices: dailyPractices,
    allKeys: storageKeys.map(k => ({ key: k, data: localStorage.getItem(k) }))
  }));
  console.log(`💾 Created backup in localStorage: ${backupKey}`);
  
  // Force update to storage
  if (dailyPractices.length > 0) {
    // Update direct storage
    localStorage.setItem(`daily_practices_${userId}`, JSON.stringify({
      practices: dailyPractices,
      updated_at: new Date().toISOString()
    }));
    
    console.log("✅ Updated local storage with consolidated daily practices");
    
    // If we have practice context and it has updateUserDailyPractices function
    if (window.__PRACTICE_CONTEXT__ && window.__PRACTICE_CONTEXT__.ensureDailyPracticesPersistence) {
      try {
        window.__PRACTICE_CONTEXT__.ensureDailyPracticesPersistence(userId, dailyPractices);
        console.log("✅ Triggered database update through context");
      } catch (e) {
        console.warn("⚠️ Could not update through context:", e);
      }
    }
  }
  
  console.log("✅ Daily Practices Fix Complete");
  console.log("ℹ️ Please refresh the page and verify your daily practices");
})();
