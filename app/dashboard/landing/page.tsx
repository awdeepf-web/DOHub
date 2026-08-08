import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireProfile } from '@/utils/guard';
import { hasPermission } from '@/utils/rbac';
import { landingService } from '@/services/landing.service';
import { createClient } from '@/services/supabase/server';
import { OrganizationRepository } from '@/repositories/organization.repository';
import { SectionList } from '@/features/landing/components/section-list';
import { buttonVariants } from '@/components/ui/button';

export default async function LandingCmsPage() {
  const profile = await requireProfile();

  if (!hasPermission(profile.role, 'landing:manage')) {
    redirect('/dashboard');
  }

  const sections = await landingService.listForDashboard(profile.organization_id);

  const supabase = createClient();
  const orgRepository = new OrganizationRepository(supabase);
  const organization = await orgRepository.findById(profile.organization_id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Landing Page CMS</h1>
          <p className="text-sm text-muted-foreground">
            Kelola konten halaman publik bimbel kamu.{' '}
            {organization && (
              <Link
                href={`/l/${organization.slug}`}
                target="_blank"
                className="font-medium text-primary underline underline-offset-4"
              >
                Lihat halaman publik →
              </Link>
            )}
          </p>
        </div>
        <Link href="/dashboard/landing/tambah" className={buttonVariants({ variant: 'default' })}>
          + Tambah Konten
        </Link>
      </div>

      <SectionList sections={sections} />
    </div>
  );
}