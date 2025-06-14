/**
 * Debug helper utilities for troubleshooting application issues
 */

/**
 * Log important configuration and environment info
 */
export const logEnvironmentInfo = () => {
  console.log('---------- Environment Info ----------');
  console.log(`Node Environment: ${import.meta.env.MODE}`);
  console.log(`Base URL: ${import.meta.env.BASE_URL}`);
  console.log(`Supabase URL Set: ${!!import.meta.env.VITE_SUPABASE_URL}`);
  console.log(`Supabase Key Set: ${!!import.meta.env.VITE_SUPABASE_ANON_KEY}`);
  console.log('-------------------------------------');
};

/**
 * Inject a debugging script into the app for console access
 */
export const injectDebugger = () => {
  if (import.meta.env.DEV) {
    // @ts-ignore
    window.debugApp = {
      resetLocalStorage: () => {
        localStorage.clear();
        console.log('Local storage cleared');
        return 'Local storage cleared. Please refresh the page.';
      },
      checkLocalStorage: () => {
        const items = { ...localStorage };
        console.log('Local storage items:', items);
        return items;
      },
      checkSessionStorage: () => {
        const items = { ...sessionStorage };
        console.log('Session storage items:', items);
        return items;
      },
      reloadApp: () => {
        window.location.reload();
        return 'Reloading application...';
      }
    };
    console.log('%c🔧 Debug tools available via window.debugApp', 'background: #333; color: #bada55; padding: 4px;');
  }
};

/**
 * Add this to your main.tsx or index.tsx to enable debugging
 */
export const setupDebugMode = () => {
  if (import.meta.env.DEV) {
    logEnvironmentInfo();
    injectDebugger();
    
    // Add console error handler
    const originalConsoleError = console.error;
    console.error = function(...args) {
      // Add any custom error logging here if needed
      originalConsoleError.apply(console, args);
    };
  }
};
