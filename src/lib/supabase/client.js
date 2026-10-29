import { createClient } from '@supabase/supabase-js';

let supabase;

export function getSupabaseClient() {
  if (supabase) {
    return supabase;
  }

  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Falta configurar PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_ANON_KEY. Consulta SUPABASE_SETUP.md.',
    );
  }

  supabase = createClient(url, anonKey, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
    },
  });

  return supabase;
}
