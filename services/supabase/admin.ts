import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

/**
 * ADMIN CLIENT — HANYA UNTUK SERVER, JANGAN PERNAH DIIMPORT DI CLIENT COMPONENT.
 * Pakai SERVICE_ROLE_KEY yang bisa bypass RLS.
 * Dipakai khusus untuk operasi sebelum user punya profile,
 * misalnya membuat Organization baru saat proses registrasi.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

export type TypedSupabaseAdminClient = ReturnType<typeof createAdminClient>;