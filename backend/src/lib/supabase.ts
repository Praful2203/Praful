import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY!;

// Client for public operations (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client for admin/server operations (uses service role key, bypassing RLS)
export const getServiceSupabase = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseServiceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined');
  return createClient(supabaseUrl, supabaseServiceKey);
}
