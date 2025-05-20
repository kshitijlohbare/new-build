// fix-triggers.js
import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// SSL workaround for Node.js
const isNode = typeof window === 'undefined' && typeof process !== 'undefined';
if (isNode) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const supabase = createClient(supabaseUrl, supabaseKey);

// First create the update_updated_at function that's missing
const createUpdateFunctionSQL = `
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
`;

// Then create the triggers that use this function
const createTriggersSQL = `
-- Apply trigger to user_profiles table
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- Apply trigger to community_delights table
DROP TRIGGER IF EXISTS update_community_delights_updated_at ON community_delights;
CREATE TRIGGER update_community_delights_updated_at
BEFORE UPDATE ON community_delights
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
`;

async function fixTriggers() {
  console.log('Creating update_updated_at function...');
  
  try {
    const functionResult = await supabase.rpc('execute_sql', {
      sql_command: createUpdateFunctionSQL
    });
    
    if (functionResult.error) {
      console.error('Error creating function:', functionResult.error);
      return;
    }
    
    console.log('Successfully created update_updated_at function');
    
    console.log('Creating triggers...');
    const triggerResult = await supabase.rpc('execute_sql', {
      sql_command: createTriggersSQL
    });
    
    if (triggerResult.error) {
      console.error('Error creating triggers:', triggerResult.error);
      return;
    }
    
    console.log('Successfully created triggers');
    
  } catch (error) {
    console.error('Error fixing triggers:', error);
  }
}

// Execute
fixTriggers()
  .then(() => console.log('Triggers fixed'))
  .catch(error => console.error('Failed to fix triggers:', error));
