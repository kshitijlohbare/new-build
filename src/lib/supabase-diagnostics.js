/**
 * Supabase Connection Diagnostic Tool
 * 
 * This file provides diagnostic utilities to test and validate Supabase connections.
 * It can be used to identify and troubleshoot connection issues in both development and production.
 */

import { supabase } from './browser-safe-supabase';
import { getSupabaseConfig } from './env-config';

export async function testSupabaseConnection() {
  // Get configuration details
  const { supabaseUrl, supabaseKey } = getSupabaseConfig();
  
  console.group('Supabase Connection Test');
  console.log('Testing Supabase connection...');
  
  // Check configuration
  const configCheck = {
    urlConfigured: !!supabaseUrl,
    keyConfigured: !!supabaseKey,
    clientInitialized: !!supabase?.from,
    environment: typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'development' : 'production'
  };
  
  console.log('Configuration check:', configCheck);
  
  // Test actual connection with simple query
  let connectionResult = { success: false, latency: 0, error: null, message: '' };
  
  try {
    const startTime = performance.now();
    
    // Simple query to test connection
    const { data, error } = await supabase
      .from('practices')
      .select('id')
      .limit(1);
      
    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);
    
    if (error) {
      connectionResult = {
        success: false,
        latency,
        error: error.message,
        message: `Connection error: ${error.message} (${error.code || 'no code'})`
      };
      console.error('Connection test failed:', error);
    } else {
      connectionResult = {
        success: true,
        latency,
        error: null,
        message: `Connection successful! Latency: ${latency}ms`
      };
      console.log('Connection test successful!');
      console.log(`Latency: ${latency}ms`);
    }
  } catch (err) {
    connectionResult = {
      success: false,
      latency: 0,
      error: err instanceof Error ? err.message : String(err),
      message: `Exception during connection test: ${err instanceof Error ? err.message : String(err)}`
    };
    console.error('Exception during connection test:', err);
  }

  // Full diagnosis result  
  const diagnosticResult = {
    ...configCheck,
    connection: connectionResult,
    timestamp: new Date().toISOString(),
    clientType: 'browser'
  };
  
  console.log('Diagnostic result:', diagnosticResult);
  console.groupEnd();
  
  return diagnosticResult;
}

// Function to fix common Supabase issues
export async function attemptSupabaseConnectionFix() {
  console.log('Attempting to fix Supabase connection issues...');
  
  // Clear any cached tokens that might be invalid
  try {
    await supabase.auth.signOut();
    console.log('Cleared auth session');
  } catch (err) {
    console.error('Error clearing auth session:', err);
  }
  
  // Reload environment config
  const { supabaseUrl, supabaseKey } = getSupabaseConfig();
  
  // Log important details for debugging
  console.log('Environment check:', {
    windowSupabaseUrl: typeof window !== 'undefined' ? !!window.SUPABASE_URL : false,
    windowSupabaseKey: typeof window !== 'undefined' ? (!!window.SUPABASE_ANON_KEY && window.SUPABASE_ANON_KEY.substring(0, 10) + '...') : false,
    envSupabaseUrl: !!supabaseUrl,
    envSupabaseKey: !!supabaseKey && supabaseKey.substring(0, 10) + '...'
  });
  
  // Test the connection after fixes
  return await testSupabaseConnection();
}
