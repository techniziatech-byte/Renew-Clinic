import { createClient } from '@supabase/supabase-js';
import mockSupabase from './demoData';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

const isDemoMode = !supabaseUrl || 
                   !supabaseAnonKey || 
                   supabaseUrl === 'https://placeholder.supabase.co' ||
                   supabaseUrl.includes('your-project') ||
                   supabaseUrl === 'undefined';

if (isDemoMode) {
  console.warn('Running in Demo Mode (Local Storage). Supabase credentials missing or invalid.');
}

export const supabase = isDemoMode 
  ? (mockSupabase as any) 
  : createClient(supabaseUrl, supabaseAnonKey);
