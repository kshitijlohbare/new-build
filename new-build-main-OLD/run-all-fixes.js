// run-all-fixes.js
// Script to run all the fixes for the wellbeing app
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

async function runScript(scriptPath) {
  console.log(`Running ${scriptPath}...`);
  try {
    const { stdout, stderr } = await execPromise(`node ${scriptPath}`);
    console.log(stdout);
    if (stderr) console.error(stderr);
    return true;
  } catch (error) {
    console.error(`Error running ${scriptPath}:`, error);
    return false;
  }
}

async function runAllFixes() {
  console.log('Starting all fixes for the wellbeing app...');
  
  console.log('\n--- Step 1: Fix default daily practices ---');
  const fixDailyResult = await runScript('./fix-default-daily-practices.js');
  
  console.log('\n--- Step 2: Fix practice completion status ---');
  const fixCompletionResult = await runScript('./fix-practice-completion.js');
  
  console.log('\n--- Summary of fixes ---');
  console.log('Fix default daily practices:', fixDailyResult ? 'SUCCESS' : 'FAILED');
  console.log('Fix practice completion status:', fixCompletionResult ? 'SUCCESS' : 'FAILED');
  
  console.log('\nAll fixes completed');
  return fixDailyResult && fixCompletionResult;
}

runAllFixes()
  .then(success => {
    if (success) {
      console.log('All scripts completed successfully');
      process.exit(0);
    } else {
      console.log('Some scripts failed, check logs for details');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Error running fixes:', error);
    process.exit(1);
  });
