import { createClient } from '@supabase/supabase-js';

let supabase;

export function getSupabaseClient() {
  if (supabase) {
    return supabase;
  }

  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const publishableKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      'Falta configurar PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_PUBLISHABLE_KEY. Consulta SUPABASE_SETUP.md.',
    );
  }

  supabase = createClient(url, publishableKey, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
    },
  });

  return supabase;
}
