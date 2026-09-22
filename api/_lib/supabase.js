import { createClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase client.
 *
 * The service_role key bypasses RLS, so it must never reach a browser. This
 * module is imported only from `/api` functions, and Vite bundles `src/` alone,
 * which means it cannot end up in the client bundle.
 */
let cached = null;

export function supabase() {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set.');
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { 'x-application-name': 'theone-analytics' } },
  });
  return cached;
}
