import { authService } from '@/services/auth.service';
import { createClient } from '@/services/supabase/server';
import { OrganizationRepository } from '@/repositories/organization.repository';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROLE_LABELS } from '@/utils/rbac';

export default async function DashboardPage() {
  const profile = await authService.getCurrentProfile();
  const supabase = createClient();
  const orgRepository = new OrganizationRepository(supabase);
  const organization = profile ? await orgRepository.findById(profile.organization_id) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Selamat datang, {profile?.full_name ?? 'Pengguna'} 👋
        </h1>
        <p className="text-muted-foreground">
          {organization?.name ?? 'Bimbel kamu'} — Role: {profile ? ROLE_LABELS[profile.role] : '-'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total Siswa</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total Guru</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total Kelas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}