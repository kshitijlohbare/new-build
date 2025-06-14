#!/usr/bin/env node

import { supabase } from './src/lib/supabase.js';

async function verifyFitnessTables() {
  try {
    console.log('🔍 Verifying fitness groups tables...');
    
    // Test fitness_groups table
    const { data: groups, error: groupsError } = await supabase
      .from('fitness_groups')
      .select('*')
      .limit(5);
    
    if (groupsError) {
      console.error('❌ fitness_groups table error:', groupsError.message);
      return false;
    }
    
    console.log(`✅ fitness_groups table exists with ${groups?.length || 0} sample groups`);
    
    // Test fitness_group_members table
    const { data: members, error: membersError } = await supabase
      .from('fitness_group_members')
      .select('*')
      .limit(1);
    
    if (membersError) {
      console.error('❌ fitness_group_members table error:', membersError.message);
      return false;
    }
    
    console.log('✅ fitness_group_members table exists');
    
    // Test the utility functions
    console.log('🧪 Testing utility functions...');
    
    const { getFitnessGroups } = await import('./src/helpers/fitnessGroupUtils.js');
    
    const allGroups = await getFitnessGroups();
    console.log(`✅ getFitnessGroups() returned ${allGroups.length} groups`);
    
    if (allGroups.length > 0) {
      console.log('📊 Sample group:', {
        name: allGroups[0].name,
        category: allGroups[0].category,
        memberCount: allGroups[0].memberCount
      });
    }
    
    console.log('\n🎉 All fitness groups functionality is working correctly!');
    console.log('✅ You can now use the fitness groups feature without errors.');
    
    return true;
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
    return false;
  }
}

verifyFitnessTables()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Verification script error:', error);
    process.exit(1);
  });
