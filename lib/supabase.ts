import { createClient } from '@supabase/supabase-js';

// Do not paste your actual URL here. 
// This code tells the app to pull the keys from your Vercel Environment Variables.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
