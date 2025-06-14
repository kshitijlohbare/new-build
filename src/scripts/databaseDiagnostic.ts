import { supabase } from '@/lib/supabase';
import { checkRequiredTables, updateUserDailyPractices } from '../context/practiceUtils.fixed';
import { Practice } from '../context/PracticeContext';

/**
 * Comprehensive diagnostic to find and fix database issues
 */
export const diagnoseAndFixDatabaseIssues = async (userId: string, practices: Practice[]) => {
  if (!userId) {
    console.error('Cannot diagnose database issues without a user ID');
    return {
      success: false,
      message: 'No user ID provided'
    };
  }
  
  console.log('Starting database diagnostic for user:', userId);
  const results = {
    tablesExist: false,
    userPracticesTableExists: false,
    dailyPracticesTableExists: false,
    userPracticesRecordExists: false,
    dailyPracticesCount: 0,
    fixesApplied: [] as string[]
  };
  
  try {
    // Step 1: Check if tables exist
    results.tablesExist = await checkRequiredTables();
    console.log('Tables exist check result:', results.tablesExist);

    // Step 2: Check user_practices table specifically 
    try {
      const { error: userPracticesError } = await supabase
        .from('user_practices')
        .select('id')
        .limit(1);
        
      results.userPracticesTableExists = !userPracticesError;
      
      if (userPracticesError) {
        console.log('Fix: Creating user_practices table');
        try {
          await supabase.rpc('create_user_practices_table');
          results.fixesApplied.push('Created user_practices table');
          results.userPracticesTableExists = true;
        } catch (createError) {
          console.error('Failed to create table:', createError);
        }
      }
    } catch (error) {
      console.error('Error checking user_practices table:', error);
    }
    
    // Step 3: Check user_daily_practices table specifically
    try {
      const { error: dailyPracticesError } = await supabase
        .from('user_daily_practices')
        .select('id')
        .limit(1);
        
      results.dailyPracticesTableExists = !dailyPracticesError;
      
      if (dailyPracticesError) {
        console.log('Fix: Creating user_daily_practices table');
        try {
          await supabase.rpc('create_user_daily_practices_table');
          results.fixesApplied.push('Created user_daily_practices table');
          results.dailyPracticesTableExists = true;
        } catch (createError) {
          console.error('Failed to create table:', createError);
        }
      }
    } catch (error) {
      console.error('Error checking user_daily_practices table:', error);
    }
    
    // Step 4: Check if user has record in user_practices table
    if (results.userPracticesTableExists) {
      try {
        const { data, error } = await supabase
          .from('user_practices')
          .select('id')
          .eq('user_id', userId)
          .single();
          
        results.userPracticesRecordExists = !!data;
        
        if (error || !data) {
          console.log('User has no record in user_practices table');
          
          // Check if practices exist to create a record with
          if (practices && practices.length > 0) {
            console.log('Fix: Creating user_practices record with existing practices');
            
            const { error: insertError } = await supabase
              .from('user_practices')
              .insert({
                user_id: userId,
                practices: practices,
                progress: {
                  totalPoints: 0,
                  level: 1,
                  nextLevelPoints: 50,
                  streakDays: 0,
                  totalCompleted: 0,
                  achievements: []
                }
              });
              
            if (!insertError) {
              results.fixesApplied.push('Created user_practices record');
              results.userPracticesRecordExists = true;
            } else {
              console.error('Failed to create user_practices record:', insertError);
            }
          }
        }
      } catch (error) {
        console.error('Error checking user record in user_practices table:', error);
      }
    }
    
    // Step 5: Check user_daily_practices records
    if (results.dailyPracticesTableExists) {
      try {
        const { data, error } = await supabase
          .from('user_daily_practices')
          .select('practice_id')
          .eq('user_id', userId);
          
        if (!error && data) {
          results.dailyPracticesCount = data.length;
          console.log(`User has ${data.length} daily practices records`);
          
          // Extract the daily practice IDs
          const currentDailyPracticeIds = data.map((p: any) => p.practice_id);
          
          // Find daily practices in the current practices list
          const dailyPractices = practices.filter(p => p.isDaily === true);
          const dailyPracticeIds = dailyPractices.map(p => p.id);
          
          // Check if they match
          const identical = 
            currentDailyPracticeIds.length === dailyPracticeIds.length && 
            currentDailyPracticeIds.every((id: number) => dailyPracticeIds.includes(id)) &&
            dailyPracticeIds.every(id => currentDailyPracticeIds.includes(id));
            
          if (!identical) {
            console.log('Fix: Daily practices in DB do not match current practices. Syncing...');
            await updateUserDailyPractices(userId, practices);
            results.fixesApplied.push('Synchronized daily practices');
          } else {
            console.log('Daily practices are already in sync, no fix needed');
          }
        } else {
          console.error('Error checking user_daily_practices records:', error);
          
          if (practices && practices.length > 0) {
            // Add daily practices to the table
            const dailyPractices = practices.filter(p => p.isDaily === true);
            if (dailyPractices.length > 0) {
              console.log('Fix: Adding daily practices from current practices list');
              await updateUserDailyPractices(userId, practices);
              results.fixesApplied.push('Added missing daily practices');
              
              // Verify the addition
              const { data: verifyData } = await supabase
                .from('user_daily_practices')
                .select('practice_id')
                .eq('user_id', userId);
                
              if (verifyData) {
                results.dailyPracticesCount = verifyData.length;
                console.log(`Now user has ${verifyData.length} daily practices records`);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error checking user_daily_practices records:', error);
      }
    }
    
    console.log('Diagnostic complete with results:', results);
    
    return {
      success: true,
      results
    };
  } catch (error) {
    console.error('Error during database diagnostic:', error);
    return {
      success: false,
      message: `Diagnostic error: ${error}`
    };
  }
};
