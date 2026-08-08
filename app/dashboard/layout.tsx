import { redirect } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { brandingService } from '@/services/branding.service';
import { DashboardShell } from '@/components/layout/dashboard-shell';

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
    <div style={themeStyle}>
      <DashboardShell profile={profile}>{children}</DashboardShell>
    </div>
  );
}