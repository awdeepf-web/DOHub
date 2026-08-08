import type { UserRole } from '@/types/database.types';

/**
 * Daftar permission per role.
 * Tambahkan permission baru di sini setiap kali ada modul baru,
 * supaya semua pengecekan akses terpusat di 1 tempat.
 */
export const ROLE_PERMISSIONS = {
  owner: [
    'organization:manage',
    'user:manage',
    'student:manage',
    'teacher:manage',
    'class:manage',
    'schedule:manage',
    'attendance:manage',
    'payment:manage',
    'invoice:manage',
    'report:view',
    'landing:manage',
    'branding:manage',
    'settings:manage',
  ],
  admin: [
    'user:manage',
    'student:manage',
    'teacher:manage',
    'class:manage',
    'schedule:manage',
    'attendance:manage',
    'payment:manage',
    'invoice:manage',
    'report:view',
    'landing:manage',
    'branding:manage',
  ],
  guru: ['class:view', 'schedule:view', 'attendance:manage', 'student:view'],
  finance: ['payment:manage', 'invoice:manage', 'report:view', 'student:view'],
} as const satisfies Record<UserRole, readonly string[]>;

export type Permission = (typeof ROLE_PERMISSIONS)[UserRole][number];

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions: readonly string[] = ROLE_PERMISSIONS[role];
  return permissions.includes(permission);
}

export const ROLE_LABELS: Record<UserRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  guru: 'Guru',
  finance: 'Finance',
};

/**
 * Daftar menu sidebar per role — dipakai di dashboard-sidebar.tsx
 * supaya menu yang tidak relevan tidak ditampilkan ke role tsb.
 */
export const NAV_ITEMS: {
  label: string;
  href: string;
  allowedRoles: UserRole[];
}[] = [
  { label: 'Dashboard', href: '/dashboard', allowedRoles: ['owner', 'admin', 'guru', 'finance'] },
  { label: 'Siswa', href: '/dashboard/siswa', allowedRoles: ['owner', 'admin', 'guru', 'finance'] },
  { label: 'Guru', href: '/dashboard/guru', allowedRoles: ['owner', 'admin'] },
  { label: 'Kelas', href: '/dashboard/kelas', allowedRoles: ['owner', 'admin', 'guru'] },
  { label: 'Jadwal', href: '/dashboard/jadwal', allowedRoles: ['owner', 'admin', 'guru'] },
  { label: 'Absensi', href: '/dashboard/absensi', allowedRoles: ['owner', 'admin', 'guru'] },
  { label: 'Pembayaran', href: '/dashboard/pembayaran', allowedRoles: ['owner', 'admin', 'finance'] },
  { label: 'Invoice', href: '/dashboard/invoice', allowedRoles: ['owner', 'admin', 'finance'] },
  { label: 'Laporan', href: '/dashboard/laporan', allowedRoles: ['owner', 'admin', 'finance'] },
  { label: 'Landing Page', href: '/dashboard/landing', allowedRoles: ['owner', 'admin'] },
  { label: 'Branding', href: '/dashboard/branding', allowedRoles: ['owner', 'admin'] },
  { label: 'User Management', href: '/dashboard/users', allowedRoles: ['owner', 'admin'] },
  { label: 'Settings', href: '/dashboard/settings', allowedRoles: ['owner', 'admin'] },
];