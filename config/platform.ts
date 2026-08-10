/**
 * Konfigurasi identitas platform DOHub.
 * Ganti PLATFORM_LOGO_URL untuk pasang logo asli — cukup tempel URL gambar
 * (upload dulu ke Supabase Storage bucket 'branding' atau layanan lain).
 * Biarkan `null` untuk pakai badge huruf "D" bawaan (tidak perlu gambar).
 */
export const PLATFORM_NAME = 'DOHub';
export const PLATFORM_TAGLINE = 'Bimbel Management';
export const PLATFORM_LOGO_URL: string | null = null;
// Contoh setelah diisi:
// export const PLATFORM_LOGO_URL: string | null = 'https://xxxxx.supabase.co/storage/v1/object/public/branding/dohub-logo.png';