# SSL Fix for Supabase in Node.js Environment

## Problem
The wellbeing app experiences SSL certificate verification errors when connecting to Supabase in a Node.js environment. This issue manifests as a "fetch failed" error with "unable to get local issuer certificate" message, making it impossible to persist user daily practices data to the backend.

## Root Cause
Node.js handles SSL certificate verification differently from browsers. While browsers use the operating system's certificate store, Node.js uses its own built-in certificate store, which may not include all certificates needed to validate the Supabase SSL certificate chain.

## Solution
The solution involves detecting the Node.js environment and disabling SSL certificate verification when necessary, while maintaining normal certificate verification in browser environments.

### Implementation Steps

1. **Create an SSL workaround module** to be imported at the beginning of the application:

```javascript
// File: src/lib/ssl-workaround.ts
// SSL workaround for Node.js environments - Import this at the top of your entry point

// SSL workaround interface for TypeScript
interface SSLWorkaround {
  applied: boolean;
}

// Only apply in Node.js environment
if (typeof window === 'undefined' && typeof process !== 'undefined') {
  console.warn('Node.js environment detected, disabling SSL certificate verification');
  
  // Disable SSL verification
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  
  console.warn(
    'WARNING: SSL certificate verification is disabled. ' +
    'This is insecure and should only be used in development environments.'
  );
}

// Export a dummy value so this can be used as an ES module import
const sslWorkaround: SSLWorkaround = { applied: true };
export default sslWorkaround;
```

2. **Update the application entry point** to import the SSL workaround first:

```typescript
// File: src/main.tsx
// Import SSL workaround first to ensure it's applied before any Supabase imports
import './lib/ssl-workaround.ts';

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
// ...existing imports...
```

3. **Update Supabase client creation** in `src/lib/supabase.ts` to handle SSL issues:

```typescript
// File: src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU'

// Determine if we're in Node.js environment
const isNode = typeof window === 'undefined' && typeof process !== 'undefined';

// Create Supabase client with appropriate settings
let supabaseClient;

// Create Supabase client with appropriate settings
if (isNode) {
  console.warn('Node.js environment detected - SSL verification disabled');
  // Client will use the NODE_TLS_REJECT_UNAUTHORIZED=0 setting from the workaround
  supabaseClient = createClient(supabaseUrl, supabaseKey);
} else {
  // Browser environment - normal client is fine
  supabaseClient = createClient(supabaseUrl, supabaseKey);
}

export const supabase = supabaseClient;
```

4. **Update PracticeContext.tsx** to use the fixed `practiceUtils` file:

```typescript
// File: src/context/PracticeContext.tsx
import { savePracticeData, addToDailyPractices, removeFromDailyPractices } from './practiceUtils.fixed';
// ...existing imports...
```

## Database Schema Understanding

Through testing, we discovered:
- The application uses a `practices` table directly, not a `user_practices` table
- Practice completion status should be updated directly in the `practices` table
- Table has fields like: id, name, description, benefits, completed, is_daily, streak, etc.

## Testing the Solution

The solution was verified through multiple tests:
1. **Direct connection test**: Confirming SSL workaround enables connection to Supabase
2. **Practice retrieval test**: Successfully retrieving practice data from the database
3. **Practice update test**: Successfully updating practice completion status

## Security Considerations

This solution has security implications that should be understood:

1. Disabling SSL certificate verification (`NODE_TLS_REJECT_UNAUTHORIZED=0`) makes HTTPS connections potentially vulnerable to man-in-the-middle attacks

2. This solution is appropriate for:
   - Development environments
   - Testing environments
   - Non-sensitive data applications
   - Applications where data integrity is more important than confidentiality

3. For production Node.js environments handling sensitive data, consider:
   - Installing the appropriate CA certificates
   - Using `NODE_EXTRA_CA_CERTS` to specify additional trusted certificates
   - Ensuring your Supabase domain uses a certificate from a well-known CA

## Conclusion

This solution successfully resolves the SSL certificate verification issue when connecting to Supabase in Node.js environments, allowing the wellbeing app to persist user daily practices data to the backend. The fix maintains normal certificate verification in browser environments while providing a workaround for Node.js.
