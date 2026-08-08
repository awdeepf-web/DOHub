import { redirect } from 'next/navigation';
import { requireProfile } from '@/utils/guard';
import { hasPermission } from '@/utils/rbac';
import { brandingService } from '@/services/branding.service';
import { BrandingForm } from '@/features/branding/components/branding-form';
import { LogoUploadForm } from '@/features/branding/components/logo-upload-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function BrandingPage() {
  const profile = await requireProfile();

  if (!hasPermission(profile.role, 'branding:manage')) {
    redirect('/dashboard');
  }

  const organization = await brandingService.getById(profile.organization_id);
  if (!organization) {
    redirect('/dashboard');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Branding</h1>
        <p className="text-sm text-muted-foreground">
          Atur identitas visual bimbel kamu — tampil di dashboard dan landing page.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Logo</CardTitle>
        </CardHeader>
        <CardContent>
          <LogoUploadForm currentLogoUrl={organization.logo_url} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi & Tema</CardTitle>
        </CardHeader>
        <CardContent>
          <BrandingForm organization={organization} />
        </CardContent>
      </Card>
    </div>
  );
}