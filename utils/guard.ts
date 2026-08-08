import { redirect } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { hasPermission, type Permission } from '@/utils/rbac';
import type { Profile } from '@/types/database.types';

/**
 * Dipakai di Server Component (page.tsx / layout.tsx).
 * Kalau belum login, otomatis redirect ke /login.
 */
export async function requireProfile(): Promise<Profile> {
  const profile = await authService.getCurrentProfile();
  if (!profile) {
    redirect('/login');
  }
  return profile;
}

/**
 * Dipakai di dalam Server Action untuk cek hak akses.
 * Kalau tidak punya izin, lempar Error dengan pesan yang aman ditampilkan ke user.
 */
export function assertPermission(profile: Profile, permission: Permission): void {
  if (!hasPermission(profile.role, permission)) {
    throw new Error('Anda tidak memiliki akses untuk melakukan aksi ini');
  }
}