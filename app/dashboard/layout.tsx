import { redirect } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { brandingService } from '@/services/branding.service';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { logoutAction } from '@/features/auth/auth.actions';
import { ROLE_LABELS } from '@/utils/rbac';
import { Button } from '@/components/ui/button';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await authService.getCurrentProfile();

  if (!profile) {
    redirect('/login');
  }

  const organization = await brandingService.getById(profile.organization_id);

  const themeStyle = organization
    ? ({ '--brand-primary': organization.theme_primary_color } as React.CSSProperties)
    : undefined;

  return (
    <div className="flex min-h-[calc(100vh-57px)]" style={themeStyle}>
      <DashboardSidebar role={profile.role} />
      <div className="flex-1">
        <header className="flex items-center justify-between border-b px-6 py-3">
          <div>
            <p className="text-sm font-medium">{profile.full_name}</p>
            <p className="text-xs text-muted-foreground">{ROLE_LABELS[profile.role]}</p>
          </div>
          <form action={logoutAction}>
            <Button type="submit" variant="outline" size="sm">
              Keluar
            </Button>
          </form>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}