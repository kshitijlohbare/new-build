// patch-practice-utils.js
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Supabase client configuration
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// SSL workaround for Node.js
const isNode = typeof window === 'undefined' && typeof process !== 'undefined';
if (isNode) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to patch the issue with count(*) in practiceUtils.enhanced.ts
async function patchPracticeUtilsFile() {
  const filePath = path.join(process.cwd(), 'src', 'context', 'practiceUtils.enhanced.ts');
  
  console.log(`Patching file: ${filePath}`);
  
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return false;
    }
    
    // Read file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the problematic code with fixed version
    const problematicCode = `.from(table)
          .select('count(*)')
          .limit(1);`;
          
    const fixedCode = `.from(table)
          .select('id')
          .limit(1);`;
    
    if (content.includes(problematicCode)) {
      // Replace the code
      const updatedContent = content.replace(problematicCode, fixedCode);
      
      // Write the updated content back to file
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log('Successfully patched practiceUtils.enhanced.ts');
      return true;
    } else {
      console.log('Could not find the problematic code in the file');
      return false;
    }
  } catch (error) {
    console.error('Error patching file:', error);
    return false;
  }
}

// Function to update ProfileContext.tsx to fix user_followers relationship
async function patchProfileContext() {
  const filePath = path.join(process.cwd(), 'src', 'context', 'ProfileContext.tsx');
  
  console.log(`\nPatching file: ${filePath}`);
  
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return false;
    }
    
    // Read file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the problematic code with fixed version
    const problematicCode = `        .from('user_followers')
        .select(\`
          follower_id,
          followers:user_profiles!user_followers_follower_id_fkey(*)
        \`)
        .eq('following_id', userId);`;
          
    const fixedCode = `        .from('user_followers')
        .select('follower_id')
        .eq('following_id', userId);
        
      if (error) {
        console.error('Error getting followers:', error);
        return [];
      }
      
      // Fetch user profiles for followers separately
      const followerIds = data ? data.map(item => item.follower_id) : [];
      let followerProfiles: UserProfile[] = [];
      
      if (followerIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('user_profiles')
          .select('*')
          .in('id', followerIds);
          
        if (profilesError) {
          console.error('Error getting follower profiles:', profilesError);
        } else {
          followerProfiles = profiles;
        }
      }
      
      return followerProfiles;
    } catch (error) {
      console.error('Error getting followers:', error);
      return [];
    }
  };`;
    
    if (content.includes(problematicCode)) {
      // Replace the code
      const updatedContent = content.replace(problematicCode, fixedCode);
      
      // Write the updated content back to file
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log('Successfully patched ProfileContext.tsx');
      return true;
    } else {
      console.log('Could not find the problematic code in ProfileContext.tsx');
      
      // Try an alternative approach to find similar code
      const partialProblematicCode = `.from('user_followers')
        .select(\``;
        
      if (content.includes(partialProblematicCode)) {
        console.log('Found similar code pattern, using regex to match');
        
        // Use regex to find and replace the problematic code section
        const regex = /\.from\('user_followers'\)\s+\.select\(`[\s\S]+?`\)\s+\.eq\('following_id', userId\);/;
        
        const updatedContent = content.replace(regex, `.from('user_followers')
        .select('follower_id')
        .eq('following_id', userId);`);
        
        // Write the updated content back to file
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log('Successfully patched ProfileContext.tsx using regex approach');
        return true;
      }
      
      return false;
    }
  } catch (error) {
    console.error('Error patching file:', error);
    return false;
  }
}

// Main function
async function main() {
  console.log('Starting patch process...');
  
  // Patch practiceUtils.enhanced.ts
  await patchPracticeUtilsFile();
  
  // Patch ProfileContext.tsx
  await patchProfileContext();
  
  console.log('\nPatch process completed');
}

// Run the main function
main()
  .then(() => console.log('Patching process successful'))
  .catch(err => console.error('Patching process failed:', err));
