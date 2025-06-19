# Supabase API Key Update

Date: June 19, 2025

## Summary

The Supabase API key has been updated to the new key format:
- New API Key: `sb_publishable_SwYftYe96k-CZCD6UFLOrg_tFWUI55b`
- Previous Key: JWT format starting with "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

## Files Updated

1. `.env` - Updated the `VITE_SUPABASE_ANON_KEY` environment variable
2. `index.html` - Updated the global `window.SUPABASE_ANON_KEY` variable
3. `src/lib/browser-safe-supabase.ts` - Updated the fallback key value
4. `src/lib/env-config.js` - Updated the fallback key in the `getSupabaseConfig` function
5. `src/lib/supabase.mjs` - Updated both the browser and Node.js fallback keys
6. `src/lib/supabase.ts` - Updated the hardcoded `supabaseAnonKey` constant

## Verification

To verify the changes, run the application and check that:
1. Authentication works correctly
2. Data is properly fetched from Supabase
3. There are no errors in the browser console related to authentication or API access

## Notes

- The URL for the Supabase project remains the same: `https://svnczxevigicuskppyfz.supabase.co`
- The new key uses Supabase's new key format which follows the pattern `sb_publishable_*`
- Any server-side scripts that use Supabase may need to be updated separately if they access the key directly instead of through environment variables

## Testing Plan

1. Test authentication flow (sign in, sign up, password reset)
2. Test data fetching from all collections that the app uses
3. Test any operations that write data to Supabase (if applicable)
4. Verify that real-time subscriptions work (if applicable)
