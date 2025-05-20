// comprehensive-ssl-test.mjs - Verify all Supabase client implementations
// This script tests multiple approaches to fix the SSL issue

// Node.js built-in modules
import fs from 'fs';
import https from 'https';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

// Get directory name for current module
const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Function to test a client
async function testClient(name, clientModule) {
  console.log(`\n===== Testing ${name} =====`);
  
  try {
    // Test connection
    const { supabase } = clientModule;
    console.log(`Got client: ${supabase ? 'YES' : 'NO'}`);
    
    // Try a simple query
    console.log('Attempting query...');
    const { data, error } = await supabase.from('practices').select('id').limit(1);
    
    if (error) {
      console.error(`❌ ERROR with ${name}:`, error.message);
      return false;
    } else {
      console.log(`✅ SUCCESS with ${name}:`, data);
      return true;
    }
  } catch (e) {
    console.error(`❌ EXCEPTION with ${name}:`, e);
    return false;
  }
}

// Main function to test all approaches
async function runTests() {
  console.log('=== COMPREHENSIVE SUPABASE SSL TEST ===');
  console.log('Environment: Node.js');
  console.log('Testing various approaches to fix SSL certificate verification issues');
  
  // Check environment variables
  console.log('\n== Environment Variables ==');
  console.log('NODE_TLS_REJECT_UNAUTHORIZED:', process.env.NODE_TLS_REJECT_UNAUTHORIZED || '(not set)');
  
  // Test direct HTTPS request
  console.log('\n== Testing direct HTTPS request ==');
  await new Promise((resolve) => {
    const req = https.request('https://svnczxevigicuskppyfz.supabase.co', { method: 'GET' }, (res) => {
      console.log('HTTPS Status:', res.statusCode);
      resolve();
    });
    
    req.on('error', (error) => {
      console.error('HTTPS Error:', error.message);
      resolve();
    });
    
    req.end();
  });

  // Test supabase.js
  try {
    console.log('\n== Testing supabase.js ==');
    const supabaseJS = await import('./src/lib/supabase.js');
    await testClient('supabase.js', supabaseJS);
  } catch (e) {
    console.error('Error importing supabase.js:', e);
  }
  
  // Test practiceUtils.fixed.ts using a workaround for TypeScript
  try {
    console.log('\n== Testing practiceUtils.fixed.ts ==');
    
    // The most reliable workaround - force disable SSL verification before imports
    console.log('Forcing NODE_TLS_REJECT_UNAUTHORIZED=0 before import');
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    
    // Use --experimental-specifier-resolution=node if available
    let fixedUtils;
    try {
      fixedUtils = await import('./src/context/practiceUtils.fixed.js');
    } catch (e) {
      console.error('Cannot directly import .ts file, would need ts-node or compilation first');
    }
    
    if (fixedUtils) {
      await testClient('practiceUtils.fixed.ts', fixedUtils);
    }
  } catch (e) {
    console.error('Error importing practiceUtils.fixed.ts:', e);
  }

  // Test simple client with direct SSL workaround
  console.log('\n== Testing direct SSL workaround ==');
  
  // Ensure SSL verification is disabled
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const directClient = {
      supabase: createClient(
        'https://svnczxevigicuskppyfz.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU'
      )
    };
    
    await testClient('Direct SSL workaround', directClient);
  } catch (e) {
    console.error('Error testing direct workaround:', e);
  }
  
  console.log('\n=== TEST SUMMARY ===');
  console.log('If any approach worked, use that one consistently across the application.');
  console.log('The most reliable approach is setting NODE_TLS_REJECT_UNAUTHORIZED=0 before any Supabase imports.');
}

// Run all tests
runTests().catch(console.error);
