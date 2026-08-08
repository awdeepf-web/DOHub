'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { NAV_ITEMS, ROLE_LABELS } from '@/utils/rbac';
import { Button } from '@/components/ui/button';
import { logoutAction } from '@/features/auth/auth.actions';
import type { Profile } from '@/types/database.types';

export function DashboardShell({
  profile,
  children,
}: {
  profile: Profile;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const visibleItems = NAV_ITEMS.filter((item) => item.allowedRoles.includes(profile.role));

  return (
    <div className="flex min-h-[calc(100vh-57px)]">
      {/* Overlay gelap di belakang sidebar saat dibuka (mobile only) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar: fixed drawer di mobile, statis di desktop */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-card transition-transform duration-200 ease-in-out',
          'md:static md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="text-lg font-bold">DOHub</p>
            <p className="text-xs text-muted-foreground">Bimbel Management</p>
          </div>
          <button
            type="button"
            className="md:hidden"
            onClick={() => setOpen(false)}
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="space-y-1 px-2">
          {visibleItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent',
                pathname === item.href
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Konten utama */}
      <div className="flex-1">
        <header className="flex items-center justify-between border-b px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="md:hidden"
              onClick={() => setOpen(true)}
              aria-label="Buka menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <p className="text-sm font-medium">{profile.full_name}</p>
              <p className="text-xs text-muted-foreground">{ROLE_LABELS[profile.role]}</p>
            </div>
          </div>
          <form action={logoutAction}>
            <Button type="submit" variant="outline" size="sm">
              Keluar
            </Button>
          </form>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}