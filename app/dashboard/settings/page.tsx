import { requireProfile } from '@/utils/guard';
import { brandingService } from '@/services/branding.service';
import { ProfileSettingsForm } from '@/features/settings/components/profile-settings-form';
import { ChangePasswordForm } from '@/features/settings/components/change-password-form';
import { OrganizationSettingsForm } from '@/features/settings/components/organization-settings-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function SettingsPage() {
  const profile = await requireProfile();
  const organization = await brandingService.getById(profile.organization_id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Kelola profil dan pengaturan akun kamu.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profil Saya</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileSettingsForm profile={profile} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ganti Password</CardTitle>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>

      {profile.role === 'owner' && organization && (
        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Organisasi</CardTitle>
          </CardHeader>
          <CardContent>
            <OrganizationSettingsForm organization={organization} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}