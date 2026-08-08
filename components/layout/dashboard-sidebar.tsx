'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import { NAV_ITEMS } from '@/utils/rbac';
import type { UserRole } from '@/types/database.types';

export function DashboardSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const visibleItems = NAV_ITEMS.filter((item) => item.allowedRoles.includes(role));

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-card md:block">
      <div className="p-4">
        <p className="text-lg font-bold">DOHub</p>
        <p className="text-xs text-muted-foreground">Bimbel Management</p>
      </div>
      <nav className="space-y-1 px-2">
        {visibleItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
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
  );
}