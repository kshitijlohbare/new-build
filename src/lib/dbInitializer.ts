import { supabase } from '@/lib/supabase';
import { checkRequiredTables, generateDatabaseSetupSQL } from '@/context/practiceUtils.enhanced';

/**
 * Initialize the database tables required for the wellbeing application
 */
export async function initializeDatabase() {
  try {
    // First, check if the required tables already exist
    const tablesExist = await checkRequiredTables();
    
    if (tablesExist) {
      console.log('All required database tables already exist');
      return true;
    }
    
    // If tables don't exist, try to create them
    console.log('Some required tables are missing. Attempting to create them...');
    
    // Option 1: Use the SQL directly from the enhanced utility
    const sql = generateDatabaseSetupSQL();
    
    // Option 2: Read the SQL file (uncomment if you prefer to use the file)
    // const sqlPath = path.join(process.cwd(), 'src', 'db', 'wellbeing_tables_setup.sql');
    // const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the SQL statements
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('Error initializing database:', error);
      return false;
    }
    
    console.log('Database tables created successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error initializing database:', error);
    return false;
  }
}

/**
 * A helper function for applications that don't have RPC access to execute raw SQL.
 * In this case, you would need to manually execute the SQL in the Supabase dashboard.
 */
export function getDbSetupInstructions() {
  return {
    instructions: `
    To set up the database tables for the wellbeing application, follow these steps:
    
    1. Go to your Supabase dashboard
    2. Navigate to the SQL Editor
    3. Create a new SQL query
    4. Copy the SQL from the src/db/wellbeing_tables_setup.sql file
    5. Execute the SQL
    `,
    sqlFilePath: '/src/db/wellbeing_tables_setup.sql'
  };
}

/**
 * This function can be called on application start to ensure the database is properly set up
 */
export async function ensureDatabaseSetup() {
  const success = await initializeDatabase();
  
  if (!success) {
    console.warn(
      'Unable to automatically initialize the database. ' +
      'You may need to manually set up the database tables. ' +
      'See the instructions in the /src/db/wellbeing_tables_setup.sql file.'
    );
  }
  
  return success;
}
