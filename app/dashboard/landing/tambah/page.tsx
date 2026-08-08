import { redirect } from 'next/navigation';
import { requireProfile } from '@/utils/guard';
import { hasPermission } from '@/utils/rbac';
import { SectionForm } from '@/features/landing/components/section-form';
import { createSectionAction } from '@/features/landing/landing.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function TambahSectionPage() {
  const profile = await requireProfile();
  if (!hasPermission(profile.role, 'landing:manage')) {
    redirect('/dashboard/landing');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambah Konten Landing Page</CardTitle>
      </CardHeader>
      <CardContent>
        <SectionForm action={createSectionAction} />
      </CardContent>
    </Card>
  );
}