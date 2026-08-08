import type { createClient } from '@/services/supabase/server';

/**
 * Tipe client yang dipakai di semua repository.
 * Diambil langsung dari return type createClient() (bukan generic manual),
 * supaya selalu sinkron dengan versi @supabase/ssr & @supabase/supabase-js
 * yang benar-benar terinstall, apapun versinya.
 */
export type TypedSupabaseClient = ReturnType<typeof createClient>;