import { createClient } from '@supabase/supabase-js';

// Log all environment variables for debugging
console.log('All env vars:', {
  SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL,
  SUPABASE_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY,
  NODE_ENV: process.env.NODE_ENV
});

const supabaseUrl = 'https://awpnlpnhbcosqqqenmso.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3cG5scG5oYmNvc3FxcWVubXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1NDQxNzcsImV4cCI6MjA0ODEyMDE3N30.QZ4BrkXN9uqKHcVjrkvZ3AjIEWgGynW2-r7O7Rj_GJ8';

console.log('Creating Supabase client with:', {
  url: supabaseUrl,
  key: supabaseAnonKey
});

const client = createClient(supabaseUrl, supabaseAnonKey);

// Test the client
client.auth.getSession().then(({ data, error }) => {
  console.log('Initial session check:', { data, error });
}).catch(err => {
  console.error('Session check error:', err);
});

export const supabase = client;
