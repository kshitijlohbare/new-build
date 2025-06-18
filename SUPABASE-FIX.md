# Supabase Connection Issue Fix

## Problem Diagnosed

The application is failing to connect to Supabase with the following error:
```
Invalid API key
Double check your Supabase `anon` or `service_role` API key.
```

After thorough investigation, I've determined that:

1. The Supabase project URL `https://svnczxevigicuskppyfz.supabase.co` is still valid
2. The API key being used in the application is either:
   - Expired
   - Has been rotated/regenerated
   - Is invalid for the current project

## How to Fix

### Step 1: Get Your Current Supabase API Key

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Login with your credentials
3. Select the project with ID `svnczxevigicuskppyfz` (or look for your project name)
4. Go to Project Settings → API
5. Copy the "anon public" key (or "service_role" key if you need higher permissions)

### Step 2: Update Your API Key

The API key needs to be updated in these locations:

1. `.env` file:
   ```
   VITE_SUPABASE_ANON_KEY=your_new_key_here
   ```

2. `public/supabase-dev.js`:
   ```javascript
   window.SUPABASE_ANON_KEY = 'your_new_key_here';
   ```
   
3. `index.html`:
   ```html
   window.SUPABASE_ANON_KEY = 'your_new_key_here';
   ```

### Step 3: Restart Development Server

After updating the keys, restart your development server:

```
npm run dev
```

## Verification

To verify the connection is working:

1. Check browser console for any remaining Supabase errors
2. Try to login to the application 
3. Verify data loading on the Therapist Listing page

If you continue to have issues, check:
1. Supabase project status in the dashboard
2. Network connectivity to Supabase servers
3. CORS settings for your domain
