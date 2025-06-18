// Environment configuration for browser
const env = {
  // Default to 'development' if not set
  NODE_ENV: import.meta.env.MODE || 'development',
  
  // Supabase
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  
  // Email provider settings (default to mock in development)
  EMAIL_PROVIDER: import.meta.env.VITE_EMAIL_PROVIDER || 'mock',
  EMAIL_FROM: import.meta.env.VITE_EMAIL_FROM || 'noreply@mindfulcare.com',
  
  // SendGrid
  SENDGRID_API_KEY: import.meta.env.VITE_SENDGRID_API_KEY,
  
  // Mailgun
  MAILGUN_API_KEY: import.meta.env.VITE_MAILGUN_API_KEY,
  MAILGUN_DOMAIN: import.meta.env.VITE_MAILGUN_DOMAIN,
  
  // AWS SES
  AWS_REGION: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  AWS_ACCESS_KEY_ID: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  
  // Application URLs
  NEXT_PUBLIC_APP_URL: import.meta.env.VITE_APP_URL || 'http://localhost:5174',
  
  // Redis (if applicable in browser context)
  REDIS_URL: import.meta.env.VITE_REDIS_URL,
  
  // Log level
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'info',
  
  // Google Calendar integration
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
  
  // Microsoft/Azure Outlook integration
  AZURE_TENANT_ID: import.meta.env.VITE_AZURE_TENANT_ID,
  AZURE_CLIENT_ID: import.meta.env.VITE_AZURE_CLIENT_ID,
  AZURE_CLIENT_SECRET: import.meta.env.VITE_AZURE_CLIENT_SECRET
};

export default env;
