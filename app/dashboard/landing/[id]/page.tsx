import { notFound, redirect } from 'next/navigation';
import { requireProfile } from '@/utils/guard';
import { hasPermission } from '@/utils/rbac';
import { landingService } from '@/services/landing.service';
import { SectionForm } from '@/features/landing/components/section-form';
import { updateSectionAction } from '@/features/landing/landing.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function EditSectionPage({ params }: { params: { id: string } }) {
  const profile = await requireProfile();
  if (!hasPermission(profile.role, 'landing:manage')) {
    redirect('/dashboard/landing');
  }

  const section = await landingService.getById(params.id);
  if (!section || section.organization_id !== profile.organization_id) {
    notFound();
  }

  const boundAction = updateSectionAction.bind(null, section.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Konten Landing Page</CardTitle>
      </CardHeader>
      <CardContent>
        <SectionForm section={section} action={boundAction} />
      </CardContent>
    </Card>
  );
}