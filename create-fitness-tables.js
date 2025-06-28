#!/usr/bin/env node

import { supabase } from './src/lib/supabase.js';
import fs from 'fs';
import path from 'path';

async function createFitnessTables() {
  try {
    console.log('🏃 Creating fitness groups tables...');
    
    // Read the SQL schema file
    const sqlPath = path.join(process.cwd(), 'supabase', 'fitness_groups_schema.sql');
    
    if (!fs.existsSync(sqlPath)) {
      console.error('❌ SQL schema file not found at:', sqlPath);
      return false;
    }
    
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the SQL to create tables
    // const { error } = await supabase.rpc('execute_sql', { sql_text: sqlContent });
    
    // if (error) {
    //   console.error('❌ Error creating tables with execute_sql:', error);
      
      // Try alternative approach - execute each statement separately
      console.log('🔄 Trying alternative approach...');
      
      // Split SQL into individual statements and execute
      const statements = sqlContent
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);
      
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            console.log('Executing:', statement.substring(0, 50) + '...');
            const { error: stmtError } = await supabase.rpc('execute_sql', { 
              sql_text: statement + ';' 
            });
            
            if (stmtError) {
              console.warn('⚠️ Statement error (continuing):', stmtError.message);
            }
          } catch (err) {
            console.warn('⚠️ Statement failed (continuing):', err.message);
          }
        }
      }
    // }
    
    // Verify tables were created
    console.log('🔍 Verifying tables were created...');
    
    const { data: groups, error: groupsError } = await supabase
      .from('fitness_groups')
      .select('*')
      .limit(1);
    
    const { data: members, error: membersError } = await supabase
      .from('fitness_group_members')
      .select('*')
      .limit(1);
    
    if (!groupsError && !membersError) {
      console.log('✅ Fitness groups tables created successfully!');
      
      // Add some sample data
      console.log('📊 Adding sample fitness groups...');
      
      const sampleGroups = [
        {
          name: 'Morning Yoga Warriors',
          description: 'Start your day with peaceful yoga sessions in the park. All skill levels welcome!',
          location: 'Central Park, Mumbai',
          latitude: 19.0760,
          longitude: 72.8777,
          category: 'yoga',
          meeting_frequency: 'Mon, Wed, Fri 7:00 AM',
          creator_id: (await supabase.auth.getUser()).data.user?.id || 'system'
        },
        {
          name: 'Weekend Hiking Club',
          description: 'Explore beautiful trails and connect with nature every weekend. Great workout and fresh air!',
          location: 'Sanjay Gandhi National Park',
          latitude: 19.2147,
          longitude: 72.9101,
          category: 'hiking',
          meeting_frequency: 'Saturdays 6:00 AM',
          creator_id: (await supabase.auth.getUser()).data.user?.id || 'system'
        },
        {
          name: 'Beach Running Group',
          description: 'Run along the beautiful coastline with a supportive group. Beginner to advanced runners welcome.',
          location: 'Juhu Beach, Mumbai',
          latitude: 19.0969,
          longitude: 72.8267,
          category: 'running',
          meeting_frequency: 'Tue, Thu, Sun 6:30 AM',
          creator_id: (await supabase.auth.getUser()).data.user?.id || 'system'
        }
      ];
      
      for (const group of sampleGroups) {
        try {
          const { data, error } = await supabase
            .from('fitness_groups')
            .insert([group])
            .select()
            .single();
          
          if (!error) {
            console.log(`✅ Created sample group: ${group.name}`);
          } else {
            console.warn(`⚠️ Failed to create sample group ${group.name}:`, error.message);
          }
        } catch (err) {
          console.warn(`⚠️ Failed to create sample group ${group.name}:`, err.message);
        }
      }
      
      return true;
    } else {
      console.error('❌ Tables verification failed:');
      if (groupsError) console.error('Groups table error:', groupsError);
      if (membersError) console.error('Members table error:', membersError);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

// Run the function
createFitnessTables()
  .then(success => {
    if (success) {
      console.log('🎉 Fitness groups setup completed successfully!');
      process.exit(0);
    } else {
      console.log('💥 Fitness groups setup failed!');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 Script error:', error);
    process.exit(1);
  });
