import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.https://supabase.com/dashboard/project/uwzhqurqzqsooybixqny/settings/api-keys!;
const supabaseAnonKey = process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3emhxdXJxenFzb295Yml4cW55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4OTM4MDEsImV4cCI6MjA4NjQ2OTgwMX0.sRDGUFir6G2fXD5pGf8FEEQP-_0BtNGLflbAZ-tNQZw!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
